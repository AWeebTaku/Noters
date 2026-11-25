import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", hookTimeout: 120000, testTimeout: 30000, env: { JWT_SECRET: "test-secret", NODE_ENV: "test" } },
});
