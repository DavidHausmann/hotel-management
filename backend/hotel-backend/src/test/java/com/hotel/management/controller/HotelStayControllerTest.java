package com.hotel.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.management.dto.HotelStayResponse;
import com.hotel.management.model.HotelStayStatus;
import com.hotel.management.service.HotelStayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class HotelStayControllerTest {

    private MockMvc mockMvc;

    // ObjectMapper configured for Java time types in standalone MockMvc
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    private void configureObjectMapper() {
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Mock
    private HotelStayService hotelStayService;

    private HotelStayController controller;

    @BeforeEach
    void setup() {
        controller = new HotelStayController(hotelStayService);
        configureObjectMapper();

        org.springframework.http.converter.json.MappingJackson2HttpMessageConverter converter = new org.springframework.http.converter.json.MappingJackson2HttpMessageConverter(
                objectMapper);

        // Register GlobalExceptionHandler so exception mapping is active in standalone
        // setup
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new com.hotel.management.exception.GlobalExceptionHandler())
                .setMessageConverters(converter)
                .build();
    }

    @Test
    void createReservation_returns_planned_fields() throws Exception {
        HotelStayResponse resp = new HotelStayResponse();
        resp.setId(55L);
        resp.setStatus(HotelStayStatus.RESERVED);
        resp.setHotelGuestId(2L);
        resp.setPlannedStartDate(LocalDate.of(2025, 11, 1));
        resp.setPlannedEndDate(LocalDate.of(2025, 11, 5));
        resp.setNumberOfGuests(2);

        when(hotelStayService.createReservation(eq(2L), eq(LocalDate.of(2025, 11, 1)), eq(LocalDate.of(2025, 11, 5)),
                eq(2)))
                .thenReturn(resp);

        String body = "{\"plannedStartDate\":\"2025-11-01\",\"plannedEndDate\":\"2025-11-05\",\"numberOfGuests\":2}";

        mockMvc.perform(post("/api/stay/reserve/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plannedStartDate").value("2025-11-01"))
                .andExpect(jsonPath("$.plannedEndDate").value("2025-11-05"))
                .andExpect(jsonPath("$.numberOfGuests").value(2));
    }

    @Test
    void checkIn_early_returns_alert_header_and_status() throws Exception {
        HotelStayResponse resp = new HotelStayResponse();
        resp.setId(10L);
        resp.setStatus(HotelStayStatus.CHECKED_IN);
        resp.setHotelGuestId(2L);

        when(hotelStayService.checkIn(eq(10L), any(LocalDateTime.class))).thenReturn(resp);

        String body = "{\"checkinTime\":\"2025-10-26T10:30:00\"}";

        mockMvc.perform(patch("/api/stay/10/checkin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Checkin-Alert"))
                .andExpect(jsonPath("$.status").value("CHECKED_IN"));
    }

    @Test
    void checkOut_returns_totalAmount() throws Exception {
        HotelStayResponse resp = new HotelStayResponse();
        resp.setId(20L);
        resp.setStatus(HotelStayStatus.CHECKED_OUT);
        resp.setHotelGuestId(2L);
        resp.setTotalAmount(360.0);

        when(hotelStayService.checkOut(eq(20L), any(LocalDateTime.class))).thenReturn(resp);

        String body = "{\"checkoutTime\":\"2025-10-27T11:00:00\"}";

        mockMvc.perform(patch("/api/stay/20/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(360.0))
                .andExpect(jsonPath("$.status").value("CHECKED_OUT"));
    }

    @Test
    void createReservation_guestNotFound_returns_structured_error() throws Exception {
        when(hotelStayService.createReservation(eq(99L), any(LocalDate.class), any(LocalDate.class),
                any(Integer.class)))
                .thenThrow(new IllegalArgumentException("Guest not found: 99"));

        String body = "{\"plannedStartDate\":\"2025-11-01\",\"plannedEndDate\":\"2025-11-05\",\"numberOfGuests\":2}";

        mockMvc.perform(post("/api/stay/reserve/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Guest not found: 99"));
    }
}
