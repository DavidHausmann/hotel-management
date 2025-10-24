package com.hotel.management.repository;

import com.hotel.management.model.HotelGuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelGuestRepository extends JpaRepository<HotelGuest, Long> {

    List<HotelGuest> findByNameContainingIgnoreCase(String name);

    List<HotelGuest> findByDocumentContainingIgnoreCase(String document);

    List<HotelGuest> findByPhoneContainingIgnoreCase(String phone);
}
