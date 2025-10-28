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
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class HotelStayService {

    private static final double DAILY_RATE_WEEKDAY = 120.00; // Seg-Sex
    private static final double DAILY_RATE_WEEKEND = 180.00; // Finais de semana
    private static final double CAR_FEE_WEEKDAY = 15.00; // Seg-Sex
    private static final double CAR_FEE_WEEKEND = 20.00; // Finais de semana
    private static final int CHECKOUT_HOUR_LIMIT = 12; // Até as 12h00min
    private static final double LATE_CHECKOUT_SURCHARGE = 0.50; // 50%

    private final HotelStayRepository stayRepository;
    private final HotelGuestRepository hotelGuestRepository;

    private HotelStayResponse mapToResponse(HotelStay stay) {
        HotelStayResponse dto = new HotelStayResponse();
        dto.setId(stay.getId());
        dto.setCheckinTime(stay.getCheckinTime());
        dto.setCheckoutTime(stay.getCheckoutTime());
        dto.setStatus(stay.getStatus());
        dto.setTotalAmount(stay.getTotalAmount());

        // Mapeia apenas o ID do hóspede
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

    /**
     * Search reservations with optional guest filters and date window. Returns a
     * pageable result of mapped DTOs.
     */
    public Page<HotelStayResponse> search(String name, String document, String phone, LocalDate start,
            LocalDate end, Pageable pageable) {
        Page<HotelStay> page = stayRepository.findByFilters(name, document, phone, start, end, pageable);
        return page.map(this::mapToResponse);
    }

    // --- Métodos de CRUD Básico e Pesquisa ---

    // 1. Criar Reserva (RESERVED)
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

    // 2. Localizar hóspedes que ainda estão no hotel (CHECKED_IN)
    public List<HotelStayResponse> findHotelGuestsCurrentlyInHotel() {
        return stayRepository.findByStatus(HotelStayStatus.CHECKED_IN)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. Localizar hóspedes com reservas, mas sem check-in (RESERVED)
    public List<HotelStayResponse> findHotelGuestsWithPendingReservations() {
        return stayRepository.findByStatus(HotelStayStatus.RESERVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- Lógica de Check-in e Checkout ---

    // 4. Realizar Check-in
    @Transactional
    public HotelStayResponse checkIn(Long stayId, LocalDateTime checkinTime) {
        HotelStay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva/Estadia não encontrada: " + stayId));

        if (stay.getStatus() != HotelStayStatus.RESERVED) {
            throw new IllegalStateException("O check-in só pode ser feito em uma reserva PENDENTE.");
        }

        // Regra de Negócio: Check-in a partir das 14h00min (alerta antes)
        if (checkinTime.getHour() < 14) {
            // O Controller pode usar esta informação para emitir o alerta ao front-end.
            System.out.println("ALERTA: Check-in realizado antes das 14h00min.");
        }

        stay.setCheckinTime(checkinTime);
        stay.setStatus(HotelStayStatus.CHECKED_IN);
        HotelStay saved = stayRepository.save(stay);
        return mapToResponse(saved);
    }

    // 5. Realizar Checkout e Calcular Custo
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

        // Cálculo da Regra de Negócio
        Double totalAmount = calculateStayCost(stay.getCheckinTime(), checkoutTime, stay.getHotelGuest().isHasCar());

        stay.setCheckoutTime(checkoutTime);
        stay.setTotalAmount(totalAmount);
        stay.setStatus(HotelStayStatus.CHECKED_OUT);

        HotelStay saved = stayRepository.save(stay);
        return mapToResponse(saved);
    }

    // 6. Excluir Reserva somente quando estiver em status RESERVED
    @Transactional
    public void deleteReservationIfReserved(Long stayId) {
        HotelStay stay = stayRepository.findById(stayId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada: " + stayId));

        if (stay.getStatus() != HotelStayStatus.RESERVED) {
            throw new IllegalArgumentException("Só é possível excluir reservas com status PENDENTE.");
        }

        stayRepository.delete(stay);
    }

    /**
     * Return aggregated dashboard metrics as requested by the frontend/home route.
     */
    public com.hotel.management.dto.DashboardResponse getDashboardMetrics() {
        com.hotel.management.dto.DashboardResponse dto = new com.hotel.management.dto.DashboardResponse();

        // current month start and end
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

    /**
     * Calcula o custo total da estadia.
     */
    public double calculateStayCost(LocalDateTime checkin, LocalDateTime checkout, boolean hasCar) {
        LocalDateTime currentDay = checkin.toLocalDate().atStartOfDay();
        LocalDateTime endDay = checkout.toLocalDate().atStartOfDay();
        double totalCost = 0.0;

        // Loop por cada dia (diária) da estadia. O cálculo é baseado em dias inteiros.
        while (!currentDay.isAfter(endDay)) {
            DayOfWeek dayOfWeek = currentDay.getDayOfWeek();
            boolean isWeekend = dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
            double dailyRate = isWeekend ? DAILY_RATE_WEEKEND : DAILY_RATE_WEEKDAY; // Diárias
            double carFee = hasCar ? (isWeekend ? CAR_FEE_WEEKEND : CAR_FEE_WEEKDAY) : 0.0; // Taxa de carro

            double dailyCost = dailyRate + carFee;

            // Regra de Negócio: Taxa adicional de 50% para Checkout Tarde
            if (currentDay.isEqual(endDay)) {
                if (checkout.getHour() > CHECKOUT_HOUR_LIMIT) { // Após 12:00
                    double surcharge = dailyRate * LATE_CHECKOUT_SURCHARGE;
                    dailyCost += surcharge;
                }
            }

            totalCost += dailyCost;
            currentDay = currentDay.plusDays(1);
        }

        return totalCost;
    }
}