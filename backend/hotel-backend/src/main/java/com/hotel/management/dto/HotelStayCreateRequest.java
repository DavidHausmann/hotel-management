package com.hotel.management.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@Schema(name = "HotelStayCreateRequest", description = "Request payload to create a reservation")
public class HotelStayCreateRequest {

    @Schema(description = "Planned start date for the reservation (ISO date)", example = "2025-11-01")
    @NotNull(message = "plannedStartDate é obrigatório")
    private LocalDate plannedStartDate;

    @Schema(description = "Planned end date for the reservation (ISO date)", example = "2025-11-05")
    @NotNull(message = "plannedEndDate é obrigatório")
    private LocalDate plannedEndDate;

    @Schema(description = "Number of guests for the reservation", example = "2")
    @NotNull(message = "numberOfGuests é obrigatório")
    @Min(value = 1, message = "numberOfGuests deve ser no mínimo 1")
    private Integer numberOfGuests;
}
