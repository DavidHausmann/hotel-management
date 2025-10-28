package com.hotel.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hotel.management.model.HotelGuest;
import com.hotel.management.service.HotelGuestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class HotelGuestControllerTest {

    private MockMvc mockMvc;

    private com.fasterxml.jackson.databind.ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private HotelGuestService guestService;

    @BeforeEach
    void setup() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // Avoid serializing PageImpl internals (pageable/sort) which can throw in tests
        objectMapper.addMixIn(org.springframework.data.domain.PageImpl.class, PageImplMixin.class);

        HotelGuestController controller = new HotelGuestController(guestService);
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter(objectMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new com.hotel.management.exception.GlobalExceptionHandler())
                .setMessageConverters(converter)
                .setCustomArgumentResolvers(new org.springframework.data.web.PageableHandlerMethodArgumentResolver())
                .build();
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "pageable", "sort" })
    private static abstract class PageImplMixin {
    }

    @Test
    void search_returns_paged_results() throws Exception {
        HotelGuest guest = new HotelGuest();
        guest.setId(11L);
        guest.setName("Test Guest");

        org.springframework.data.domain.Page<HotelGuest> page = new org.springframework.data.domain.PageImpl<>(
                java.util.List.of(guest));

        org.mockito.Mockito.doReturn(page).when(guestService).search(org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(org.springframework.data.domain.Pageable.class));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/guest/search")
                .param("page", "0").param("size", "5"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.content[0].id")
                        .value(11));
    }

    @Test
    void save_invalidPayload_returnsValidationErrorWithDetailsArray() throws Exception {
        // Missing required fields (name, document, phone)
        // send an empty JSON object to trigger validation on the create DTO
        mockMvc.perform(post("/api/guest")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details").isArray())
                .andExpect(jsonPath("$.details[0].field").exists())
                .andExpect(jsonPath("$.details[0].message").exists());
    }
}
