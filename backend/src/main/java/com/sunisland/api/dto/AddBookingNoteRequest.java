package com.sunisland.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AddBookingNoteRequest(@NotBlank String note) {}

