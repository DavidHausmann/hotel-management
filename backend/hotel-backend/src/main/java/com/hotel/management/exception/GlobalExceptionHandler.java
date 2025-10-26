package com.hotel.management.exception;

import com.hotel.management.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        ErrorResponse resp = new ErrorResponse();
        resp.setTimestamp(LocalDateTime.now());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        resp.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        resp.setMessage("Validation error");
        resp.setDetails(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }
}
