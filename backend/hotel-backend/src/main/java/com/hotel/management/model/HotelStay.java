package com.hotel.management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotel_stay")
@Schema(description = "Represents a hotel stay/reservation and its billing details")
public class HotelStay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the stay", example = "1")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_guest_id", nullable = false)
    @Schema(description = "Associated guest entity (not included in DTO responses)")
    private HotelGuest hotelGuest;

    @Schema(description = "Check-in timestamp", example = "2025-10-26T14:00:00")
    private LocalDateTime checkinTime;

    @Schema(description = "Check-out timestamp", example = "2025-10-27T11:00:00")
    private LocalDateTime checkoutTime;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Current status of the stay")
    private HotelStayStatus status;

    @Schema(description = "Total amount charged for the stay")
    private Double totalAmount;
}