# TypeScript Code Standards

Estas reglas aplican a todos los archivos `.ts` y `.tsx` en Echo.

## Type Safety (Mandatory)

- ❌ Never use `any` — this is an ESLint error
- ❌ Never use `unknown` unless you're explicitly type-guarding
- ✅ Use **branded types** for IDs to prevent mix-ups:
  ```typescript
  type ProjectId = string & { readonly __brand: "ProjectId" };
  type OrganizationId = string & { readonly __brand: "OrganizationId" };
  ```
- ✅ Use **discriminated unions** for state:
  ```typescript
  type Result<T> = { success: true; data: T } | { success: false; error: string };
  ```

## Generics & Constraints

- Keep generics **readable**: max 2-3 per function
- Use **constraints** to clarify intent:
  ```typescript
  function cache<T extends { id: string }>(item: T): void {}
  ```
- Extract complex generics to **type aliases**:
  ```typescript
  type ApiResponse<T> = { data: T; timestamp: number };
  ```

## Function Types

- **Always declare return type explicitly**:
  ```typescript
  ✅ function getId(): ProjectId
  ❌ function getId() // no return type
  ```
- Use **overloads sparingly** — prefer union types
- Arrow functions for inline callbacks, regular `function` for declarations

## Null Handling

- Use **non-null assertions** sparingly (only when you're 100% sure)
- Prefer **optional chaining**:
  ```typescript
  ✅ user?.profile?.name
  ❌ user && user.profile && user.profile.name
  ```
- Use **nullish coalescing** for defaults:
  ```typescript
  const limit = feedback?.limit ?? 100;
  ```

## Enums vs. Union Types

- **Avoid enums** — use `as const` + unions:

  ```typescript
  // ✅ Better tree-shaking, simpler code
  const FeedbackStatus = {
    PENDING: "pending",
    REVIEWED: "reviewed",
    ARCHIVED: "archived",
  } as const;
  type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus];

  // ❌ Enums are heavier
  enum FeedbackStatus {
    PENDING,
    REVIEWED,
    ARCHIVED,
  }
  ```

## Interfaces vs. Types

- Use **`type`** for data structures (the default)
- Use **`interface`** only for class contracts or when you need merging
  ```typescript
  ✅ type Feedback = { id: ProjectId; content: string };
  ✅ interface Logger { log(msg: string): void; }
  ```

## Readonly & Immutability

- Mark **API inputs as `readonly`**:
  ```typescript
  function create(input: readonly { readonly id: ProjectId }): void {}
  ```
- Prefer **`as const`** for compile-time constants:
  ```typescript
  ✅ const PLANS = ['free', 'pro', 'enterprise'] as const;
  ❌ const PLANS: string[] = ['free', 'pro', 'enterprise'];
  ```

## Error Handling

- Create a **custom error type**:
  ```typescript
  class EchoError extends Error {
    constructor(
      public code: "INVALID_KEY" | "QUOTA_EXCEEDED" | "UNAUTHORIZED",
      message: string,
    ) {
      super(message);
    }
  }
  ```
- **Never throw `string`** — always throw an object:
  ```typescript
  ❌ throw "API key invalid";
  ✅ throw new EchoError('INVALID_KEY', 'API key format is invalid');
  ```

## Module Imports

Order imports as:

```typescript
// 1. External packages
import { NextRequest } from "next/server";
import { trpc } from "@trpc/server";

// 2. Workspace packages (@echo/*)
import { db } from "@echo/database";
import { env } from "@echo/environment";

// 3. Relative imports
import { validateProjectId } from "../utils";
import type { Project } from "./types";
```

## Comments

- ❌ No obvious comments: `const x = 5; // x is 5`
- ✅ Comment _why_, not _what_:
  ```typescript
  // We hash API keys before storage to prevent leaks if DB is compromised
  const hashedKey = await hash(apiKey);
  ```
- Use `// TODO:` for future work
- Use `// HACK:` only with explanation and date:
  ```typescript
  // HACK: Temporary rate limit bypass for testing — remove before launch (2026-07-01)
  ```

## Strict Mode

`tsconfig.json` must have:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  }
}
```
