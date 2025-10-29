package com.hotel.management.exception;

import com.hotel.management.controller.HotelGuestController;
import com.hotel.management.dto.ErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;

import java.lang.reflect.Method;

import static org.assertj.core.api.Assertions.assertThat;

public class GlobalExceptionHandlerTest {

    @Test
    void handleValidationExceptions_should_return_structured_error_details() throws NoSuchMethodException {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();

        
        BeanPropertyBindingResult binding = new BeanPropertyBindingResult(new Object(), "hotelGuest");
        binding.addError(new FieldError("hotelGuest", "name", "must not be blank"));

        
        Method method = HotelGuestController.class.getMethod("save",
                com.hotel.management.dto.HotelGuestCreateRequest.class);
        MethodParameter param = new MethodParameter(method, 0);

        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(param, binding);

        var resp = handler.handleValidationExceptions(ex);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        ErrorResponse body = Objects.requireNonNull(resp.getBody());
        assertThat(body.getDetails()).isNotEmpty();
        assertThat(body.getDetails().get(0).getField()).isEqualTo("name");
        assertThat(body.getDetails().get(0).getMessage()).isEqualTo("must not be blank");
    }
}
