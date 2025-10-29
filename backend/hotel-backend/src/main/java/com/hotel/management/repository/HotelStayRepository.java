package com.hotel.management.repository;

import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface HotelStayRepository extends JpaRepository<HotelStay, Long> {

    List<HotelStay> findByStatus(HotelStayStatus status);

    long countByStatus(HotelStayStatus status);

    @Query("SELECT COALESCE(SUM(s.numberOfGuests),0) FROM HotelStay s WHERE s.status = :status")
    Long sumNumberOfGuestsByStatus(@Param("status") HotelStayStatus status);

    @Query("SELECT COUNT(s) FROM HotelStay s JOIN s.hotelGuest g WHERE s.status = :status AND g.hasCar = true")
    Long countWithCarByStatus(@Param("status") HotelStayStatus status);

    @Query("SELECT COUNT(s) FROM HotelStay s WHERE s.plannedStartDate <= :monthEnd AND s.plannedEndDate >= :monthStart")
    Long countPlannedOverlappingPeriod(@Param("monthStart") LocalDate monthStart,
            @Param("monthEnd") LocalDate monthEnd);

    @Query("select s from HotelStay s join s.hotelGuest g where " +
            "(:name is null or lower(g.name) like lower(concat('%', :name, '%'))) and " +
            "(:document is null or lower(g.document) like lower(concat('%', :document, '%'))) and " +
            "(:phone is null or lower(g.phone) like lower(concat('%', :phone, '%'))) and " +
            "(:start is null or s.plannedEndDate >= :start) and " +
            "(:end is null or s.plannedStartDate <= :end) ")
    Page<com.hotel.management.model.HotelStay> findByFilters(@Param("name") String name,
            @Param("document") String document,
            @Param("phone") String phone,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable);

    
    
    List<HotelStay> findByHotelGuest_IdAndStatus(Long hotelGuestId, HotelStayStatus status);

    long countByHotelGuest_IdAndStatus(Long hotelGuestId, HotelStayStatus status);
}