# Sprint 1 Verification & Status Report

This report summarizes the changes made to the backend codebase, explains the mechanics of the resolved issues, details the outstanding items, and documents the latest test execution results.

---

## 🛠️ What Was Changed

We implemented several key changes to resolve critical bugs, finalize Sprint 1's backend requirements, and remediate all security audit vulnerabilities:

### 1. Security Vulnerability Remediations
* **The Issue**: The CI/CD security audit flagged 10 vulnerabilities (3 moderate, 7 high) in nested dependencies:
  * `tar` (nested inside `bcrypt` -> `@mapbox/node-pre-gyp` -> `tar`): Vulnerable to path traversal and arbitrary file creation/overwrite.
  * `lodash` (nested inside `@nestjs/config` -> `lodash`): Vulnerable to code injection.
* **The Resolution**: Configured dependency overrides in `pnpm-workspace.yaml` (the standard location for overrides in pnpm v11+) to force the use of patched package versions:
  ```yaml
  overrides:
    tar: "^7.5.11"
    lodash: "^4.17.24"
  ```
  Ran `pnpm install` to update `pnpm-lock.yaml`. A local check with `pnpm audit --audit-level=high` now confirms: **`No known vulnerabilities found`**.

### 2. Consent Query Scoping Bug Fix
* **The Issue**: When querying for user consents, TypeORM's object-relational mapping caused an ambiguity between the TypeScript property `userId: string` and the `@ManyToOne()` relation property `user: User`. This ambiguity caused TypeORM to ignore the `userId` filter condition in queries, generating a raw `SELECT * FROM consents` query that leaked consent records from other users.
* **The Resolution**: Refactored `getUserConsents`, `grantConsent`, and `withdrawConsent` methods in `ConsentService` to use TypeORM's `QueryBuilder` instead of object-based finders. This allows explicit control over the generated SQL queries:
  ```typescript
  async getUserConsents(userId: string): Promise<Consent[]> {
    return this.consentRepository
      .createQueryBuilder('consent')
      .where('consent.userId = :userId', { userId })
      .orderBy('consent.category', 'ASC')
      .getMany();
  }
  ```

### 3. TypeORM Database Insert Mapping Fix
* **The Issue**: When trying to save new consent records, TypeORM encountered a similar naming collision. Passing `userId` directly as a string property inside `.create({ userId })` resulted in TypeORM overriding it with the relation property value (`null`), violating the database's `NOT NULL` constraint and causing `500 Internal Server Error` responses.
* **The Resolution**: Modified the creation logic to explicitly pass the relation object payload:
  ```typescript
  const consent = this.consentRepository.create({
    user: { id: userId } as any,
    category: def.category,
    granted: def.granted,
    required: def.required,
  });
  ```
  TypeORM extracts the `id` from the relation object and maps it directly to the physical foreign key column on database insert.

### 4. JWT Identity Sub-Claim Mapping Fix
* **The Issue**: The `JwtStrategy`'s validate method was returning an object with `userId: payload.sub`, while the `AuthIdentityController` was referencing `req.user.sub`. Because `req.user.sub` evaluated to `undefined`, the controller passed `undefined` to the `ConsentService`, resulting in database scoping failures and null constraint violations.
* **The Resolution**: Added `sub: payload.sub` to the validate return object:
  ```typescript
  async validate(req: Request, payload: any) {
    ...
    return {
      userId: payload.sub,
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      emailVerified: payload.emailVerified,
      phoneVerified: payload.phoneVerified,
    };
  }
  ```

### 5. Observability & Security Pipelines
* **JSON Structured Logs**: Custom NestJS logger configured to output JSON-formatted logs in production for easier log indexing and central ingestion.
* **Prometheus Metrics**: Public `/metrics` endpoint configured to expose standard Node.js runtime metrics.

---

## 📋 What is Pending

While the backend logic, vulnerability fixes, and local integrations are 100% complete, the following environmental dependencies remain pending:

1. **Google OAuth & Twilio Credentials**: 
   * Active credentials (Client ID, Client Secret, Twilio SID, Auth Token) need to be configured in the `.env` file to verify production sign-in and SMS verification. The codebase falls back gracefully to console logs and mock validation responses when these credentials are empty.
2. **Staging Environment Deployment**:
   * The CD staging deploy job in the GitHub Actions workflow is templated but commented out. It requires configuring cloud credentials (e.g., AWS, Azure, or GCP keys) in GitHub Secrets to authorize live remote staging deployments.

---

## 🔬 Test Execution Results

We verified the codebase by running both unit and end-to-end integration test suites:

### 1. Unit Tests
All unit and health checking tests executed successfully:
```bash
$ pnpm run test
PASS src/common/health.controller.spec.ts
PASS src/app.controller.spec.ts

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        4.775 s
Ran all test suites.
```

### 2. End-to-End Integration Tests
All 14 integration tests covering user registration, role selection, login, route guard protection, consent withdrawal limits, and append-only audit trail generation executed and passed:
```bash
$ pnpm run test:e2e
PASS test/app.e2e-spec.ts (7.162 s)
PASS test/auth.e2e-spec.ts (8.068 s)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        9.764 s
Ran all test suites.
```
