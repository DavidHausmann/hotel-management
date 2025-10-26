package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Partial update for HotelGuest - provide only fields to change")
public class HotelGuestPatchRequest {

    @Schema(description = "Guest full name", example = "Maria Silva", nullable = true)
    private String name;

    @Schema(description = "Document (CPF/CNPJ)", example = "123.456.789-00", nullable = true)
    private String document;

    @Schema(description = "Phone number", example = "(11)98888-7777", nullable = true)
    private String phone;

    @Schema(description = "Whether guest has a car", example = "true", nullable = true)
    private Boolean hasCar;
}
