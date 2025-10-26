package com.hotel.management.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Hotel Management API", version = "1.0.0", description = "API to manage hotel guests and stays (reservations, check-in/out)", contact = @Contact(name = "David Hausmann", email = "david@example.com"), license = @License(name = "MIT")))
public class OpenApiConfig {

}
