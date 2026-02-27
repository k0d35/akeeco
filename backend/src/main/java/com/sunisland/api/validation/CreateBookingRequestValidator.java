package com.sunisland.api.validation;

import com.sunisland.api.domain.PaymentMode;
import com.sunisland.api.dto.CreateBookingRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CreateBookingRequestValidator implements ConstraintValidator<ValidCreateBookingRequest, CreateBookingRequest> {
  @Override
  public boolean isValid(CreateBookingRequest value, ConstraintValidatorContext context) {
    if (value == null) {
      return true;
    }

    boolean valid = true;
    context.disableDefaultConstraintViolation();

    if (value.roundTrip() && value.returnDateTime() == null) {
      context.buildConstraintViolationWithTemplate("returnDateTime is required when roundTrip=true")
        .addPropertyNode("returnDateTime")
        .addConstraintViolation();
      valid = false;
    }

    if (value.paymentMode() == PaymentMode.PAY_NOW
      && (value.paymentTokenRef() == null || value.paymentTokenRef().isBlank())) {
      context.buildConstraintViolationWithTemplate("paymentTokenRef is required when paymentMode=PAY_NOW")
        .addPropertyNode("paymentTokenRef")
        .addConstraintViolation();
      valid = false;
    }

    return valid;
  }
}

