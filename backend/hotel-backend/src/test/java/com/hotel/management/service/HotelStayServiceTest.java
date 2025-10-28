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
import static org.mockito.ArgumentMatchers.any;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import java.time.LocalDateTime;
import java.util.Optional;
import java.time.LocalDate;
import com.hotel.management.dto.DashboardResponse;
import com.hotel.management.exception.ResourceNotFoundException;

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

        assertThrows(ResourceNotFoundException.class, () -> service.createReservation(99L, null, null, null));
    }

    @Test
    void createReservation_success_maps_planned_fields() {
        HotelGuest guest = new HotelGuest();
        guest.setId(2L);

        when(guestRepository.findById(2L)).thenReturn(Optional.of(guest));

        // Simulate repository assigning an ID on save and return the persisted entity
        when(stayRepository.save(any(HotelStay.class))).thenAnswer(new Answer<HotelStay>() {
            @Override
            public HotelStay answer(InvocationOnMock invocation) {
                HotelStay s = invocation.getArgument(0);
                s.setId(123L);
                return s;
            }
        });

        java.time.LocalDate start = java.time.LocalDate.of(2025, 11, 1);
        java.time.LocalDate end = java.time.LocalDate.of(2025, 11, 5);
        Integer guests = 2;

        HotelStayResponse resp = service.createReservation(2L, start, end, guests);

        assertThat(resp.getId()).isEqualTo(123L);
        assertThat(resp.getPlannedStartDate()).isEqualTo(start);
        assertThat(resp.getPlannedEndDate()).isEqualTo(end);
        assertThat(resp.getNumberOfGuests()).isEqualTo(guests);
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

    @Test
    void getDashboardMetrics_returns_expected_aggregates() {
        // prepare repository mock responses
        when(stayRepository.countPlannedOverlappingPeriod(any(LocalDate.class), any(LocalDate.class))).thenReturn(3L);
        when(stayRepository.countByStatus(HotelStayStatus.CHECKED_IN)).thenReturn(2L);
        when(stayRepository.sumNumberOfGuestsByStatus(HotelStayStatus.CHECKED_IN)).thenReturn(5L);
        when(stayRepository.countWithCarByStatus(HotelStayStatus.CHECKED_IN)).thenReturn(1L);

        DashboardResponse resp = service.getDashboardMetrics();

        assertThat(resp.getTotalReservations()).isEqualTo(3L);
        assertThat(resp.getTotalActiveCheckins()).isEqualTo(2L);
        assertThat(resp.getTotalCurrentGuests()).isEqualTo(5L);
        assertThat(resp.getTotalCurrentCars()).isEqualTo(1L);
    }

    @Test
    void deleteReservationIfReserved_success_when_reserved() {
        HotelGuest guest = new HotelGuest();
        guest.setId(2L);

        HotelStay stay = new HotelStay();
        stay.setId(50L);
        stay.setHotelGuest(guest);
        stay.setStatus(HotelStayStatus.RESERVED);

        when(stayRepository.findById(50L)).thenReturn(Optional.of(stay));

        // Should not throw
        service.deleteReservationIfReserved(50L);

        // verify delete called
        org.mockito.Mockito.verify(stayRepository).delete(stay);
    }

    @Test
    void deleteReservationIfReserved_throws_when_not_reserved() {
        HotelGuest guest = new HotelGuest();
        guest.setId(2L);

        HotelStay stay = new HotelStay();
        stay.setId(51L);
        stay.setHotelGuest(guest);
        stay.setStatus(HotelStayStatus.CHECKED_IN);

        when(stayRepository.findById(51L)).thenReturn(Optional.of(stay));

        assertThrows(IllegalArgumentException.class, () -> service.deleteReservationIfReserved(51L));
    }
}
