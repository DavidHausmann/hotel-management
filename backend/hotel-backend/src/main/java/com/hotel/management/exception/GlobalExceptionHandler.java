package com.hotel.management.exception;

import com.hotel.management.dto.ErrorResponse;
import com.hotel.management.dto.FieldError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<FieldError> details = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            details.add(new FieldError(error.getField(), error.getDefaultMessage()));
        });

        ErrorResponse resp = new ErrorResponse();
        resp.setTimestamp(LocalDateTime.now());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        resp.setError("Requisição inválida");
        resp.setMessage("Erro de validação");
        resp.setDetails(details);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setTimestamp(LocalDateTime.now());
        resp.setStatus(org.springframework.http.HttpStatus.BAD_REQUEST.value());
        resp.setError("Requisição inválida");
        resp.setMessage(ex.getMessage());
        resp.setDetails(Collections.emptyList());

        return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setTimestamp(LocalDateTime.now());
        resp.setStatus(org.springframework.http.HttpStatus.NOT_FOUND.value());
        resp.setError("Não encontrado");
        resp.setMessage(ex.getMessage());
        resp.setDetails(Collections.emptyList());

        return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(resp);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ResourceConflictException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setTimestamp(LocalDateTime.now());
        resp.setStatus(org.springframework.http.HttpStatus.CONFLICT.value());
        resp.setError("Conflito");
        resp.setMessage(ex.getMessage());
        resp.setDetails(Collections.emptyList());

        return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).body(resp);
    }
}
