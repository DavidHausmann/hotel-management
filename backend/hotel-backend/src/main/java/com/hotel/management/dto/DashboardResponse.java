package com.hotel.management.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "DashboardResponse", description = "Aggregated metrics for home/dashboard")
public class DashboardResponse {

    @Schema(description = "Total reservations planned for the current month")
    private Long totalReservations;

    @Schema(description = "Total stays currently checked in")
    private Long totalActiveCheckins;

    @Schema(description = "Total number of guests currently in the hotel (sum of numberOfGuests)")
    private Long totalCurrentGuests;

    @Schema(description = "Total number of checked-in guests who have cars")
    private Long totalCurrentCars;

}
