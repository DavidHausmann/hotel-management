package com.hotel.management.service;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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

    /**
     * Apply partial updates to a HotelGuest identified by id.
     * Only the keys present in the updates map will be applied.
     */
    public HotelGuest patch(Long id, Map<String, Object> updates) {
        Optional<HotelGuest> maybe = hotelGuestRepository.findById(id);
        HotelGuest existing = maybe.orElseThrow(() -> new IllegalArgumentException("HotelGuest not found: " + id));

        if (updates.containsKey("name")) {
            Object v = updates.get("name");
            existing.setName(v == null ? null : v.toString());
        }
        if (updates.containsKey("document")) {
            Object v = updates.get("document");
            existing.setDocument(v == null ? null : v.toString());
        }
        if (updates.containsKey("phone")) {
            Object v = updates.get("phone");
            existing.setPhone(v == null ? null : v.toString());
        }
        if (updates.containsKey("hasCar")) {
            Object v = updates.get("hasCar");
            if (v instanceof Boolean) {
                existing.setHasCar((Boolean) v);
            } else if (v != null) {
                existing.setHasCar(Boolean.parseBoolean(v.toString()));
            }
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

    public void deleteById(Long id) {
        hotelGuestRepository.deleteById(id);
    }
}
