# Testing Standards

- Test files live next to source: `feature.test.ts` alongside `feature.ts`
- Use Vitest for unit/integration tests
- Use `describe()` blocks to organize
- Test names describe the scenario: `should reject if API key is missing`
- Mock external dependencies (OpenRouter, etc.)
