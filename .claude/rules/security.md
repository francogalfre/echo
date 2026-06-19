# Security Standards

- API keys: hash before storage
- Never log sensitive data (passwords, keys, tokens)
- Use Zod for input validation at every boundary
- SQL injection: use Drizzle parameterized queries
- CSRF: Next.js handles this by default in App Router
- Rate limiting: per API key, not per IP
- Environment variables: validate with @t3-oss/env-nextjs
