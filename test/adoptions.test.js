import { expect } from "chai";
import request from "supertest";

describe("Adopciones - flujo de adopción y validaciones", () => {
  let app;
  let adminToken;
  let user1Token;
  let user2Token;
  let petId;

  before(async function () {
    this.timeout(20000);

    const appModule = await import("../src/app.js");
    app = appModule.default;

    const adminEmail = `admin_adopt_${Date.now()}@mail.com`;
    const user1Email = `user1_adopt_${Date.now()}@mail.com`;
    const user2Email = `user2_adopt_${Date.now()}@mail.com`;

    const { userRepository } = await import("../src/repositories/_index.js");
    const { hashPassword } = await import("../src/utils/hash.js");

    await userRepository.create({
      first_name: "Admin",
      last_name: "Adopt",
      email: adminEmail,
      password: await hashPassword("123456"),
      role: "admin",
      pets: [],
    });

    await request(app).post("/api/auth/register").send({
      first_name: "User1",
      last_name: "Adopt",
      email: user1Email,
      password: "123456",
    });

    await request(app).post("/api/auth/register").send({
      first_name: "User2",
      last_name: "Adopt",
      email: user2Email,
      password: "123456",
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password: "123456" });
    adminToken = adminLogin.body.data.accessToken;

    const user1Login = await request(app)
      .post("/api/auth/login")
      .send({ email: user1Email, password: "123456" });
    user1Token = user1Login.body.data.accessToken;

    const user2Login = await request(app)
      .post("/api/auth/login")
      .send({ email: user2Email, password: "123456" });
    user2Token = user2Login.body.data.accessToken;

    const petRes = await request(app)
      .post("/api/pets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Luna",
        species: "cat",
        breed: "siamese",
        age: 1,
        status: "available",
      });

    petId = petRes.body.data.id;
  });

  describe("Creación", () => {
    it("crea una adopción y permite listar adoptions", async () => {
      const adoptRes = await request(app)
        .post("/api/adoptions")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ petId });

      expect(adoptRes.status).to.equal(201);
      expect(adoptRes.body.status).to.equal("success");
      expect(adoptRes.body.data).to.have.property("adoption");

      const listRes = await request(app)
        .get("/api/adoptions")
        .set("Authorization", `Bearer ${user1Token}`);

      expect(listRes.status).to.equal(200);
      expect(listRes.body.status).to.equal("success");
      expect(listRes.body.data).to.be.an("array");
      expect(listRes.body.data.length).to.be.greaterThan(0);
    });

    it("rechaza crear adopción sin token", async () => {
      const res = await request(app)
        .post("/api/adoptions")
        .send({ petId: "any-pet-id" });

      expect(res.status).to.equal(401);
    });

    it("rechaza crear adopción cuando falta petId", async () => {
      const res = await request(app)
        .post("/api/adoptions")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal("error");
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
    });

    it("rechaza adopción cuando la mascota no existe", async () => {
      const res = await request(app)
        .post("/api/adoptions")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ petId: "pet-not-found" });

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });

    it("rechaza adoptar una mascota ya adoptada", async () => {
      const res = await request(app)
        .post("/api/adoptions")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ petId });

      expect(res.status).to.equal(409);
      expect(res.body.status).to.equal("error");
    });
  });

  describe("Listado", () => {
    it("rechaza listar adopciones sin token", async () => {
      const res = await request(app).get("/api/adoptions");

      expect(res.status).to.equal(401);
    });
  });
});
