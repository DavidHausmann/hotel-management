package com.hotel.management.controller;

import com.hotel.management.dto.DashboardResponse;
import com.hotel.management.service.HotelStayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class HomeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HotelStayService hotelStayService;

    @BeforeEach
    void setup() {
        HomeController controller = new HomeController(hotelStayService);

        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter(mapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new com.hotel.management.exception.GlobalExceptionHandler())
                .setMessageConverters(converter)
                .build();
    }

    @Test
    void getDashboard_returns_metrics() throws Exception {
        DashboardResponse resp = new DashboardResponse();
        resp.setTotalReservations(4L);
        resp.setTotalActiveCheckins(2L);
        resp.setTotalCurrentGuests(6L);
        resp.setTotalCurrentCars(1L);

        when(hotelStayService.getDashboardMetrics()).thenReturn(resp);

        mockMvc.perform(get("/api/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalReservations").value(4))
                .andExpect(jsonPath("$.totalActiveCheckins").value(2))
                .andExpect(jsonPath("$.totalCurrentGuests").value(6))
                .andExpect(jsonPath("$.totalCurrentCars").value(1));
    }
}
