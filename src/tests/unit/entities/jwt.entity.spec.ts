import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import JWTEntity from "../../../entities/jwt.entity";
import { UserAccessType } from "../../../entities/user.entity";

let token: string;

describe("JWT Entity - Unit", () => {
  it("should encode jwt token", async () => {
    const jwt = new JWTEntity({
      id: faker.number.int(),
      email: faker.internet.email(),
      client: UserAccessType.Portal,
      scope: "*",
      sub: faker.number.int(),
      exp: Date.now() + 1000 * 60 * 60,
      iat: Date.now() / 1000,
      aud: "Microservice"
    });
    token = jwt.encodeToken();
    expect(token).toBeTypeOf("string");
  });

  it("should decode jwt token", async () => {
    const decoded = JWTEntity.decodeToken(token);
    expect(decoded).toHaveProperty("id");
    expect(decoded).toHaveProperty("email");
    expect(decoded).toHaveProperty("client");
    expect(decoded).toHaveProperty("scope");
    expect(decoded).toHaveProperty("sub");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("aud");
  });
});