# Sun Island Tours — Dockerized Full Stack (Staff Console + Backend)

This zip contains:
- **backend/**: Spring Boot (REST/GraphQL placeholder) + WebSocket (STOMP) + Redis pub/sub + MongoDB
- **frontend/**: Angular (Sun Island Tours Staff Console) built and served by **nginx**
- **docker-compose.yml**: runs `mongo`, `redis`, `backend`, `frontend`

## Quick start

```bash
docker compose up --build
```

Then open:
- Staff Console: http://localhost:8080
- Backend health: http://localhost:8081/actuator/health

## Notes
- This is a **compilable scaffold** that matches the features we discussed (drafts, locks, presence).
- The backend includes **stub GraphQL** and **presence WebSocket endpoints** with in-memory demo behavior.
  Replace stubs with real Mongo persistence + GraphQL resolvers.

## Ports
- **8080**: nginx (Angular UI + reverse proxy for /graphql and /ws)
- **8081**: backend (Spring Boot)

## Environment
Configured in `docker-compose.yml`.

