package com.hotel.management.service;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelGuestService {

    private final HotelGuestRepository hotelGuestRepository;

    public HotelGuestService(HotelGuestRepository hotelGuestRepository) {
        this.hotelGuestRepository = hotelGuestRepository;
    }

    public HotelGuest save(HotelGuest hotelGuest) {
        return hotelGuestRepository.save(hotelGuest);
    }

    public List<HotelGuest> list() {
        return hotelGuestRepository.findAll();
    }

    public List<HotelGuest> searchByName(String name) {
        return hotelGuestRepository.findByNameContainingIgnoreCase(name);
    }

    public List<HotelGuest> searchByDocument(String document) {
        return hotelGuestRepository.findByDocumentContainingIgnoreCase(document);
    }

    public List<HotelGuest> searchByPhone(String phone) {
        return hotelGuestRepository.findByPhoneContainingIgnoreCase(phone);
    }
}
