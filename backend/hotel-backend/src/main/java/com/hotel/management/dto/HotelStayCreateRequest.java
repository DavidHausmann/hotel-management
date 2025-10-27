package com.hotel.management.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Data
@Schema(name = "HotelStayCreateRequest", description = "Request payload to create a reservation")
public class HotelStayCreateRequest {

    @Schema(description = "Planned start date for the reservation (ISO date)", example = "2025-11-01")
    private LocalDate plannedStartDate;

    @Schema(description = "Planned end date for the reservation (ISO date)", example = "2025-11-05")
    private LocalDate plannedEndDate;

    @Schema(description = "Number of guests for the reservation", example = "2")
    private Integer numberOfGuests;
}
