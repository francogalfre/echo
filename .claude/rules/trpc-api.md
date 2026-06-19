# tRPC API Design Standards

Echo's API is built entirely with tRPC. These rules ensure consistency.

## Procedure Structure

Every procedure follows this structure:

```typescript
router.procedure
  .input(
    z.object({
      /* validation */
    }),
  )
  .use(middleware) // Auth, logging, etc.
  .query(async ({ input, ctx }) => {
    // Implementation
  });
```

## Input Validation

- **Always use Zod** for input validation — no exceptions
- **Reuse schemas** across endpoints:

  ```typescript
  // schemas.ts
  export const CreateFeedbackInput = z.object({
    projectId: z.string().min(1),
    authorName: z.string().max(100),
    content: z.string().max(5000),
    source: z.enum(['api', 'form', 'widget']),
  });

  // Then use in routers
  router.createFeedback.input(CreateFeedbackInput)...
  ```

## Error Handling in tRPC

Use **tRPC error codes** consistently:

```typescript
throw new TRPCError({
  code: "UNAUTHORIZED", // Auth failed
  message: "Invalid API key",
});

throw new TRPCError({
  code: "FORBIDDEN", // Auth passed but not authorized
  message: "You cannot access this project",
});

throw new TRPCError({
  code: "NOT_FOUND", // Resource doesn't exist
  message: "Project not found",
});

throw new TRPCError({
  code: "BAD_REQUEST", // Bad input
  message: "Feedback content must not be empty",
});

throw new TRPCError({
  code: "CONFLICT", // Resource already exists (e.g., duplicate key)
  message: "Organization name already taken",
});

throw new TRPCError({
  code: "INTERNAL_SERVER_ERROR", // Unexpected errors only
  message: "Failed to process request",
});
```

**Never** return error in data:

```typescript
❌ return { success: false, error: 'Something went wrong' };
✅ throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '...' });
```

## Authorization Middleware

Every mutation and query that touches user data needs auth checks:

```typescript
// Middleware order matters: auth → org check → resource check

const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

const organizationProcedure = protectedProcedure
  .input(z.object({ organizationId: z.string() }))
  .use(async ({ input, ctx, next }) => {
    const org = await db.query.organizations.findFirst({
      where: (t) => eq(t.id, input.organizationId),
    });

    if (!org) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    // Check membership
    const isMember = await db.query.members.findFirst({
      where: (t) => and(eq(t.organizationId, org.id), eq(t.userId, ctx.user.id)),
    });

    if (!isMember) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx: { ...ctx, organization: org } });
  });
```

## Return Types

- **Return the minimal data needed**
- **Never** return passwords, secret keys, or sensitive fields
- **Shape types for the client**:

  ```typescript
  // ❌ Returns the entire DB row
  return project;

  // ✅ Returns only what the UI needs
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    plan: organization.plan,
  };
  ```

## API Key Endpoints (Public)

Echo has public endpoints for external feedback submission. They use a different auth layer:

```typescript
// Public router — different from authenticated
export const feedbackRouter = router({
  create: publicProcedure
    .input(CreateFeedbackInput)
    .use(apiKeyMiddleware) // Validates API key
    .mutation(async ({ input, ctx }) => {
      // ctx.projectId is validated from the key
      // No need to trust input.projectId
      return db.insert(feedback).values({
        projectId: ctx.projectId, // Use from context
        // ...
      });
    }),

  list: publicProcedure
    .input(z.object({ limit: z.number().max(100).default(50) }))
    .use(apiKeyMiddleware) // API key only allows GET if publishable type
    .query(async ({ input, ctx }) => {
      return db.query.feedback.findMany({
        where: eq(feedback.projectId, ctx.projectId),
        limit: input.limit,
      });
    }),
});
```

## Rate Limiting

Implement at the middleware level:

```typescript
const rateLimitMiddleware = middleware(async ({ input, ctx, next }) => {
  const key = ctx.apiKey || ctx.user.id;
  const allowed = await rateLimit.check(key, {
    max: 100,
    window: 60 * 1000, // 1 minute
  });

  if (!allowed) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded",
    });
  }

  return next();
});
```

## Mutations vs. Queries

- **Query**: read-only, safe to call multiple times
- **Mutation**: writes data, should have side effects

```typescript
// ✅ Correct: GET-like operation
list: publicProcedure.query(async () => {
  return db.query.feedback.findMany();
});

// ✅ Correct: POST-like operation
create: protectedProcedure.mutation(async ({ input }) => {
  return db.insert(feedback).values(input);
});

// ❌ Wrong: Creating without mutation
create: publicProcedure.query(async () => {
  return db.insert(feedback).values(input);
});
```

## Batch Operations

Avoid N+1 queries by loading related data:

```typescript
// ❌ N+1 queries
const projects = await db.query.projects.findMany();
const feedback = await Promise.all(
  projects.map((p) =>
    db.query.feedback.findMany({
      where: eq(feedback.projectId, p.id),
    }),
  ),
);

// ✅ Single query with relationship
const projects = await db.query.projects.findMany({
  with: { feedback: { limit: 10 } },
});
```

## Type Safety

tRPC gives you **end-to-end types for free**:

```typescript
// Frontend automatically knows the types
const { data: projects } = await trpc.projects.list.useQuery();
// data is typed as Project[], no manual type annotation needed
```

Always **leverage this** — never cast or use `as` in client code with tRPC. If types don't match, fix the backend.
