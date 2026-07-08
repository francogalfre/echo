import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    env: {
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
      BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret-1234",
      BETTER_AUTH_URL: "http://localhost:3000",
      GOOGLE_CLIENT_ID: "test-google-client-id",
      GOOGLE_CLIENT_SECRET: "test-google-client-secret",
      GITHUB_CLIENT_ID: "test-github-client-id",
      GITHUB_CLIENT_SECRET: "test-github-client-secret",
      POLAR_ACCESS_TOKEN: "test-polar-access-token",
      POLAR_SUCCESS_URL: "http://localhost:3001/success",
      POLAR_WEBHOOK_SECRET: "test-polar-webhook-secret",
      POLAR_PRO_PRODUCT_ID: "test-polar-pro-product-id",
      OPENROUTER_API_KEY: "test-openrouter-api-key",
      CORS_ORIGIN: "http://localhost:3001",
    },
  },
});
