package com.hotel.management.controller;

import com.hotel.management.dto.HotelStayResponse;
// import com.hotel.management.model.HotelStay;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import com.hotel.management.service.HotelStayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stay")
@CrossOrigin(origins = "*")
@Tag(name = "Hotel Stay", description = "Operations for reservations, check-in and check-out")
public class HotelStayController {

    private final HotelStayService hotelStayService;

    public HotelStayController(HotelStayService hotelStayService) {
        this.hotelStayService = hotelStayService;
    }

    // POST /api/stay/reserve/{guestId} - Criar Reserva
    @Operation(summary = "Create reservation", description = "Create a reservation for an existing guest (status RESERVED)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reservation created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelStayResponse.class), examples = @ExampleObject(value = "{\"id\":1,\"status\":\"RESERVED\",\"hotelGuestId\":42}"))),
            @ApiResponse(responseCode = "400", description = "ID do hóspede inválido ou requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class)))
    })
    @PostMapping("/reserve/{hotelGuestId}")
    public ResponseEntity<HotelStayResponse> createReservation(
            @Parameter(description = "ID of the hotel guest to reserve for", required = true) @PathVariable Long hotelGuestId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Reservation details: plannedStartDate, plannedEndDate, numberOfGuests", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"plannedStartDate\": \"2025-11-01\", \"plannedEndDate\": \"2025-11-05\", \"numberOfGuests\": 2}"))) @Valid @RequestBody com.hotel.management.dto.HotelStayCreateRequest request) {
        HotelStayResponse saved = hotelStayService.createReservation(hotelGuestId, request.getPlannedStartDate(),
                request.getPlannedEndDate(), request.getNumberOfGuests());
        return ResponseEntity.ok(saved);
    }

    // PATCH /api/stay/{stayId}/checkin - Realizar Check-in
    @Operation(summary = "Check-in", description = "Perform check-in for an existing reservation. Provide checkinTime in ISO format in the request body.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check-in successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelStayResponse.class), examples = @ExampleObject(value = "{\"id\":1,\"status\":\"CHECKED_IN\",\"checkinTime\":\"2025-10-26T14:00:00\"}"))),
            @ApiResponse(responseCode = "400", description = "Entrada inválida ou requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 400, \"error\": \"Requisição inválida\", \"message\": \"Erro de validação\", \"details\": [{\"field\": \"checkoutTime\", \"message\": \"deve estar presente e ser posterior ao horário de check-in\"}, {\"field\": \"stayId\", \"message\": \"não encontrado ou não ativo\"}]}"))),
            @ApiResponse(responseCode = "404", description = "Reservation not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class)))
    })
    @PatchMapping("/{stayId}/checkin")
    public ResponseEntity<HotelStayResponse> checkIn(
            @Parameter(description = "ID of the stay to check in", required = true) @PathVariable Long stayId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "JSON with key 'checkinTime' in ISO format", content = @Content(mediaType = "application/json", examples = {
                    @ExampleObject(name = "standard-checkin", value = "{\"checkinTime\": \"2025-10-26T14:00:00\"}"),
                    @ExampleObject(name = "early-checkin", value = "{\"checkinTime\": \"2025-10-26T10:30:00\"}")
            })) @RequestBody Map<String, String> request) {
        // Assume que o corpo da requisição JSON é {"checkinTime":
        // "AAAA-MM-DDTHH:MM:SS"}
        LocalDateTime checkinTime = LocalDateTime.parse(request.get("checkinTime"));

        try {
            HotelStayResponse updated = hotelStayService.checkIn(stayId, checkinTime);

            // Regra de Negócio: Alerta para check-in antes das 14h00min
            if (checkinTime.getHour() < 14) {
                return ResponseEntity.status(200)
                        .header("X-Checkin-Alert", "ALERTA: Check-in realizado antes das 14h00min.")
                        .body(updated);
            }

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PATCH /api/stay/{stayId}/checkout - Realizar Checkout (com cálculo de custo)
    @Operation(summary = "Check-out", description = "Perform checkout for an active stay and calculate total amount. Provide checkoutTime in ISO format in the request body.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Checkout successful with totalAmount populated", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelStayResponse.class), examples = @ExampleObject(value = "{\"id\":1,\"status\":\"CHECKED_OUT\",\"totalAmount\":360.0}"))),
            @ApiResponse(responseCode = "400", description = "Entrada inválida ou requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Estadia ativa não encontrada", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class)))
    })
    @PatchMapping("/{stayId}/checkout")
    public ResponseEntity<HotelStayResponse> checkOut(
            @Parameter(description = "ID of the stay to check out", required = true) @PathVariable Long stayId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "JSON with key 'checkoutTime' in ISO format", content = @Content(mediaType = "application/json", examples = {
                    @ExampleObject(name = "standard-checkout", value = "{\"checkoutTime\": \"2025-10-27T11:00:00\"}"),
                    @ExampleObject(name = "late-checkout", value = "{\"checkoutTime\": \"2025-10-27T13:30:00\"}")
            })) @RequestBody Map<String, String> request) {
        // Assume que o corpo da requisição JSON é {"checkoutTime":
        // "AAAA-MM-DDTHH:MM:SS"}
        LocalDateTime checkoutTime = LocalDateTime.parse(request.get("checkoutTime"));

        try {
            HotelStayResponse updated = hotelStayService.checkOut(stayId, checkoutTime);
            // Requisito: Exibir em detalhes o total geral - O objeto retornado já contém
            // 'totalAmount'.
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/stay/currently-in - Hóspedes no Hotel
    @GetMapping("/currently-in")
    public ResponseEntity<List<HotelStayResponse>> findHotelGuestsCurrentlyInHotel() {
        return ResponseEntity.ok(hotelStayService.findHotelGuestsCurrentlyInHotel());
    }

    // GET /api/stay/pending-reservations - Hóspedes com Reservas Pendentes
    @GetMapping("/pending-reservations")
    public ResponseEntity<List<HotelStayResponse>> findHotelGuestsWithPendingReservations() {
        return ResponseEntity.ok(hotelStayService.findHotelGuestsWithPendingReservations());
    }

    // DELETE /api/stay/{stayId} - Excluir reserva apenas se status == RESERVED
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Reserva excluída com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida - reserva não pode ser excluída ou inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Reserva não encontrada", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class)))
    })
    @DeleteMapping("/{stayId}")
    public ResponseEntity<Void> deleteReservation(
            @Parameter(description = "ID of the stay to delete", required = true) @PathVariable Long stayId) {
        hotelStayService.deleteReservationIfReserved(stayId);
        return ResponseEntity.noContent().build();
    }
}