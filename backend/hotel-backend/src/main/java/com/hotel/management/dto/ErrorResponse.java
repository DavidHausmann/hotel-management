package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "Standard error response")
public class ErrorResponse {

    @Schema(description = "Timestamp when the error occurred", example = "2025-10-26T11:00:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Short error description", example = "Requisição inválida")
    private String error;

    @Schema(description = "Detailed message", example = "Erro de validação para o objeto 'hotelGuest'")
    private String message;

    @Schema(description = "Optional additional details as list of field errors")
    private List<FieldError> details;
}
