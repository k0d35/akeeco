package com.sunisland.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunisland.api.domain.StaffRole;
import com.sunisland.api.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {
  private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
  private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

  private final JwtProperties properties;
  private final ObjectMapper objectMapper;

  public String issueToken(String username, StaffRole role) {
    try {
      String header = URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
      long exp = Instant.now().getEpochSecond() + properties.expirationSeconds();
      String payload = URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(Map.of(
        "sub", username,
        "role", role.name(),
        "exp", exp
      )));
      String sig = sign(header + "." + payload);
      return header + "." + payload + "." + sig;
    } catch (Exception ex) {
      throw new UnauthorizedException("Unable to issue JWT token.");
    }
  }

  public JwtPrincipal parse(String token) {
    try {
      String[] parts = token.split("\\.");
      if (parts.length != 3) {
        throw new UnauthorizedException("Invalid token format.");
      }
      String expected = sign(parts[0] + "." + parts[1]);
      if (!constantTimeEquals(expected, parts[2])) {
        throw new UnauthorizedException("Invalid token signature.");
      }
      @SuppressWarnings("unchecked")
      Map<String, Object> payload = objectMapper.readValue(URL_DECODER.decode(parts[1]), Map.class);
      long exp = ((Number) payload.get("exp")).longValue();
      if (Instant.now().getEpochSecond() >= exp) {
        throw new UnauthorizedException("Token expired.");
      }
      String sub = (String) payload.get("sub");
      String role = (String) payload.get("role");
      return new JwtPrincipal(sub, StaffRole.valueOf(role));
    } catch (UnauthorizedException ex) {
      throw ex;
    } catch (Exception ex) {
      throw new UnauthorizedException("Invalid token.");
    }
  }

  private String sign(String value) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(properties.secret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    return URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
  }

  private boolean constantTimeEquals(String left, String right) {
    byte[] a = left.getBytes(StandardCharsets.UTF_8);
    byte[] b = right.getBytes(StandardCharsets.UTF_8);
    if (a.length != b.length) {
      return false;
    }
    int result = 0;
    for (int i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return result == 0;
  }
}

