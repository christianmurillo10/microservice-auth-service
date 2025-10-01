import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { PrismaClient } from "../../prisma/client";
import { createUser } from "../mocks/prisma.mock";
import { UserAccessTypeValue } from "../../entities/user.entity";
import { getAccessToken } from "../../shared/helpers/common.helper";

const prisma = new PrismaClient();
const noutFoundId = "not-found-id";
let token = "";
let userId = "";
let id = "";

describe("Organization - Integration", () => {
  beforeAll(async () => {
    const seededUser = await createUser();
    const { accessToken } = getAccessToken(
      seededUser.id as unknown as number,
      seededUser.email,
      seededUser.accessType as UserAccessTypeValue,
      0,
      new Date(),
      5
    );

    token = accessToken;
    userId = seededUser.id;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.organization.delete({ where: { id } });
    await prisma.$disconnect();
  });

  it("should create organization", async () => {
    const res = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(201);

    id = res.body.data.id;
  });

  it("should fail create organization if duplicate", async () => {
    const res = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Organization" });
    expect(res.status).toBe(409);
  });

  it("should update organization", async () => {
    const res = await request(app)
      .put(`/organizations/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(200);
  });

  it("should fail update organization if id not found", async () => {
    const res = await request(app)
      .put(`/organizations/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Organization - updated" });
    expect(res.status).toBe(404);
  });

  it("should read organization", async () => {
    const res = await request(app)
      .get(`/organizations/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should fail read organization if id not found", async () => {
    const res = await request(app)
      .get(`/organizations/${noutFoundId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("should list organizations", async () => {
    const res = await request(app)
      .get("/organizations")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should delete organization", async () => {
    const res = await request(app)
      .delete(`/organizations/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});