# Echo — Claude Code Configuration

## Project Context

**Echo** is a developer-first feedback infrastructure SaaS.

**Stack**:

- Monorepo: Turborepo + Bun
- Frontend: Next.js 15 (App Router)
- Backend: Hono + tRPC
- Database: PostgreSQL (Supabase)
- ORM: Drizzle
- Auth: Better-Auth
- AI: Vercel AI SDK + OpenRouter

**Core Architecture**:

- Multi-tenant with `organizations` → `projects` → `feedback`
- API-first: API keys (secret/publishable) for public feedback endpoints
- Free tier: 1 project, sentiment included, limited feedback volume
- Pro tier: Usage-based billing, resumes, advanced features

---

## Code Standards

### TypeScript

- **Always** enable `strict: true` in tsconfig
- **Never** use `any` type — this is an error in ESLint
- Use **branded types** for IDs: `type ProjectId = string & { readonly __brand: 'ProjectId' }`
- Discriminated unions for state machines (e.g., FeedbackStatus)
- Return types on functions are explicit, always

### File Organization

- **Max 300 lines per file** — break up into smaller modules if longer
- **Max 100 characters per line** (enforced by Prettier)
- **Imports at top**, organized: external → internal packages → relative paths
- **No default exports** — named exports for better refactoring
- **No empty catch blocks** — always handle or rethrow

### Functions & Methods

- **Explicit return types**: `function getId(): ProjectId`
- **Short parameter lists**: if >3 params, use object destructuring
- **Early returns** to reduce nesting
- **No side effects in pure functions** — be explicit about I/O

### React Components

- **Server components by default** in Next.js
- `'use client'` only at leaf components, not at page level
- Props interface explicitly typed
- No logic in JSX — extract to `utils/` or component hooks

### Error Handling

- **Use Result types** for domain errors: `type Result<T> = { success: true, data: T } | { success: false, error: string }`
- **Never swallow errors silently** — log or rethrow
- **Validate at boundaries**: API routes, tRPC procedures, form inputs
- Use **Zod** for runtime validation

### Database

- Drizzle **schema files** live in `packages/database/schema/`
- **Migrations** are auto-generated, manually edited only in emergencies
- **RLS (Row-Level Security)** enforced at Postgres level for multi-tenancy
- No N+1 queries — always `.with()` or explicit joins

### API Design (tRPC)

- **Input validation with Zod** on every procedure
- **Authorization checks first** in middleware
- **Consistent error codes**: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INVALID_INPUT
- **Lean API** — only expose what frontend needs

---

## Testing

- Write tests as you code — don't leave 100% untested features
- **Unit tests** for utils, types, logic
- **Integration tests** for API routes + database
- Test names should read like documentation: `should reject API key if not prefixed with echo_`
- Use test factories for common fixtures (e.g., `createMockProject()`)

---

## Performance & Security

- **API keys**: never log in plain text, always hash before storage
- **Rate limiting**: per API key, not per IP (keys can come from behind proxies)
- **Environment variables**: use `@t3-oss/env-nextjs` for validation
- **Client secrets**: never expose in frontend bundles
- **SQL injection**: Drizzle parameterized queries prevent this — never concatenate SQL

---

## Documentation

- **Code comments**: only for _why_, not _what_ — the code should be clear enough
- **README.md**: at each package level, explains what the package does
- **API docs**: tRPC automatically exposes types — that IS the documentation
- TypeScript types are documentation — use them heavily

---

## Debugging

- `console.warn()` and `console.error()` are allowed in production (ESLint allows these)
- `console.log()` is a warning — remove before committing
- Use `DEBUG=echo:*` environment variable for conditional logging (adopt standard)
- Never commit `debugger` statements

---

## Git & Commits

- **Atomic commits**: one feature/fix per commit, testable on its own
- **Descriptive commit messages**: "Add sentiment classification for feedback" not "fix stuff"
- Use **conventional commits** if team adopts: `feat(api): add feedback POST endpoint`

---

## Common Gotchas in Echo

1. **Multi-tenancy**: Always filter by `organizationId` at database level — never trust the frontend
2. **API key validation**: Check the key type (secret vs. publishable) before allowing operations
3. **Feedback source tracking**: Include `source: 'api' | 'form' | 'widget'` on every feedback insert
4. **Plan limits**: Check `plan` column on `organizations` before allowing features (Pro only)

---

## Folder Structure You'll See

```
echo/
├── apps/
│   ├── web/              # Next.js dashboard
│   └── server/           # Hono backend (experimental, keep minimal)
├── packages/
│   ├── api/              # tRPC routers
│   ├── auth/             # Better-Auth config
│   ├── database/         # Drizzle ORM + schema
│   ├── environment/      # Env var validation
│   ├── ui/               # Shared React components
│   └── configuration/    # Shared config
└── .claude/              # This directory

```

---

## When to Ask for Help

Claude Code will try to implement features end-to-end. If stuck on:

- **Multi-tenancy edge cases**: Ask about authorization layer
- **Drizzle migrations**: Ask about schema backwards compatibility
- **tRPC type inference**: This is always tricky — explicit help here is good
- **Performance**: Ask about N+1 queries or missing indexes

Just describe what you're trying to do and Claude will figure it out.

---

## Last Note

Keep this file under 150 lines and specific. It's **guidance**, not law. If a pattern in the codebase contradicts this, follow the codebase — consistency beats doctrine.
Never put comments in the code.
