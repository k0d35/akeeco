package com.sunisland.api.validation;

import com.sunisland.api.dto.CancelBookingRequest;
import com.sunisland.api.dto.UpdateBookingTimeRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ManageTokenPayloadValidator implements ConstraintValidator<ValidManageTokenPayload, Object> {
  @Override
  public boolean isValid(Object value, ConstraintValidatorContext context) {
    if (value == null) {
      return true;
    }

    if (value instanceof UpdateBookingTimeRequest request) {
      return !isBlank(request.confirmationCode()) && !isBlank(request.token());
    }
    if (value instanceof CancelBookingRequest request) {
      return !isBlank(request.confirmationCode()) && !isBlank(request.token());
    }
    return true;
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}

