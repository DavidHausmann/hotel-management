package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Response payload for HotelGuest")
public class HotelGuestResponse {
    @Schema(description = "Guest id", example = "1")
    private Long id;

    @Schema(description = "Full name", example = "João Silva")
    private String name;

    @Schema(description = "Document (CPF/CNPJ)", example = "123.456.789-00")
    private String document;

    @Schema(description = "Phone number", example = "(11)99999-9999")
    private String phone;

    @Schema(description = "Whether guest has a car", example = "true")
    private Boolean hasCar;
}
