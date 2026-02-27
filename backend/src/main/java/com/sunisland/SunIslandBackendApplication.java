package com.sunisland;

import com.sunisland.api.config.AppProperties;
import com.sunisland.api.config.BookingPolicyProperties;
import com.sunisland.api.security.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({BookingPolicyProperties.class, JwtProperties.class, AppProperties.class})
public class SunIslandBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(SunIslandBackendApplication.class, args);
  }
}
