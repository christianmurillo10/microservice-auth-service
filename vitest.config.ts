// vitest.config.ts
import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.spec.ts"]
  },
});
