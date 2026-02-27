package com.sunisland.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ManageTokenPayloadValidator.class)
public @interface ValidManageTokenPayload {
  String message() default "Confirmation code and token are required";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}

