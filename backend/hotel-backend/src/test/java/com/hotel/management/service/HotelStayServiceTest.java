package com.hotel.management.service;

import com.hotel.management.dto.HotelStayResponse;
import com.hotel.management.model.HotelGuest;
import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.repository.HotelStayRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

public class HotelStayServiceTest {

    @Mock
    private HotelStayRepository stayRepository;

    @Mock
    private HotelGuestRepository guestRepository;

    private HotelStayService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        service = new HotelStayService(stayRepository, guestRepository);
    }

    @Test
    void calculateStayCost_weekday_no_car() {
        LocalDateTime checkin = LocalDateTime.of(2025, 10, 20, 15, 0); // Monday
        LocalDateTime checkout = LocalDateTime.of(2025, 10, 21, 10, 0); // next day before 12

        double cost = service.calculateStayCost(checkin, checkout, false);
        // Current logic counts each calendar day inclusively, so two weekdays => 120 *
        // 2 = 240
        assertThat(cost).isEqualTo(240.00);
    }

    @Test
    void calculateStayCost_weekend_with_car_and_late_checkout() {
        LocalDateTime checkin = LocalDateTime.of(2025, 10, 18, 15, 0); // Saturday
        LocalDateTime checkout = LocalDateTime.of(2025, 10, 19, 13, 0); // Sunday after 12 -> surcharge applies on last
                                                                        // day

        double cost = service.calculateStayCost(checkin, checkout, true);

        // Saturday: daily 180 + car 20 = 200
        // Sunday (last day): daily 180 + car 20 + 50% surcharge on daily (180 * 0.5 =
        // 90) => 290
        // Total = 200 + 290 = 490
        assertThat(cost).isEqualTo(490.0);
    }

    @Test
    void createReservation_guestNotFound_throws() {
        when(guestRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.createReservation(99L));
    }

    @Test
    void checkIn_and_checkOut_happy_path() {
        HotelGuest guest = new HotelGuest();
        guest.setId(2L);
        guest.setHasCar(true);

        HotelStay stay = new HotelStay();
        stay.setId(10L);
        stay.setHotelGuest(guest);
        stay.setStatus(HotelStayStatus.RESERVED);

        when(stayRepository.findById(10L)).thenReturn(Optional.of(stay));
        when(stayRepository.save(stay)).thenReturn(stay);

        LocalDateTime checkin = LocalDateTime.of(2025, 10, 21, 15, 0);
        HotelStayResponse afterCheckIn = service.checkIn(10L, checkin);
        assertThat(afterCheckIn.getStatus()).isEqualTo(HotelStayStatus.CHECKED_IN);

        // Prepare for checkout: set checkin time in the stay object (service uses
        // repository-managed object)
        stay.setCheckinTime(checkin);
        stay.setStatus(HotelStayStatus.CHECKED_IN);

        when(stayRepository.findById(10L)).thenReturn(Optional.of(stay));

        LocalDateTime checkout = LocalDateTime.of(2025, 10, 22, 13, 0);
        HotelStayResponse afterCheckout = service.checkOut(10L, checkout);
        assertThat(afterCheckout.getStatus()).isEqualTo(HotelStayStatus.CHECKED_OUT);
        assertThat(afterCheckout.getTotalAmount()).isGreaterThan(0.0);
    }
}
