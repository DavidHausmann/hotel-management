package com.hotel.management.exception;

/**
 * Exception representing a business conflict (mapped to HTTP 409).
 */
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}
