package com.hotel.management.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Enumeration of possible stay states")
public enum HotelStayStatus {
    @Schema(description = "Reservation created but not checked in yet")
    RESERVED,

    @Schema(description = "Guest has checked in and is currently staying")
    CHECKED_IN,

    @Schema(description = "Guest has checked out")
    CHECKED_OUT
}