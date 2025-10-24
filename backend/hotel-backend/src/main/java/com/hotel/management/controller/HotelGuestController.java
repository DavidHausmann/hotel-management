package com.hotel.management.controller;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.service.HotelGuestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest")
@CrossOrigin(origins = "*")
public class HotelGuestController {

    private final HotelGuestService hotelGuestService;

    public HotelGuestController(HotelGuestService hotelGuestService) {
        this.hotelGuestService = hotelGuestService;
    }

    @PostMapping
    public ResponseEntity<HotelGuest> save(@Valid @RequestBody HotelGuest hotelGuest) {
        HotelGuest saved = hotelGuestService.save(hotelGuest);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<HotelGuest>> list() {
        return ResponseEntity.ok(hotelGuestService.list());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<HotelGuest>> searchByName(@PathVariable String name) {
        return ResponseEntity.ok(hotelGuestService.searchByName(name));
    }

    @GetMapping("/document/{document}")
    public ResponseEntity<List<HotelGuest>> searchByDocument(@PathVariable String document) {
        return ResponseEntity.ok(hotelGuestService.searchByDocument(document));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<HotelGuest>> searchByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(hotelGuestService.searchByPhone(phone));
    }
}
