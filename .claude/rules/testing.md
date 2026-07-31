# Testing Standards

- Test files live in a `__tests__/` folder next to the source they cover:
  `services/__tests__/feedback.test.ts` alongside `services/feedback.ts`
- Use Vitest for unit/integration tests
- Use `describe()` blocks to organize
- Test names describe the scenario: `should reject if API key is missing`
- Mock external dependencies (OpenRouter, etc.)
