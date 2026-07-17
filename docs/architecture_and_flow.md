# Project Architecture & Request Flow

This document details the directory structure, modular boundaries, and request lifecycle flows for both the Frontend and Backend of the AI-Native Real Estate Platform.

---

## 📁 Directory Structure Overview

The project is structured as a mono-repository separating backend NestJS logic from frontend static assets:

```
AI-Native-Real-Estate-Platform/
├── Frontend/                    # Frontend presentation layer (static client)
│   ├── index.html               # Public landing page
│   ├── login.html               # User sign-in interface
│   ├── register.html            # User signup & role selection interface
│   ├── dashboard.html           # Secured role-specific dashboards
│   ├── css/                     # Styling stylesheet (style.css)
│   └── js/                      # Frontend routing and script logic (main.js)
├── src/                         # Backend business logic (NestJS Modular Monolith)
│   ├── main.ts                  # Bootstrap file (registers global guards, JSON logger)
│   ├── app.module.ts            # Root module (coordinates DB, Config, and feature modules)
│   ├── auth-identity/           # Bounded Context: Authentication, RBAC, and User Consent
│   │   ├── entities/            # Database schemas (User, Consent, RevokedToken)
│   │   ├── guards/              # Route interceptors (JwtAuthGuard, RolesGuard)
│   │   ├── strategies/          # Passport JWT strategy validation
│   │   └── *.service.ts         # User auth, token blacklist, and consent logic
│   └── audit-observability/     # Bounded Context: Append-only audit logs & Prometheus metrics
│       ├── entities/            # AuditLog database schema
│       └── *.controller.ts      # Log retrieval & prometheus exporter endpoints
└── docs/                        # Project status checklists and design verification reports
```

---

## 🧩 Backend Bounded Contexts

Following Domain-Driven Design (DDD) principles, the backend is partitioned into two isolated feature modules with strict boundaries:

```mermaid
graph TD
    AppModule[Root AppModule] --> AuthModule[Auth & Identity Module]
    AppModule --> AuditModule[Audit & Observability Module]
    
    subgraph AuthModule
        UserController[AuthIdentityController]
        AuthService[AuthIdentityService]
        ConsentService[ConsentService]
        UserEntity[(User Entity)]
        ConsentEntity[(Consent Entity)]
    end
    
    subgraph AuditModule
        AuditController[AuditObservabilityController]
        AuditService[AuditObservabilityService]
        MetricsController[MetricsController]
        AuditLogEntity[(AuditLog Entity)]
    end

    AuthService --> AuditService: Triggers Audit Events
```

---

## 🔄 Core Request Flows

Here is how core operations are processed across the system:

### 1. User Registration & Consent Seeding Flow

When a new user signs up, the system executes validation, user creation, and consent seeding atomically inside a database transaction:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant API as AuthIdentityController
    participant Auth as AuthIdentityService
    participant Consent as ConsentService
    participant DB as PostgreSQL Database
    participant Audit as AuditObservabilityService

    Client->>API: POST /v1/auth/register (email, password, role)
    API->>Auth: register(dto)
    Note over Auth: Hash password using bcrypt
    Auth->>DB: Open Transaction
    Auth->>DB: Insert User record
    Auth->>Consent: seedDefaultConsents(userId)
    Note over Consent: Create default consent states<br/>(AI use, verification, etc.)
    Consent->>DB: Insert 4 Consent records (mapped to User)
    Auth->>DB: Commit Transaction
    Auth->>Audit: log(USER_REGISTERED, userId)
    Audit->>DB: Insert Append-Only AuditLog record
    Auth-->>Client: Return registered user metadata (201 Created)
```

---

### 2. User Login & Access Protection Flow

When a user logs in, they receive a JWT token which they must attach to all subsequent secure requests. The global guards process authentication and authorization checks:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant API as Protected Controller Endpoint
    participant JwtGuard as JwtAuthGuard
    participant JwtStrat as JwtStrategy
    participant Blacklist as TokenBlacklistService
    participant RolesGuard as RolesGuard

    Client->>API: GET /v1/auth/profile (Header: Authorization: Bearer <token>)
    Note over JwtGuard: Intercept request globally
    JwtGuard->>JwtStrat: validate(payload)
    JwtStrat->>Blacklist: isTokenRevoked(token)
    Note over Blacklist: Check if token has been invalidated (logout)
    Blacklist-->>JwtStrat: False (valid)
    JwtStrat-->>JwtGuard: Populate req.user (sub, email, role)
    JwtGuard->>RolesGuard: canActivate(context)
    Note over RolesGuard: Verify req.user.role matches<br/>endpoint role requirements
    RolesGuard-->>API: Allow Access (True)
    API-->>Client: Return profile payload (200 OK)
```

---

### 3. Consent Modification Flow

Users can update optional consents. Crucial consent categories (e.g. Identity Verification) are marked as required and cannot be withdrawn:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant API as AuthIdentityController
    participant Consent as ConsentService
    participant DB as PostgreSQL Database
    participant Audit as AuditObservabilityService

    Client->>API: POST /v1/auth/consent/withdraw (category: 'ai_usage')
    API->>Consent: withdrawConsent(userId, email, category)
    Note over Consent: Validate category is not 'verification_processing' (non-withdrawable)
    Consent->>DB: Fetch user consent state
    Consent->>DB: Update consent 'granted' field to false
    Consent->>Audit: log(CONSENT_WITHDRAWN, userId)
    Audit->>DB: Insert Append-Only AuditLog record
    Consent-->>Client: Return updated consent payload (200 OK)
```
