import { describe, it, expect } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { fa, faker } from "@faker-js/faker";
import UserEntity, { UserAccessType } from "../../../entities/user.entity";

describe("User Entity", () => {
  it("should activate user", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: false,
      isLogged: false,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user.activate();
    expect(user.isActive).toBe(true);
  });

  it("should deactivate user", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: true,
      isLogged: false,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user.deactivate();
    expect(user.isActive).toBe(false);
  });

  it("should mark user as logged in", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: true,
      isLogged: false,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user.markLoggedIn();
    expect(user.isLogged).toBe(true);
  });

  it("should mark user as logged out", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: true,
      isLogged: true,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    user.markLoggedOut();
    expect(user.isLogged).toBe(false);
  });

  it("should change and check password of user", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: true,
      isLogged: false,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newPassword = faker.internet.password();
    user.changePassword(newPassword);
    expect(user.checkPassword(newPassword)).toBe(false);
  });

  it("should soft delete user", async () => {
    const user = new UserEntity({
      id: uuidv4(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accessType: UserAccessType.Portal,
      organizationId: null,
      isActive: true,
      isLogged: false,
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.delete();
    expect(user.deletedAt).toBeInstanceOf(Date);
  });
});