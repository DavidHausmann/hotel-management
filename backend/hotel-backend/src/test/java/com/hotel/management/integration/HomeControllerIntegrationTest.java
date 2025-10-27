package com.hotel.management.integration;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.repository.HotelStayRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.test.context.ActiveProfiles("test")
public class HomeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HotelGuestRepository guestRepository;

    @Autowired
    private HotelStayRepository stayRepository;

    @BeforeEach
    void setupData() {
        stayRepository.deleteAll();
        guestRepository.deleteAll();

        // Guest 1 has car
        HotelGuest g1 = new HotelGuest();
        g1.setName("Alice");
        g1.setDocument("111.111.111-11");
        g1.setPhone("(11)99999-1111");
        g1.setHasCar(true);
        guestRepository.save(g1);

        // Guest 2 no car
        HotelGuest g2 = new HotelGuest();
        g2.setName("Bob");
        g2.setDocument("222.222.222-22");
        g2.setPhone("(11)99999-2222");
        g2.setHasCar(false);
        guestRepository.save(g2);

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        // Reservation overlapping current month
        HotelStay r1 = new HotelStay();
        r1.setHotelGuest(g2);
        r1.setStatus(HotelStayStatus.RESERVED);
        r1.setPlannedStartDate(monthStart.minusDays(1));
        r1.setPlannedEndDate(monthStart.plusDays(2));
        stayRepository.save(r1);

        // Active checkin 1 (guest with car)
        HotelStay s1 = new HotelStay();
        s1.setHotelGuest(g1);
        s1.setStatus(HotelStayStatus.CHECKED_IN);
        s1.setCheckinTime(LocalDateTime.now().minusDays(1));
        s1.setNumberOfGuests(2);
        stayRepository.save(s1);

        // Active checkin 2 (guest without car)
        HotelStay s2 = new HotelStay();
        s2.setHotelGuest(g2);
        s2.setStatus(HotelStayStatus.CHECKED_IN);
        s2.setCheckinTime(LocalDateTime.now().minusHours(5));
        s2.setNumberOfGuests(1);
        stayRepository.save(s2);
    }

    @Test
    void homeEndpoint_returns_expected_metrics() throws Exception {
        mockMvc.perform(get("/api/home").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalReservations").value(1))
                .andExpect(jsonPath("$.totalActiveCheckins").value(2))
                .andExpect(jsonPath("$.totalCurrentGuests").value(3))
                .andExpect(jsonPath("$.totalCurrentCars").value(1));
    }
}
