import { expect } from 'chai';
import request from 'supertest';

describe('Usuarios - operaciones CRUD con control de roles', () => {
  let app;
  let adminToken;
  let userToken;
  let createdUserId;

  before(async function () {
    this.timeout(20000);

    const appModule = await import('../src/app.js');
    app = appModule.default;

    const adminEmail = `admin_users_${Date.now()}@mail.com`;
    const userEmail = `user_users_${Date.now()}@mail.com`;

    const { userRepository } = await import('../src/repositories/_index.js');
    const { hashPassword } = await import('../src/utils/hash.js');

    await userRepository.create({
      first_name: 'Admin',
      last_name: 'Users',
      email: adminEmail,
      password: await hashPassword('123456'),
      role: 'admin',
      pets: []
    });

    await request(app).post('/api/auth/register').send({
      first_name: 'Regular',
      last_name: 'Users',
      email: userEmail,
      password: '123456'
    });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: adminEmail, password: '123456' });
    adminToken = adminLogin.body.data.accessToken;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: userEmail, password: '123456' });
    userToken = userLogin.body.data.accessToken;
  });

  describe('Creación de usuarios', () => {
    it('crea un usuario cuando el token es de administrador', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'New',
          last_name: 'User',
          email: `newuser_${Date.now()}@mail.com`,
          password: '123456',
          role: 'user'
        });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.not.have.property('password');
      createdUserId = res.body.data.id;
    });

    it('rechaza creación de usuario sin token', async () => {
      const res = await request(app).post('/api/users').send({
        first_name: 'Unauthorized',
        last_name: 'User',
        email: `unauth_${Date.now()}@mail.com`,
        password: '123456'
      });

      expect(res.status).to.equal(401);
    });

    it('rechaza creación de usuario con rol no administrador', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          first_name: 'Forbidden',
          last_name: 'User',
          email: `forbidden_${Date.now()}@mail.com`,
          password: '123456'
        });

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });

    it('rechaza creación con payload inválido', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Invalid',
          email: 'not-an-email',
          password: '123'
        });

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });

    it('rechaza creación cuando el email ya existe', async () => {
      const email = `duplicate_${Date.now()}@mail.com`;

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'First',
          last_name: 'Create',
          email,
          password: '123456',
          role: 'user'
        });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Second',
          last_name: 'Create',
          email,
          password: '123456',
          role: 'user'
        });

      expect(res.status).to.equal(409);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Listado y filtros', () => {
    it('lista usuarios cuando el token es de administrador', async () => {
      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.be.greaterThan(0);
      expect(res.body.data[0]).to.not.have.property('password');
    });

    it('rechaza listado sin token', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).to.equal(401);
    });

    it('rechaza listado con rol no administrador', async () => {
      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });

    it('filtra usuarios por rol', async () => {
      const res = await request(app)
        .get('/api/users')
        .query({ role: 'admin' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      res.body.data.forEach((user) => {
        expect(user.role).to.equal('admin');
      });
    });

    it('lista usuarios paginados', async () => {
      const res = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 2 })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.be.at.most(2);
      expect(res.body.meta).to.be.an('object');
      expect(res.body.meta).to.have.property('page', 1);
      expect(res.body.meta).to.have.property('limit', 2);
      expect(res.body.meta).to.have.property('total').that.is.a('number');
      expect(res.body.meta).to.have.property('totalPages').that.is.a('number');
    });

    it('rechaza paginación con parámetros inválidos', async () => {
      const res = await request(app)
        .get('/api/users')
        .query({ page: 0, limit: -5 })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Consulta por id', () => {
    it('obtiene usuario por id con rol administrador', async () => {
      const res = await request(app)
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.id).to.equal(createdUserId);
      expect(res.body.data).to.not.have.property('password');
    });

    it('retorna 404 cuando el usuario no existe', async () => {
      const res = await request(app)
        .get('/api/users/non-existent-user-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Actualización', () => {
    it('actualiza usuario con rol administrador', async () => {
      const res = await request(app)
        .patch(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Updated',
          last_name: 'Name'
        });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.first_name).to.equal('Updated');
      expect(res.body.data.last_name).to.equal('Name');
      expect(res.body.data).to.not.have.property('password');
    });

    it('rechaza actualización con rol no administrador', async () => {
      const res = await request(app)
        .patch(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ first_name: 'Hacked' });

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });

    it('permite actualizar contraseña y no expone el hash', async () => {
      const res = await request(app)
        .patch(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'newpassword123' });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.not.have.property('password');
    });
  });

  describe('Eliminación', () => {
    it('elimina usuario con rol administrador', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
    });

    it('retorna 404 al eliminar un usuario inexistente', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
    });

    it('rechaza eliminación con rol no administrador', async () => {
      const res = await request(app)
        .delete('/api/users/any-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });
  });
});
