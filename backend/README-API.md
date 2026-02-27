# Sun Island Tours API

## Run locally

1. Start MongoDB:
```bash
docker compose up -d mongo
```
2. Start API:
```bash
cd backend
mvn spring-boot:run
```

Swagger UI:
- `http://localhost:8081/swagger-ui.html`

## Main environment variables

- `MONGO_URI=mongodb://localhost:27017/sunisland`
- `JWT_SECRET=replace-with-at-least-32-characters-secret`
- `BOOKING_CHANGE_WINDOW_HOURS=6`
- `BOOKING_CANCEL_WINDOW_HOURS=3`
- `PUBLIC_BASE_URL=http://localhost:8081`

## Notes

- Payment integration is intentionally stubbed:
  - `paymentTokenRef` is stored as a reference string only.
  - TODO markers are in booking logic for Stripe/processor integration.
- Driver module is phase 2:
  - Stub endpoint: `GET /api/staff/drivers/stub`
- Distance estimation is currently approximate when no coordinates are sent.
  - TODO marker added for Google Distance Matrix / Places integration.

