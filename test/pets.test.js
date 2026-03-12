import { expect } from 'chai';
import request from 'supertest';

describe('Mascotas - gestión y permisos', () => {
  let app;
  let adminToken;
  let userToken;
  let createdPetId;

  before(async () => {
    process.env.PERSISTENCE = 'memory';
    process.env.NODE_ENV = 'test';

    const appModule = await import('../src/app.js');
    app = appModule.default;

    const adminEmail = `admin_${Date.now()}@mail.com`;
    const userEmail = `user_${Date.now()}@mail.com`;

    const { userRepository } = await import('../src/repositories/_index.js');
    const { hashPassword } = await import('../src/utils/hash.js');

    await userRepository.create({
      first_name: 'Admin',
      last_name: 'User',
      email: adminEmail,
      password: await hashPassword('123456'),
      role: 'admin',
      pets: []
    });

    await request(app).post('/api/auth/register').send({
      first_name: 'Regular',
      last_name: 'User',
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

  describe('Creación', () => {
    it('crea una mascota como admin y permite listarla', async () => {
      const createRes = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Milo',
          species: 'dog',
          breed: 'labrador',
          age: 2,
          status: 'available'
        });

      expect(createRes.status).to.equal(201);
      expect(createRes.body.status).to.equal('success');
      expect(createRes.body.data).to.have.property('id');
      createdPetId = createRes.body.data.id;

      const listRes = await request(app).get('/api/pets').query({ status: 'available' });

      expect(listRes.status).to.equal(200);
      expect(listRes.body.status).to.equal('success');
      expect(listRes.body.data).to.be.an('array');
      expect(listRes.body.data.length).to.be.greaterThan(0);
    });

    it('rechaza creación de mascota sin token', async () => {
      const res = await request(app).post('/api/pets').send({
        name: 'NoToken',
        species: 'dog',
        breed: 'mixed',
        age: 1
      });

      expect(res.status).to.equal(401);
    });

    it('rechaza creación de mascota con rol no administrador', async () => {
      const res = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'ForbiddenPet',
          species: 'dog',
          breed: 'mixed',
          age: 3
        });

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });

    it('rechaza creación de mascota con payload inválido', async () => {
      const res = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          species: 'cat',
          breed: 'siamese',
          age: -1
        });

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.errors).to.be.an('array').that.is.not.empty;
    });
  });

  describe('Consulta', () => {
    it('obtiene mascotas', async () => {
      const res = await request(app).get(`/api/pets`);
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.be.greaterThanOrEqual(0);
    });

    it('obtiene mascotas con filtros', async () => {
      const res = await request(app).get(`/api/pets`).query({ status: 'available' });
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.have.property('status', 'available');
    });    

    it('obtiene mascota por id', async () => {
      const res = await request(app).get(`/api/pets/${createdPetId}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.id).to.equal(createdPetId);
    });

    it('retorna 404 cuando la mascota no existe', async () => {
      const res = await request(app).get('/api/pets/non-existent-id');

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Actualización', () => {
    it('actualiza mascota con rol administrador', async () => {
      const res = await request(app)
        .patch(`/api/pets/${createdPetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ age: 4 });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.age).to.equal(4);
    });

    it('rechaza actualización con rol no administrador', async () => {
      const res = await request(app)
        .patch(`/api/pets/${createdPetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ age: 5 });

      expect(res.status).to.equal(403);
      expect(res.body.status).to.equal('error');
    });
  });

  describe('Eliminación', () => {
    it('elimina mascota con rol administrador', async () => {
      const res = await request(app)
        .delete(`/api/pets/${createdPetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
    });

    it('retorna 404 al eliminar una mascota ya borrada', async () => {
      const res = await request(app)
        .delete(`/api/pets/${createdPetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
    });
  });
});
