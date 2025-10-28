package com.hotel.management.service;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class HotelGuestService {

    private final HotelGuestRepository hotelGuestRepository;

    public HotelGuestService(HotelGuestRepository hotelGuestRepository) {
        this.hotelGuestRepository = hotelGuestRepository;
    }

    public HotelGuest save(HotelGuest hotelGuest) {
        return hotelGuestRepository.save(hotelGuest);
    }

    public HotelGuest patch(Long id, com.hotel.management.dto.HotelGuestPatchRequest updates) {
        Optional<HotelGuest> maybe = hotelGuestRepository.findById(id);
        HotelGuest existing = maybe.orElseThrow(
                () -> new com.hotel.management.exception.ResourceNotFoundException("Hóspede não encontrado: " + id));

        if (updates.getName() != null) {
            existing.setName(updates.getName());
        }
        if (updates.getDocument() != null) {
            existing.setDocument(updates.getDocument());
        }
        if (updates.getPhone() != null) {
            existing.setPhone(updates.getPhone());
        }
        if (updates.getHasCar() != null) {
            existing.setHasCar(updates.getHasCar());
        }

        return hotelGuestRepository.save(existing);
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

    public Page<HotelGuest> search(String name, String document, String phone, Pageable pageable) {
        return hotelGuestRepository.findByFilters(
                (name == null || name.isBlank()) ? null : name,
                (document == null || document.isBlank()) ? null : document,
                (phone == null || phone.isBlank()) ? null : phone,
                pageable);
    }

    public void deleteById(Long id) {
        hotelGuestRepository.deleteById(id);
    }
}
