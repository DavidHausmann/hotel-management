package com.hotel.management.controller;

import com.hotel.management.model.HotelGuest;
import com.hotel.management.service.HotelGuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest")
@CrossOrigin(origins = "*")
@Tag(name = "Hotel Guest", description = "Manage hotel guests: create, search, update and delete")
public class HotelGuestController {

    private final HotelGuestService hotelGuestService;

    public HotelGuestController(HotelGuestService hotelGuestService) {
        this.hotelGuestService = hotelGuestService;
    }

    @Operation(summary = "Create guest", description = "Create a new hotel guest record.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Guest created", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class), examples = @ExampleObject(value = "{\"id\":1,\"name\":\"João Silva\",\"document\":\"123.456.789-00\",\"phone\":\"(11)99999-9999\",\"hasCar\":true}"))),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 400, \"error\": \"Bad Request\", \"message\": \"Validation failed\", \"details\": [{\"field\": \"name\", \"message\": \"must not be blank\"}, {\"field\": \"document\", \"message\": \"invalid format (expected CPF/CNPJ)\"}, {\"field\": \"phone\", \"message\": \"invalid phone number\"}]}")))
    })
    @PostMapping
    public ResponseEntity<HotelGuest> save(
            @Parameter(description = "Guest payload") @Valid @RequestBody HotelGuest hotelGuest) {
        HotelGuest saved = hotelGuestService.save(hotelGuest);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "List guests", description = "Return all hotel guests.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of guests", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
    })
    @GetMapping
    public ResponseEntity<List<HotelGuest>> list() {
        return ResponseEntity.ok(hotelGuestService.list());
    }

    @Operation(summary = "Search by name", description = "Search guests by partial or full name (case-insensitive).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matching guests returned", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
    })
    @GetMapping("/name/{name}")
    public ResponseEntity<List<HotelGuest>> searchByName(
            @Parameter(description = "Name or partial name to search for", required = true) @PathVariable String name) {
        return ResponseEntity.ok(hotelGuestService.searchByName(name));
    }

    @Operation(summary = "Search by document", description = "Search guests by document number.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matching guests returned", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
    })
    @GetMapping("/document/{document}")
    public ResponseEntity<List<HotelGuest>> searchByDocument(
            @Parameter(description = "Document (CPF/CNPJ) to search for", required = true) @PathVariable String document) {
        return ResponseEntity.ok(hotelGuestService.searchByDocument(document));
    }

    @Operation(summary = "Search by phone", description = "Search guests by phone number (partial match allowed).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matching guests returned", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
    })
    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<HotelGuest>> searchByPhone(
            @Parameter(description = "Phone number to search for", required = true) @PathVariable String phone) {
        return ResponseEntity.ok(hotelGuestService.searchByPhone(phone));
    }

    @Operation(summary = "Delete guest", description = "Delete a guest by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Guest deleted"),
            @ApiResponse(responseCode = "404", description = "Guest not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 404, \"error\": \"Not Found\", \"message\": \"Guest not found\", \"details\": [{\"field\": \"id\", \"message\": \"no guest with id 123\"}]}")))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of guest to delete", required = true) @PathVariable Long id) {
        hotelGuestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch guest", description = "Partially update guest fields. Provide a JSON object with the fields to change.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Guest updated", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 400, \"error\": \"Bad Request\", \"message\": \"Invalid input for patch\", \"details\": [{\"field\": \"hasCar\", \"message\": \"must be boolean\"}, {\"field\": \"phone\", \"message\": \"invalid format\"}]}")))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<HotelGuest> patch(
            @Parameter(description = "ID of guest to update", required = true) @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Partial guest object. Provide only fields to update.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.HotelGuestPatchRequest.class), examples = {
                    @ExampleObject(name = "update-name", value = "{\"name\": \"Maria Silva\"}"),
                    @ExampleObject(name = "update-phone", value = "{\"phone\": \"(11)98888-7777\"}"),
                    @ExampleObject(name = "update-hasCar", value = "{\"hasCar\": true}")
            })) @RequestBody com.hotel.management.dto.HotelGuestPatchRequest updates) {
        HotelGuest updated = hotelGuestService.patch(id, updates);
        return ResponseEntity.ok(updated);
    }
}
