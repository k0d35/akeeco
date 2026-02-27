package com.sunisland.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "booking")
public record BookingPolicyProperties(int changeWindowHours, int cancelWindowHours) {}

