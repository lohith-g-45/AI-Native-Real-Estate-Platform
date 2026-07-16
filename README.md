# AI Native Real Estate Platform

This repository contains the initial NestJS backend foundation for Sprint 1.

## Sprint 1 Day 1 goals
- Scaffold a modular monolith using NestJS
- Create bounded contexts for auth-identity and audit-observability
- Provide health endpoints for each module
- Add basic CI/CD and local Postgres scaffolding

## Running locally

```bash
pnpm install
pnpm build
node dist/main.js
```

## Health checks
- http://localhost:3000/health
- http://localhost:3000/auth-identity/health
- http://localhost:3000/audit-observability/health
