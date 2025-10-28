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

    // Revert to a JPQL query that uses LOWER on the entity attributes.
    // We use a separate countQuery to support pagination reliably.
    @Query(value = "SELECT h FROM HotelGuest h WHERE "
            + "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
            + "(:document IS NULL OR LOWER(h.document) LIKE LOWER(CONCAT('%', :document, '%'))) AND "
            + "(:phone IS NULL OR LOWER(h.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) ", countQuery = "SELECT count(h) FROM HotelGuest h WHERE "
                    + "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
                    + "(:document IS NULL OR LOWER(h.document) LIKE LOWER(CONCAT('%', :document, '%'))) AND "
                    + "(:phone IS NULL OR LOWER(h.phone) LIKE LOWER(CONCAT('%', :phone, '%'))) ")
    Page<HotelGuest> findByFilters(@Param("name") String name,
            @Param("document") String document,
            @Param("phone") String phone,
            Pageable pageable);
}
