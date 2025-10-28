package com.hotel.management.service;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.repository.HotelStayRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class HotelGuestService {

    private final HotelGuestRepository hotelGuestRepository;
    private final HotelStayRepository hotelStayRepository;
    private static final Logger log = LoggerFactory.getLogger(HotelGuestService.class);

    public HotelGuestService(HotelGuestRepository hotelGuestRepository, HotelStayRepository hotelStayRepository) {
        this.hotelGuestRepository = hotelGuestRepository;
        this.hotelStayRepository = hotelStayRepository;
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

    public Page<HotelGuest> search(String name, String document, String phone, Boolean inHotel, Boolean reserved,
            Pageable pageable) {
        String n = (name == null || name.isBlank()) ? null : name;
        String d = (document == null || document.isBlank()) ? null : document;
        String p = (phone == null || phone.isBlank()) ? null : phone;

        // Normalize the boolean parameters: treat null as 'no filter'
        Boolean inHotelFilter = inHotel;
        Boolean reservedFilter = reserved;

        try {
            return hotelGuestRepository.findByFilters(n, d, p, inHotelFilter, reservedFilter, pageable);
        } catch (Exception ex) {
            // Fall back to in-memory filtering when the DB schema causes SQL errors
            log.warn("findByFilters failed, falling back to in-memory filtering", ex);
            List<HotelGuest> all = hotelGuestRepository.findAll();
            // Preload stays to support in-memory evaluation of the new filters
            List<com.hotel.management.model.HotelStay> allStays = hotelStayRepository.findAll();
            java.util.Map<Long, List<com.hotel.management.model.HotelStay>> staysByGuest = allStays.stream()
                    .filter(s -> s.getHotelGuest() != null && s.getHotelGuest().getId() != null)
                    .collect(java.util.stream.Collectors.groupingBy(s -> s.getHotelGuest().getId()));

            List<HotelGuest> filtered = all.stream().filter(h -> {
                boolean ok = true;
                if (n != null)
                    ok = h.getName() != null && h.getName().toLowerCase().contains(n.toLowerCase());
                if (ok && d != null)
                    ok = h.getDocument() != null && h.getDocument().toLowerCase().contains(d.toLowerCase());
                if (ok && p != null)
                    ok = h.getPhone() != null && h.getPhone().toLowerCase().contains(p.toLowerCase());

                List<com.hotel.management.model.HotelStay> stays = staysByGuest.getOrDefault(h.getId(),
                        java.util.List.of());
                if (ok && inHotelFilter != null) {
                    boolean hasCheckedIn = stays.stream()
                            .anyMatch(s -> s.getStatus() == com.hotel.management.model.HotelStayStatus.CHECKED_IN);
                    ok = inHotelFilter ? hasCheckedIn : !hasCheckedIn;
                }
                if (ok && reservedFilter != null) {
                    boolean hasReserved = stays.stream()
                            .anyMatch(s -> s.getStatus() == com.hotel.management.model.HotelStayStatus.RESERVED);
                    ok = reservedFilter ? hasReserved : !hasReserved;
                }

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

    @Transactional
    public void deleteById(Long id) {
        // Ensure guest exists
        hotelGuestRepository.findById(id).orElseThrow(
                () -> new com.hotel.management.exception.ResourceNotFoundException("Hóspede não encontrado: " + id));

        // Rule 1: cannot delete a guest who is currently checked in
        long checkedInCount = hotelStayRepository.countByHotelGuest_IdAndStatus(id,
                com.hotel.management.model.HotelStayStatus.CHECKED_IN);
        if (checkedInCount > 0) {
            throw new com.hotel.management.exception.ResourceConflictException(
                    "Não é possível excluir hóspede que está hospedado no hotel.");
        }

        // Rule 2: delete any RESERVED stays for this guest before deleting the guest
        java.util.List<com.hotel.management.model.HotelStay> reserved = hotelStayRepository
                .findByHotelGuest_IdAndStatus(id, com.hotel.management.model.HotelStayStatus.RESERVED);
        if (!reserved.isEmpty()) {
            hotelStayRepository.deleteAll(reserved);
        }

        hotelGuestRepository.deleteById(id);
    }
}
