package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Single field validation error")
public class FieldError {

    @Schema(description = "Field name", example = "name")
    private String field;

    @Schema(description = "Validation message", example = "não pode ficar em branco")
    private String message;
}
