package com.hotel.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotel_guest")
@Schema(description = "Represents a hotel guest (customer)")
public class HotelGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier", example = "1")
    private Long id;

    @NotBlank(message = "O nome do hóspede é obrigatório")
    @Schema(description = "Full name of the guest", example = "João Silva")
    @jakarta.persistence.Column(length = 255)
    private String name;

    @NotBlank(message = "O documento é obrigatório")
    @Schema(description = "Document number (CPF/CNPJ)", example = "123.456.789-00")
    @jakarta.persistence.Column(length = 255)
    private String document;

    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "^(\\(?\\d{2}\\)?\\s?)?(9?\\d{4}-?\\d{4})$", message = "O telefone deve estar em um formato válido (ex: 11999999999 ou (11)99999-9999)")
    @Schema(description = "Phone number", example = "(11)99999-9999")
    @jakarta.persistence.Column(length = 255)
    private String phone;

    @Schema(description = "Whether the guest has a car (used to calculate parking fees)", example = "true")
    private boolean hasCar;
}
