import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import { PrismaClient } from "../../prisma/client";
import app from "../../app";

const prisma = new PrismaClient();
let server: http.Server;
let token = "";
let refreshToken = "";

describe("Auth - E2E", () => {
  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  it("should login seeded admin", async () => {
    const res = await request(server)
      .post("/auth/login")
      .send({ email: "superadmin@email.com", password: "password" });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    token = res.body.data.token;
    refreshToken = res.body.data.refreshToken;
  });

  it("should refresh token", async () => {
    const res = await request(server)
      .post("/auth/refresh-token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();

    token = res.body.data.token;
    refreshToken = res.body.data.refreshToken;
  });

  it("should logout", async () => {
    const res = await request(server)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});