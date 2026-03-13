import { expect } from 'chai';
import request from 'supertest';

describe('Autenticación - flujo de credenciales y tokens', () => {
  let app;
  let registeredEmail;
  let registeredPassword;

  before(async function () {
    this.timeout(20000);
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

    const appModule = await import('../src/app.js');
    app = appModule.default;

    registeredEmail = `auth_${Date.now()}@mail.com`;
    registeredPassword = '123456';
  });

  describe('Registro', () => {
    it('registra un usuario estándar e ignora un role elevado', async () => {
      const registerRes = await request(app).post('/api/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: registeredEmail,
        password: registeredPassword,
        role: 'admin'
      });

      expect(registerRes.status).to.equal(201);
      expect(registerRes.body.status).to.equal('success');
      expect(registerRes.body.data).to.have.property('accessToken');
      expect(registerRes.body.data).to.have.property('refreshToken');
      expect(registerRes.body.data.user.email).to.equal(registeredEmail);
      expect(registerRes.body.data.user.role).to.equal('user');
      expect(registerRes.body.data.user).to.not.have.property('password');
    });

    it('rechaza el registro cuando faltan campos obligatorios', async () => {
      const res = await request(app).post('/api/auth/register').send({
        first_name: 'NoLastName',
        email: `invalid_${Date.now()}@mail.com`,
        password: '123456'
      });

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('rechaza el registro con email duplicado', async () => {
      const res = await request(app).post('/api/auth/register').send({
        first_name: 'John',
        last_name: 'Duplicate',
        email: registeredEmail,
        password: '123456'
      });

      expect(res.status).to.equal(409);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Login', () => {
    it('permite login válido y retorna tokens', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: registeredEmail,
        password: registeredPassword
      });

      expect(loginRes.status).to.equal(200);
      expect(loginRes.body.status).to.equal('success');
      expect(loginRes.body.data).to.have.property('accessToken');
      expect(loginRes.body.data).to.have.property('refreshToken');
      expect(loginRes.body.data.user.email).to.equal(registeredEmail);
    });

    it('rechaza login con contraseña incorrecta', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: registeredEmail,
        password: 'wrong-password'
      });

      expect(res.status).to.equal(401);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Refresh de tokens', () => {
    it('emite nuevo access token usando refresh token', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: registeredEmail,
        password: registeredPassword
      });

      const refreshRes = await request(app).post('/api/auth/refresh').send({
        refreshToken: loginRes.body.data.refreshToken
      });

      expect(refreshRes.status).to.equal(200);
      expect(refreshRes.body.status).to.equal('success');
      expect(refreshRes.body.data).to.have.property('accessToken');
    });

    it('rechaza refresh cuando falta el refreshToken', async () => {
      const res = await request(app).post('/api/auth/refresh').send({});

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
    });

    it('rechaza refresh con token inválido o expirado', async () => {
      const res = await request(app).post('/api/auth/refresh').send({
        refreshToken: 'invalid.refresh.token'
      });

      expect(res.status).to.equal(401);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Sesión actual', () => {
    it('protege el endpoint current cuando no hay token', async () => {
      const res = await request(app).get('/api/auth/current');

      expect(res.status).to.equal(401);
    });
  });
});
