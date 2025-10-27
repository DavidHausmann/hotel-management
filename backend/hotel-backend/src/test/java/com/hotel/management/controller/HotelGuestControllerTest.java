package com.hotel.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.management.model.HotelGuest;
import com.hotel.management.service.HotelGuestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = HotelGuestController.class)
public class HotelGuestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private HotelGuestService guestService;

    @Test
    void save_invalidPayload_returnsValidationErrorWithDetailsArray() throws Exception {
        // Missing required fields (name, document, phone)
        HotelGuest invalid = new HotelGuest();

        mockMvc.perform(post("/api/guest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details[0].field").exists())
                .andExpect(jsonPath("$.details[0].message").exists());
    }
}
