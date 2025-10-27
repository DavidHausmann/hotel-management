package com.hotel.management.dto;

import com.hotel.management.model.HotelStayStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(name = "HotelStayResponse", description = "DTO returned for hotel stay queries and operations")
public class HotelStayResponse {

    @Schema(description = "Unique identifier of the stay", example = "1")
    private Long id;

    @Schema(description = "Check-in timestamp in ISO-8601 format", example = "2025-10-26T14:00:00")
    private LocalDateTime checkinTime;

    @Schema(description = "Check-out timestamp in ISO-8601 format", example = "2025-10-27T11:00:00")
    private LocalDateTime checkoutTime;

    @Schema(description = "Current status of the stay", example = "CHECKED_IN")
    private HotelStayStatus status;

    @Schema(description = "Total amount charged for the stay (calculated at checkout)")
    private Double totalAmount;

    @Schema(description = "Identifier of the associated hotel guest", example = "42")
    private Long hotelGuestId;

    @Schema(description = "Planned start date for the reservation", example = "2025-11-01")
    private LocalDate plannedStartDate;

    @Schema(description = "Planned end date for the reservation", example = "2025-11-05")
    private LocalDate plannedEndDate;

    @Schema(description = "Number of guests for the reservation", example = "2")
    private Integer numberOfGuests;
}