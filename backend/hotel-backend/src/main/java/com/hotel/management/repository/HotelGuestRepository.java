package com.hotel.management.repository;

import com.hotel.management.model.HotelGuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface HotelGuestRepository extends JpaRepository<HotelGuest, Long> {

    List<HotelGuest> findByNameContainingIgnoreCase(String name);

    List<HotelGuest> findByDocumentContainingIgnoreCase(String document);

    List<HotelGuest> findByPhoneContainingIgnoreCase(String phone);

    
    
    @Query(value = "SELECT h FROM HotelGuest h WHERE "
            + "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
            + "(:document IS NULL OR LOWER(h.document) LIKE LOWER(CONCAT('%', :document, '%'))) AND "
            + "(:phone IS NULL OR LOWER(h.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) AND "
            + "(:inHotel IS NULL OR (EXISTS (SELECT 1 FROM HotelStay s WHERE s.hotelGuest = h AND s.status = com.hotel.management.model.HotelStayStatus.CHECKED_IN))) AND "
            + "(:reserved IS NULL OR (EXISTS (SELECT 1 FROM HotelStay s2 WHERE s2.hotelGuest = h AND s2.status = com.hotel.management.model.HotelStayStatus.RESERVED))) ", countQuery = "SELECT count(DISTINCT h) FROM HotelGuest h WHERE "
                    + "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
                    + "(:document IS NULL OR LOWER(h.document) LIKE LOWER(CONCAT('%', :document, '%'))) AND "
                    + "(:phone IS NULL OR LOWER(h.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) AND "
                    + "(:inHotel IS NULL OR (EXISTS (SELECT 1 FROM HotelStay s WHERE s.hotelGuest = h AND s.status = com.hotel.management.model.HotelStayStatus.CHECKED_IN))) AND "
                    + "(:reserved IS NULL OR (EXISTS (SELECT 1 FROM HotelStay s2 WHERE s2.hotelGuest = h AND s2.status = com.hotel.management.model.HotelStayStatus.RESERVED))) ")
    Page<HotelGuest> findByFilters(@Param("name") String name,
            @Param("document") String document,
            @Param("phone") String phone,
            @Param("inHotel") Boolean inHotel,
            @Param("reserved") Boolean reserved,
            Pageable pageable);
}
