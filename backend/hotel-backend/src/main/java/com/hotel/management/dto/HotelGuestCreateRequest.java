package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request payload to create a hotel guest")
public class HotelGuestCreateRequest {

    @NotBlank(message = "nome não pode ficar em branco")
    @Schema(description = "Guest full name", example = "João Silva")
    private String name;

    @NotBlank(message = "documento não pode ficar em branco")
    @Schema(description = "Document (CPF/CNPJ)", example = "123.456.789-00")
    private String document;

    @NotBlank(message = "telefone não pode ficar em branco")
    @Schema(description = "Phone number", example = "(11)99999-9999")
    private String phone;

    @NotNull(message = "hasCar deve ser informado")
    @Schema(description = "Whether guest has a car", example = "false")
    private Boolean hasCar;
}
