package com.hotel.management.integration;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.repository.HotelStayRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class HotelStayDeleteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HotelGuestRepository guestRepository;

    @Autowired
    private HotelStayRepository stayRepository;

    @BeforeEach
    void cleanup() {
        stayRepository.deleteAll();
        guestRepository.deleteAll();
    }

    @Test
    void delete_reservation_success_persists_deletion() throws Exception {
        HotelGuest guest = new HotelGuest();
        guest.setName("Integration Guest");
        guest.setDocument("DOC123");
        guest.setPhone("11999990000");
        guest.setHasCar(false);
        guest = guestRepository.save(guest);

        HotelStay stay = new HotelStay();
        stay.setHotelGuest(guest);
        stay.setStatus(HotelStayStatus.RESERVED);
        stay.setPlannedStartDate(LocalDate.now());
        stay.setPlannedEndDate(LocalDate.now().plusDays(2));
        stay = stayRepository.save(stay);

        mockMvc.perform(delete("/api/stay/" + stay.getId()).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        assertThat(stayRepository.findById(stay.getId())).isEmpty();
    }

    @Test
    void delete_reservation_returns_bad_request_when_not_reserved() throws Exception {
        HotelGuest guest = new HotelGuest();
        guest.setName("Integration Guest 2");
        guest.setDocument("DOC124");
        guest.setPhone("11999990001");
        guest.setHasCar(false);
        guest = guestRepository.save(guest);

        HotelStay stay = new HotelStay();
        stay.setHotelGuest(guest);
        stay.setStatus(HotelStayStatus.CHECKED_IN);
        stay.setPlannedStartDate(LocalDate.now());
        stay.setPlannedEndDate(LocalDate.now().plusDays(1));
        stay = stayRepository.save(stay);

        mockMvc.perform(delete("/api/stay/" + stay.getId()).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void delete_reservation_returns_not_found_when_missing() throws Exception {
        // choose an id that does not exist
        mockMvc.perform(delete("/api/stay/999999").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
