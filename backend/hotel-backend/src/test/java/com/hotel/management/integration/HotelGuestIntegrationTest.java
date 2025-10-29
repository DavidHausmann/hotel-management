package com.hotel.management.integration;

import org.springframework.core.ParameterizedTypeReference;
import com.hotel.management.repository.HotelGuestRepository;
import com.hotel.management.repository.HotelStayRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HotelGuestIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private HotelGuestRepository guestRepository;

    @Autowired
    private HotelStayRepository stayRepository;

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    private ResponseEntity<Map<String, Object>> postMapUrl(String fullUrl, Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        return restTemplate.exchange(fullUrl, HttpMethod.POST, entity, new ParameterizedTypeReference<>() {
        });
    }

    @Test
    void deletingGuest_withReservedStay_removesReservedAndDeletesGuest() {
        
        Map<String, Object> guest = new HashMap<>();
        guest.put("name", "Integration Reserved");
        guest.put("document", "111.111.111-11");
        guest.put("phone", "(11)90000-0000");
        guest.put("hasCar", false);

        ResponseEntity<Map<String, Object>> created = postMapUrl(url("/api/guest"), guest);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(created.getBody()).isNotNull();
        Number guestId = (Number) created.getBody().get("id");
        assertThat(guestId).isNotNull();

        
        Map<String, Object> stay = new HashMap<>();
        stay.put("plannedStartDate", LocalDate.now().plusDays(1).toString());
        stay.put("plannedEndDate", LocalDate.now().plusDays(3).toString());
        stay.put("numberOfGuests", 1);

        ResponseEntity<Map<String, Object>> stayCreated = postMapUrl(url("/api/stay/reserve/" + guestId.longValue()),
                stay);
        assertThat(stayCreated.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(stayCreated.getBody()).isNotNull();
        Number stayId = (Number) stayCreated.getBody().get("id");
        assertThat(stayId).isNotNull();

        
        ResponseEntity<Void> deleteResp = restTemplate.exchange(url("/api/guest/" + guestId.longValue()),
                HttpMethod.DELETE, null, Void.class);
        assertThat(deleteResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        
        assertThat(guestRepository.findById(guestId.longValue())).isEmpty();
        
        assertThat(stayRepository.findByHotelGuest_IdAndStatus(guestId.longValue(),
                com.hotel.management.model.HotelStayStatus.RESERVED)).isEmpty();
        assertThat(stayRepository.findByHotelGuest_IdAndStatus(guestId.longValue(),
                com.hotel.management.model.HotelStayStatus.CHECKED_IN)).isEmpty();
    }

    @Test
    void deletingGuest_withCheckedInStay_isRejectedWith409() {
        
        Map<String, Object> guest = new HashMap<>();
        guest.put("name", "Integration CheckedIn");
        guest.put("document", "222.222.222-22");
        guest.put("phone", "(11)91111-1111");
        guest.put("hasCar", true);

        ResponseEntity<Map<String, Object>> created = postMapUrl(url("/api/guest"), guest);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(created.getBody()).isNotNull();
        Number guestId = (Number) created.getBody().get("id");
        assertThat(guestId).isNotNull();

        
        Map<String, Object> stay = new HashMap<>();
        stay.put("plannedStartDate", LocalDate.now().toString());
        stay.put("plannedEndDate", LocalDate.now().plusDays(1).toString());
        stay.put("numberOfGuests", 1);

        ResponseEntity<Map<String, Object>> stayCreated = postMapUrl(url("/api/stay/reserve/" + guestId.longValue()),
                stay);
        assertThat(stayCreated.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(stayCreated.getBody()).isNotNull();
        Number stayId = (Number) stayCreated.getBody().get("id");
        assertThat(stayId).isNotNull();

        
        Map<String, Object> checkin = new HashMap<>();
        checkin.put("checkinTime", LocalDateTime.now().plusHours(1).toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(checkin, headers);

        ResponseEntity<Map<String, Object>> checkinResp = restTemplate.exchange(
                url("/api/stay/" + stayId.longValue() + "/checkin"),
                HttpMethod.PATCH, entity, new ParameterizedTypeReference<Map<String, Object>>() {
                });
        assertThat(checkinResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        
        ResponseEntity<Map<String, Object>> deleteResp = restTemplate.exchange(url("/api/guest/" + guestId.longValue()),
                HttpMethod.DELETE, null, new ParameterizedTypeReference<Map<String, Object>>() {
                });
        assertThat(deleteResp.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        Map<String, Object> body = deleteResp.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("message")).isEqualTo("Não é possível excluir hóspede que está hospedado no hotel.");
    }
}
