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
@Tag(name = "Hóspedes", description = "Gerencia hóspedes do hotel: criar, buscar, atualizar e excluir")
public class HotelGuestController {

        private final HotelGuestService hotelGuestService;

        public HotelGuestController(HotelGuestService hotelGuestService) {
                this.hotelGuestService = hotelGuestService;
        }

        @Operation(summary = "Criar hóspede", description = "Criar um novo registro de hóspede.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Hóspede criado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class), examples = @ExampleObject(value = "{\"id\":1,\"name\":\"João Silva\",\"document\":\"123.456.789-00\",\"phone\":\"(11)99999-9999\",\"hasCar\":true}"))),
                        @ApiResponse(responseCode = "400", description = "Erro de validação", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 400, \"error\": \"Requisição inválida\", \"message\": \"Erro de validação\", \"details\": [{\"field\": \"name\", \"message\": \"não pode ficar em branco\"}, {\"field\": \"document\", \"message\": \"formato inválido (esperado CPF/CNPJ)\"}, {\"field\": \"phone\", \"message\": \"número de telefone inválido\"}]}")))
        })
        @PostMapping
        public ResponseEntity<HotelGuest> save(
                        @Parameter(description = "Payload do hóspede") @Valid @RequestBody HotelGuest hotelGuest) {
                HotelGuest saved = hotelGuestService.save(hotelGuest);
                return ResponseEntity.ok(saved);
        }

        @Operation(summary = "Listar hóspedes", description = "Retorna todos os hóspedes.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lista de hóspedes", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
        })
        @GetMapping
        public ResponseEntity<List<HotelGuest>> list() {
                return ResponseEntity.ok(hotelGuestService.list());
        }

        @Operation(summary = "Buscar por nome", description = "Buscar hóspedes por nome parcial ou completo (case-insensitive).")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Hóspedes encontrados", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
        })
        @GetMapping("/name/{name}")
        public ResponseEntity<List<HotelGuest>> searchByName(
                        @Parameter(description = "Nome ou parte do nome para busca", required = true) @PathVariable String name) {
                return ResponseEntity.ok(hotelGuestService.searchByName(name));
        }

        @Operation(summary = "Buscar por documento", description = "Buscar hóspedes por número de documento.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Hóspedes encontrados", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
        })
        @GetMapping("/document/{document}")
        public ResponseEntity<List<HotelGuest>> searchByDocument(
                        @Parameter(description = "Documento (CPF/CNPJ) para busca", required = true) @PathVariable String document) {
                return ResponseEntity.ok(hotelGuestService.searchByDocument(document));
        }

        @Operation(summary = "Buscar por telefone", description = "Buscar hóspedes por número de telefone (partes são aceitas).")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Hóspedes encontrados", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class)))
        })
        @GetMapping("/phone/{phone}")
        public ResponseEntity<List<HotelGuest>> searchByPhone(
                        @Parameter(description = "Número de telefone para busca", required = true) @PathVariable String phone) {
                return ResponseEntity.ok(hotelGuestService.searchByPhone(phone));
        }

        @Operation(summary = "Excluir hóspede", description = "Excluir um hóspede pelo ID.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "Hóspede excluído"),
                        @ApiResponse(responseCode = "404", description = "Hóspede não encontrado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 404, \"error\": \"Não encontrado\", \"message\": \"Hóspede não encontrado\", \"details\": [{\"field\": \"id\", \"message\": \"nenhum hóspede com id 123\"}]}")))
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
                        @Parameter(description = "ID do hóspede a ser excluído", required = true) @PathVariable Long id) {
                hotelGuestService.deleteById(id);
                return ResponseEntity.noContent().build();
        }

        @Operation(summary = "Atualizar parcialmente hóspede", description = "Atualizar parcialmente campos do hóspede. Forneça um JSON com os campos a serem alterados.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Hóspede atualizado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = HotelGuest.class))),
                        @ApiResponse(responseCode = "400", description = "Entrada inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.ErrorResponse.class), examples = @ExampleObject(value = "{\"timestamp\": \"2025-10-26T11:00:00\", \"status\": 400, \"error\": \"Requisição inválida\", \"message\": \"Entrada inválida para patch\", \"details\": [{\"field\": \"hasCar\", \"message\": \"deve ser booleano\"}, {\"field\": \"phone\", \"message\": \"formato inválido\"}]}")))
        })
        @PatchMapping("/{id}")
        public ResponseEntity<HotelGuest> patch(
                        @Parameter(description = "ID do hóspede a ser atualizado", required = true) @PathVariable Long id,
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Objeto parcial do hóspede. Forneça apenas os campos a serem atualizados.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.hotel.management.dto.HotelGuestPatchRequest.class), examples = {
                                        @ExampleObject(name = "update-name", value = "{\"name\": \"Maria Silva\"}"),
                                        @ExampleObject(name = "update-phone", value = "{\"phone\": \"(11)98888-7777\"}"),
                                        @ExampleObject(name = "update-hasCar", value = "{\"hasCar\": true}")
                        })) @RequestBody com.hotel.management.dto.HotelGuestPatchRequest updates) {
                HotelGuest updated = hotelGuestService.patch(id, updates);
                return ResponseEntity.ok(updated);
        }
}
