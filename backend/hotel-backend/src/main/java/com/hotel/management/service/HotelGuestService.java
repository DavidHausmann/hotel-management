package com.hotel.management.service;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class HotelGuestService {

    private final HotelGuestRepository hotelGuestRepository;
    private static final Logger log = LoggerFactory.getLogger(HotelGuestService.class);

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
        String n = (name == null || name.isBlank()) ? null : name;
        String d = (document == null || document.isBlank()) ? null : document;
        String p = (phone == null || phone.isBlank()) ? null : phone;

        try {
            return hotelGuestRepository.findByFilters(n, d, p, pageable);
        } catch (Exception ex) {
            // Fall back to in-memory filtering when the DB schema causes SQL errors
            log.warn("findByFilters failed, falling back to in-memory filtering", ex);
            List<HotelGuest> all = hotelGuestRepository.findAll();
            List<HotelGuest> filtered = all.stream().filter(h -> {
                boolean ok = true;
                if (n != null)
                    ok = h.getName() != null && h.getName().toLowerCase().contains(n.toLowerCase());
                if (ok && d != null)
                    ok = h.getDocument() != null && h.getDocument().toLowerCase().contains(d.toLowerCase());
                if (ok && p != null)
                    ok = h.getPhone() != null && h.getPhone().toLowerCase().contains(p.toLowerCase());
                return ok;
            }).toList();

            int total = filtered.size();
            int page = pageable.getPageNumber();
            int size = pageable.getPageSize();
            int fromIndex = Math.min(page * size, total);
            int toIndex = Math.min(fromIndex + size, total);
            List<HotelGuest> pageContent = filtered.subList(fromIndex, toIndex);
            return new PageImpl<>(pageContent, pageable, total);
        }
    }

    public void deleteById(Long id) {
        hotelGuestRepository.deleteById(id);
    }
}
