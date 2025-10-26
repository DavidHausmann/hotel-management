package com.hotel.management.repository;

import com.hotel.management.model.HotelStay;
import com.hotel.management.model.HotelStayStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelStayRepository extends JpaRepository<HotelStay, Long> {

    List<HotelStay> findByStatus(HotelStayStatus status);
}