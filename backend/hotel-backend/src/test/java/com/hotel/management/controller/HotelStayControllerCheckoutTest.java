package com.hotel.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.management.dto.CheckoutPreviewResponse;
import com.hotel.management.dto.HotelStayResponse;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.service.HotelStayService;
import com.hotel.management.model.HotelStayStatus;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = HotelStayController.class)
public class HotelStayControllerCheckoutTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HotelStayService hotelStayService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void previewCheckout_returnsDto_whenFound() throws Exception {
        CheckoutPreviewResponse dto = new CheckoutPreviewResponse();
        dto.setTotalWeekdays(120.0);
        dto.setTotalWeekends(0.0);
        dto.setParkingWeekdays(15.0);
        dto.setParkingWeekends(0.0);
        dto.setExtraFees(0.0);
        dto.setTotalAmount(135.0);

        Mockito.when(hotelStayService.previewCheckout(eq(1L), any(LocalDateTime.class))).thenReturn(dto);

        mockMvc.perform(get("/api/stay/1/checkout-preview").param("checkoutTime", "2025-10-29T11:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(135.0));
    }

    @Test
    public void previewCheckout_returns404_whenNotFound() throws Exception {
        Mockito.when(hotelStayService.previewCheckout(eq(99L), any(LocalDateTime.class)))
                .thenThrow(new ResourceNotFoundException("Stay not found"));

        mockMvc.perform(get("/api/stay/99/checkout-preview").param("checkoutTime", "2025-10-29T11:00:00"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Stay not found"));
    }

    @Test
    public void checkout_returnsOk_whenSuccess() throws Exception {
        HotelStayResponse resp = new HotelStayResponse();
        resp.setId(1L);
        resp.setStatus(HotelStayStatus.CHECKED_OUT);
        resp.setTotalAmount(200.0);

        Mockito.when(hotelStayService.checkOut(eq(1L), any(LocalDateTime.class))).thenReturn(resp);

        String body = objectMapper.writeValueAsString(java.util.Map.of("checkoutTime", "2025-10-29T11:00:00"));

        mockMvc.perform(patch("/api/stay/1/checkout").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CHECKED_OUT"))
                .andExpect(jsonPath("$.totalAmount").value(200.0));
    }
}
