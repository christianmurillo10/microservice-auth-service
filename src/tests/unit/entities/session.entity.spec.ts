import { describe, it, expect } from "vitest";
import { v4 as uuidv4 } from "uuid";
import SessionEntity from "../../../entities/session.entity";
import { UserAccessType } from "../../../entities/user.entity";

describe("Session Entity", () => {
  it("should activate session", async () => {
    const session = new SessionEntity({
      id: uuidv4(),
      accessType: UserAccessType.Portal,
      accessToken: "access-token",
      refreshToken: uuidv4(),
      userId: uuidv4(),
      refreshTokenExpiresAt: new Date,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    expect(session.isRefreshExpired(new Date(Date.now() + 1000 * 60 * 60))).toBe(true);
  });
});