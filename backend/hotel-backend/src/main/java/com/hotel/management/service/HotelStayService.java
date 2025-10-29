package com.hotel.management.service;

import com.hotel.management.dto.HotelStayResponse;
import com.hotel.management.model.HotelGuest;
import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import com.hotel.management.repository.HotelStayRepository;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class HotelStayService {

    private static final Logger log = LoggerFactory.getLogger(HotelStayService.class);

    private static final double DAILY_RATE_WEEKDAY = 120.00;
    private static final double DAILY_RATE_WEEKEND = 180.00;
    private static final double CAR_FEE_WEEKDAY = 15.00;
    private static final double CAR_FEE_WEEKEND = 20.00;
    private static final int CHECKOUT_HOUR_LIMIT = 12;
    private static final double LATE_CHECKOUT_SURCHARGE = 0.50;

    private final HotelStayRepository stayRepository;
    private final HotelGuestRepository hotelGuestRepository;

    private HotelStayResponse mapToResponse(HotelStay stay) {
        HotelStayResponse dto = new HotelStayResponse();
        dto.setId(stay.getId());
        dto.setCheckinTime(stay.getCheckinTime());
        dto.setCheckoutTime(stay.getCheckoutTime());
        dto.setStatus(stay.getStatus());
        dto.setTotalAmount(stay.getTotalAmount());

        if (stay.getHotelGuest() != null) {
            dto.setHotelGuestId(stay.getHotelGuest().getId());
        }
        dto.setPlannedStartDate(stay.getPlannedStartDate());
        dto.setPlannedEndDate(stay.getPlannedEndDate());
        dto.setNumberOfGuests(stay.getNumberOfGuests());
        return dto;
    }

    public HotelStayService(HotelStayRepository stayRepository, HotelGuestRepository hotelGuestRepository) {
        this.stayRepository = stayRepository;
        this.hotelGuestRepository = hotelGuestRepository;
    }

    public Page<HotelStayResponse> search(String name, String document, String phone, LocalDate start,
            LocalDate end, Pageable pageable) {
        String n = (name == null || name.isBlank()) ? null : name;
        String d = (document == null || document.isBlank()) ? null : document;
        String p = (phone == null || phone.isBlank()) ? null : phone;

        try {
            Page<HotelStay> page = stayRepository.findByFilters(n, d, p, start, end, pageable);
            return page.map(this::mapToResponse);
        } catch (Exception error) {

            log.warn("findByFilters failed, falling back to in-memory filtering", error);
            List<HotelStay> all = stayRepository.findAll();

            List<HotelStay> filtered = all.stream().filter(s -> {
                boolean ok = true;

                HotelGuest g = s.getHotelGuest();
                if (n != null) {
                    ok = g != null && g.getName() != null && g.getName().toLowerCase().contains(n.toLowerCase());
                }
                if (ok && d != null) {
                    ok = g != null && g.getDocument() != null
                            && g.getDocument().toLowerCase().contains(d.toLowerCase());
                }
                if (ok && p != null) {
                    ok = g != null && g.getPhone() != null && g.getPhone().toLowerCase().contains(p.toLowerCase());
                }

                if (ok && start != null) {
                    ok = s.getPlannedEndDate() != null && !s.getPlannedEndDate().isBefore(start);
                }
                if (ok && end != null) {
                    ok = s.getPlannedStartDate() != null && !s.getPlannedStartDate().isAfter(end);
                }

                return ok;
            }).toList();

            int total = filtered.size();
            int pageNum = pageable.getPageNumber();
            int size = pageable.getPageSize();
            int fromIndex = Math.min(pageNum * size, total);
            int toIndex = Math.min(fromIndex + size, total);
            List<HotelStay> pageContent = filtered.subList(fromIndex, toIndex);
            org.springframework.data.domain.Page<HotelStay> res = new org.springframework.data.domain.PageImpl<>(
                    pageContent, pageable, total);
            return res.map(this::mapToResponse);
        }
    }

    @Transactional
    public HotelStayResponse createReservation(Long hotelGuestId, java.time.LocalDate plannedStartDate,
            java.time.LocalDate plannedEndDate, Integer numberOfGuests) {
        HotelGuest hotelGuest = hotelGuestRepository.findById(hotelGuestId)
                .orElseThrow(() -> new ResourceNotFoundException("Hóspede não encontrado: " + hotelGuestId));

        HotelStay stay = new HotelStay();
        stay.setHotelGuest(hotelGuest);
        stay.setStatus(HotelStayStatus.RESERVED);
        stay.setPlannedStartDate(plannedStartDate);
        stay.setPlannedEndDate(plannedEndDate);
        stay.setNumberOfGuests(numberOfGuests);

        HotelStay saved = stayRepository.save(stay);
        return mapToResponse(saved);
    }

    public List<HotelStayResponse> findHotelGuestsCurrentlyInHotel() {
        return stayRepository.findByStatus(HotelStayStatus.CHECKED_IN)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<HotelStayResponse> findHotelGuestsWithPendingReservations() {
        return stayRepository.findByStatus(HotelStayStatus.RESERVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HotelStayResponse checkIn(Long stayId, LocalDateTime checkinTime) {
        HotelStay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva/Estadia não encontrada: " + stayId));

        if (stay.getStatus() != HotelStayStatus.RESERVED) {
            throw new IllegalStateException("O check-in só pode ser feito em uma reserva PENDENTE.");
        }

        if (checkinTime.getHour() < 14) {

            System.out.println("ALERTA: Check-in realizado antes das 14h00min.");
        }

        stay.setCheckinTime(checkinTime);
        stay.setStatus(HotelStayStatus.CHECKED_IN);
        HotelStay saved = stayRepository.save(stay);
        return mapToResponse(saved);
    }

    @Transactional
    public HotelStayResponse checkOut(Long stayId, LocalDateTime checkoutTime) {
        HotelStay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Estadia não encontrada: " + stayId));

        if (stay.getStatus() != HotelStayStatus.CHECKED_IN || stay.getCheckinTime() == null) {
            throw new IllegalStateException("O checkout só pode ser feito em uma estadia ATIVA.");
        }

        if (checkoutTime.isBefore(stay.getCheckinTime())) {
            throw new IllegalArgumentException("A hora do checkout (" + checkoutTime
                    + ") não pode ser antes da hora do check-in (" + stay.getCheckinTime() + ").");
        }

        Double totalAmount = calculateStayCost(stay.getCheckinTime(), checkoutTime, stay.getHotelGuest().isHasCar());

        stay.setCheckoutTime(checkoutTime);
        stay.setTotalAmount(totalAmount);
        stay.setStatus(HotelStayStatus.CHECKED_OUT);

        HotelStay saved = stayRepository.save(stay);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteReservationIfReserved(Long stayId) {
        HotelStay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada: " + stayId));

        if (stay.getStatus() != HotelStayStatus.RESERVED) {
            throw new IllegalArgumentException("Só é possível excluir reservas com status PENDENTE.");
        }

        stayRepository.delete(stay);
    }

    public com.hotel.management.dto.DashboardResponse getDashboardMetrics() {
        com.hotel.management.dto.DashboardResponse dto = new com.hotel.management.dto.DashboardResponse();

        java.time.LocalDate now = java.time.LocalDate.now();
        java.time.LocalDate monthStart = now.withDayOfMonth(1);
        java.time.LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());

        Long reservations = stayRepository.countPlannedOverlappingPeriod(monthStart, monthEnd);
        Long activeCheckins = stayRepository.countByStatus(HotelStayStatus.CHECKED_IN);
        Long currentGuests = stayRepository.sumNumberOfGuestsByStatus(HotelStayStatus.CHECKED_IN);
        Long currentCars = stayRepository.countWithCarByStatus(HotelStayStatus.CHECKED_IN);

        dto.setTotalReservations(reservations == null ? 0L : reservations);
        dto.setTotalActiveCheckins(activeCheckins == 0 ? 0L : activeCheckins);
        dto.setTotalCurrentGuests(currentGuests == null ? 0L : currentGuests);
        dto.setTotalCurrentCars(currentCars == null ? 0L : currentCars);

        return dto;
    }

    public double calculateStayCost(LocalDateTime checkin, LocalDateTime checkout, boolean hasCar) {
        long nights = ChronoUnit.DAYS.between(checkin.toLocalDate(), checkout.toLocalDate());
        if (nights <= 0)
            nights = 1;

        double totalCost = 0.0;

        for (int i = 0; i < nights; i++) {
            LocalDate nightDate = checkin.toLocalDate().plusDays(i);
            DayOfWeek dayOfWeek = nightDate.getDayOfWeek();
            boolean isWeekend = dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
            double dailyRate = isWeekend ? DAILY_RATE_WEEKEND : DAILY_RATE_WEEKDAY;
            double carFee = hasCar ? (isWeekend ? CAR_FEE_WEEKEND : CAR_FEE_WEEKDAY) : 0.0;
            double dailyCost = dailyRate + carFee;
            totalCost += dailyCost;
        }

        if (checkout.getHour() > CHECKOUT_HOUR_LIMIT) {
            LocalDate lastNight = checkin.toLocalDate().plusDays(nights - 1);
            DayOfWeek lastDow = lastNight.getDayOfWeek();
            boolean lastIsWeekend = lastDow == DayOfWeek.SATURDAY || lastDow == DayOfWeek.SUNDAY;
            double lastDailyRate = lastIsWeekend ? DAILY_RATE_WEEKEND : DAILY_RATE_WEEKDAY;
            double surcharge = lastDailyRate * LATE_CHECKOUT_SURCHARGE;
            totalCost += surcharge;
        }

        return totalCost;
    }
}