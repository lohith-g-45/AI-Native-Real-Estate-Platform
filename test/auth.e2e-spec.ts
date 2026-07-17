import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth & Consent & Audit System (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let userId: string;
  const uniqueEmail = `user-${Date.now()}@example.com`;
  const password = 'StrongPassword123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. REGISTRATION
  describe('POST /v1/auth/register', () => {
    it('should successfully register a new buyer and exclude password from response', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: password,
          role: 'buyer',
          fullName: 'Test User',
          phoneNumber: '+1234567890',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', uniqueEmail);
      expect(response.body).toHaveProperty('role', 'buyer');
      expect(response.body).not.toHaveProperty('password');
      userId = response.body.id;
    });

    it('should fail to register with the same email (Conflict)', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          email: uniqueEmail,
          password: password,
          role: 'seller',
          fullName: 'Duplicate User',
        })
        .expect(409);
    });
  });

  // 2. LOGIN
  describe('POST /v1/auth/login', () => {
    it('should fail to login with wrong password (401)', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: 'WrongPassword!',
        })
        .expect(401);
    });

    it('should successfully login and return JWT access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: password,
        })
        .expect(201); // NestJS default POST is 201

      expect(response.body).toHaveProperty('accessToken');
      accessToken = response.body.accessToken;
    });
  });

  // 3. SECURE ENDPOINTS & GLOBAL RBAC
  describe('JWT Verification & Global Protection', () => {
    it('should reject requests without authorization header (401)', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/profile')
        .expect(401);
    });

    it('should allow request with valid JWT and return profile info', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', uniqueEmail);
      expect(response.body).toHaveProperty('role', 'buyer');
    });

    it('should block access to seller-only route for buyer user (403)', async () => {
      await request(app.getHttpServer())
        .get('/v1/auth/seller-only')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  // 4. CONSENT MANAGEMENT
  describe('Consent Management API', () => {
    it('should retrieve default seeded consents for the registered user', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/auth/consents')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
      
      const verificationConsent = response.body.find((c: any) => c.category === 'verification_processing');
      expect(verificationConsent).toBeDefined();
      expect(verificationConsent.granted).toBe(true);
      expect(verificationConsent.required).toBe(true);
    });

    it('should block withdrawal of required consent (400)', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/consents/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          category: 'verification_processing',
        })
        .expect(400);

      expect(response.body.message).toContain('Cannot withdraw required consent');
    });

    it('should successfully withdraw optional consent', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/consents/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          category: 'communications',
        })
        .expect(201);

      expect(response.body).toHaveProperty('category', 'communications');
      expect(response.body).toHaveProperty('granted', false);
    });

    it('should successfully grant optional consent', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/consents/grant')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          category: 'communications',
        })
        .expect(201);

      expect(response.body).toHaveProperty('category', 'communications');
      expect(response.body).toHaveProperty('granted', true);
    });
  });

  // 5. AUDIT OBSERVABILITY
  describe('Audit Observability API', () => {
    it('should verify audit logs were written for registration, login, and consent changes', async () => {
      const response = await request(app.getHttpServer())
        .get(`/audit-observability/logs/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);

      const events = response.body.map((log: any) => log.event);
      expect(events).toContain('USER_REGISTERED');
      expect(events).toContain('USER_LOGIN');
      expect(events).toContain('CONSENT_GRANTED');
    });

    it('should verify audit logs exist for login failed events by event type', async () => {
      const response = await request(app.getHttpServer())
        .get('/audit-observability/logs/event/USER_LOGIN_FAILED')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      
      const failedLog = response.body.find((log: any) => log.email === uniqueEmail);
      expect(failedLog).toBeDefined();
      expect(failedLog.metadata.reason).toBe('wrong_password');
    });
  });
});
