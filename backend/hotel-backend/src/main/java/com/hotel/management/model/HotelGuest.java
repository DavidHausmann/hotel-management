package com.hotel.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotel_guests")
public class HotelGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do hóspede é obrigatório")
    private String name;

    @NotBlank(message = "O documento é obrigatório")
    private String document;

    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "^(\\(?\\d{2}\\)?\\s?)?(\\d{4,5}\\-?\\d{4})$", message = "O telefone deve estar em um formato válido")
    private String phone;

    private boolean hasCar;
}
