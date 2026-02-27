package com.sunisland.api.exception;

import com.sunisland.api.dto.ApiErrorResponse;
import com.sunisland.api.util.CorrelationIdHolder;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> fields = new LinkedHashMap<>();
    for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
      fields.put(fieldError.getField(), fieldError.getDefaultMessage());
    }
    return build(HttpStatus.BAD_REQUEST, "Validation error", fields);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiErrorResponse> handleConstraint(ConstraintViolationException ex) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), Map.of());
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFound(NotFoundException ex) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of());
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException ex) {
    return build(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
  }

  @ExceptionHandler(DuplicateKeyException.class)
  public ResponseEntity<ApiErrorResponse> handleDuplicate(DuplicateKeyException ex) {
    return build(HttpStatus.CONFLICT, "Resource conflict: duplicate unique value.", Map.of());
  }

  @ExceptionHandler({BadRequestException.class, IllegalArgumentException.class})
  public ResponseEntity<ApiErrorResponse> handleBadRequest(RuntimeException ex) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), Map.of());
  }

  @ExceptionHandler({UnauthorizedException.class, BadCredentialsException.class})
  public ResponseEntity<ApiErrorResponse> handleUnauthorized(RuntimeException ex) {
    return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), Map.of());
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiErrorResponse> handleDenied(AccessDeniedException ex) {
    return build(HttpStatus.FORBIDDEN, "You do not have permission to perform this action.", Map.of());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", Map.of());
  }

  private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, Map<String, String> fieldErrors) {
    ApiErrorResponse response = new ApiErrorResponse(
      Instant.now(),
      status.value(),
      status.getReasonPhrase(),
      message,
      CorrelationIdHolder.get(),
      fieldErrors
    );
    return ResponseEntity.status(status).body(response);
  }
}
