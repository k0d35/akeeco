package com.sunisland.api.config;

import com.sunisland.api.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(
          "/api/public/**",
          "/api/auth/**",
          "/swagger-ui.html",
          "/swagger-ui/**",
          "/v3/api-docs/**",
          "/actuator/health",
          "/graphql",
          "/graphiql"
        ).permitAll()
        .requestMatchers("/api/staff/**").authenticated()
        .anyRequest().permitAll()
      )
      .exceptionHandling(ex -> ex
        .authenticationEntryPoint((request, response, authException) -> {
          response.setStatus(HttpStatus.UNAUTHORIZED.value());
          response.getWriter().write("{\"message\":\"Authentication is required.\"}");
        })
        .accessDeniedHandler((request, response, accessDeniedException) -> {
          response.setStatus(HttpStatus.FORBIDDEN.value());
          response.getWriter().write("{\"message\":\"Access is forbidden.\"}");
        })
      )
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}

