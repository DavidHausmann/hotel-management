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

    @Query("select g from HotelGuest g where " +
            "(:name is null or lower(g.name) like lower(concat('%', :name, '%'))) and " +
            "(:document is null or lower(g.document) like lower(concat('%', :document, '%'))) and " +
            "(:phone is null or lower(g.phone) like lower(concat('%', :phone, '%'))) ")
    Page<HotelGuest> findByFilters(@Param("name") String name,
            @Param("document") String document,
            @Param("phone") String phone,
            Pageable pageable);
}
