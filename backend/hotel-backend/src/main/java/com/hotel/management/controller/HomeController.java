package com.hotel.management.controller;

import com.hotel.management.dto.DashboardResponse;
import com.hotel.management.service.HotelStayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
@Tag(name = "Home", description = "Dashboard and home summary endpoints")
public class HomeController {

    private final HotelStayService hotelStayService;

    public HomeController(HotelStayService hotelStayService) {
        this.hotelStayService = hotelStayService;
    }

    @Operation(summary = "Get dashboard metrics for current month")
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        DashboardResponse resp = hotelStayService.getDashboardMetrics();
        return ResponseEntity.ok(resp);
    }
}
