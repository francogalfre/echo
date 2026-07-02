# Dashboard Redesign Phase 1 — Design System Foundation + Shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine Echo's design tokens, add the missing UI primitives to `@echo/ui` (Base UI + shadcn base-lyra style), add a shared motion system, and redesign the dashboard sidebar + topbar to a Vercel/Linear-quality shell.

**Architecture:** `packages/ui` is the design system (Base UI primitives, tokens in `globals.css`, shadcn CLI configured with `base-lyra` style and `@echo/ui/*` aliases). Complex interactive primitives are scaffolded via the shadcn CLI and normalized to Echo's tokens/icons; simple primitives are authored directly. The dashboard shell in `apps/web/src/app/dashboard/components/` consumes them.

**Tech Stack:** Next.js 16, Tailwind 4, `@base-ui/react` 1.6, `motion` 12, `class-variance-authority`, `@hugeicons/react` (via `Icons`), Vitest (new), Bun.

## Global Constraints

- **NEVER commit without the user's explicit approval.** Tasks end at verification. All commits happen in Task 10 after the user approves the visual result. (User rule, overrides the usual per-task commit.)
- Violet accent stays: `oklch(0.567 0.202 282.7)` / `#6B5CE7`.
- No `any`, explicit return types, named exports only, max 300 lines/file, max 100 chars/line.
- No code comments unless explaining a non-obvious _why_.
- Imports ordered: external → `@echo/*` → relative.
- Aesthetic: Vercel / Polar.sh / Linear — hairline borders, subtle shadows, generous whitespace, minimal color.
- Existing component APIs must not break (button, card, input, dropdown-menu, skeleton stay source-compatible).
- All `bunx`/`bun` commands for `packages/ui` run from `/home/francogalfre/Documentos/dev/echo/packages/ui` unless stated otherwise.
- Type-check command: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types` (turbo runs it per package).

## File Map

**packages/ui**

- Modify: `package.json` (vitest devDep + test script), `src/styles/globals.css`, `src/components/icons.tsx`
- Create: `vitest.config.ts`, `src/lib/motion.ts` (+ `.test.ts`), `src/lib/avatar.ts` (+ `.test.ts`), `src/lib/format.ts` (+ `.test.ts`)
- Create (authored): `src/components/badge.tsx`, `badge-variants.ts` (+ test), `kbd.tsx`, `separator.tsx`, `avatar.tsx`, `empty-state.tsx`, `animated-counter.tsx`
- Create (scaffolded then normalized): `src/components/dialog.tsx`, `sheet.tsx`, `tooltip.tsx`, `popover.tsx`, `tabs.tsx`, `select.tsx`

**apps/web**

- Modify: `src/app/dashboard/layout.tsx`, `components/sidebar/{index,nav-item,org-switcher,upgrade-card,user-menu}.tsx`, `components/topbar/{index,breadcrumb,command-search,notifications}.tsx`
- Create: `src/app/dashboard/components/motion-provider.tsx`
- Delete: `components/sidebar/utils.ts` (superseded by `@echo/ui/lib/avatar`)

---

### Task 1: Vitest infrastructure in packages/ui

**Files:**

- Modify: `packages/ui/package.json`
- Create: `packages/ui/vitest.config.ts`

**Interfaces:**

- Produces: `bun run test` inside `packages/ui` runs Vitest on `src/**/*.test.ts` (node environment — tests cover pure logic only).

- [ ] **Step 1: Add vitest devDependency and test script**

In `packages/ui/package.json` add to `scripts`:

```json
"test": "vitest run"
```

and to `devDependencies`:

```json
"vitest": "^3.2.0"
```

Then run: `cd /home/francogalfre/Documentos/dev/echo && bun install`

- [ ] **Step 2: Create vitest config**

`packages/ui/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 3: Verify the runner works (no tests yet)**

Run: `cd packages/ui && bun run test`
Expected: exits reporting "No test files found" (non-zero is fine at this point) — confirms vitest resolves.

---

### Task 2: Design token refinement + reduced-motion provider

**Files:**

- Modify: `packages/ui/src/styles/globals.css`
- Create: `apps/web/src/app/dashboard/components/motion-provider.tsx`
- Modify: `apps/web/src/app/dashboard/layout.tsx`

**Interfaces:**

- Produces: `bg-surface` color utility; `shadow-xs/sm/md` refined; `micro-label` utility class; radius rhythm where `rounded-lg` = 8px (controls) and `rounded-xl` = 12px (cards); `MotionProvider` client component wrapping dashboard content so ALL `motion/react` animations respect `prefers-reduced-motion`.

- [ ] **Step 1: Update `:root` tokens in globals.css**

In the `:root` block: change `--radius: 0.625rem;` to `--radius: 0.5rem;` and add after it:

```css
--surface: oklch(0.955 0 0);
```

In the `.dark` block add (after `--input`):

```css
--surface: oklch(0.155 0 0);
```

- [ ] **Step 2: Map new tokens in `@theme inline`**

Add inside the existing `@theme inline` block:

```css
--color-surface: var(--surface);

--shadow-2xs: 0 1px 2px 0 rgb(0 0 0 / 0.03);
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.04);
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05), 0 2px 8px -2px rgb(0 0 0 / 0.06);
--shadow-md: 0 2px 4px rgb(0 0 0 / 0.04), 0 8px 24px -4px rgb(0 0 0 / 0.08);
```

- [ ] **Step 3: Add micro-label utility**

At the end of `globals.css`:

```css
@utility micro-label {
  @apply text-[11px] font-medium tracking-wider text-muted-foreground uppercase;
}
```

- [ ] **Step 4: Create MotionProvider**

`apps/web/src/app/dashboard/components/motion-provider.tsx`:

```tsx
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export const MotionProvider = ({ children }: Props): React.ReactElement => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
```

- [ ] **Step 5: Wrap dashboard layout**

In `apps/web/src/app/dashboard/layout.tsx`, import `MotionProvider` from `./components/motion-provider` and wrap the current root `<div className="flex h-svh">` with it (MotionProvider as outermost element inside the return).

- [ ] **Step 6: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types`
Expected: PASS.

---

### Task 3: Motion presets

**Files:**

- Create: `packages/ui/src/lib/motion.ts`
- Test: `packages/ui/src/lib/motion.test.ts`

**Interfaces:**

- Produces: `durations` (`fast: 0.15, base: 0.2, slow: 0.3`), `easings` (`out`, `inOut`), variants `fadeIn`, `fadeInUp`, `scaleIn`, `staggerContainer(stagger?: number)`. Consumed by dialog/sheet animations, sidebar, and all later phases.

- [ ] **Step 1: Write the failing test**

`packages/ui/src/lib/motion.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { durations, easings, fadeIn, fadeInUp, scaleIn, staggerContainer } from "./motion";

describe("motion presets", () => {
  it("should define the standard duration scale", () => {
    expect(durations).toEqual({ fast: 0.15, base: 0.2, slow: 0.3 });
  });

  it("should define ease-out curve used across the app", () => {
    expect(easings.out).toEqual([0.16, 1, 0.3, 1]);
  });

  it("should hide fadeInUp with a downward offset", () => {
    expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 8 });
    expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("should scale from 97% in scaleIn", () => {
    expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.97 });
  });

  it("should stagger children with the given delay", () => {
    const container = staggerContainer(0.05);
    expect(container.visible).toMatchObject({
      transition: { staggerChildren: 0.05 },
    });
    expect(fadeIn.hidden).toEqual({ opacity: 0 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/ui && bun run test`
Expected: FAIL — cannot resolve `./motion`.

- [ ] **Step 3: Implement**

`packages/ui/src/lib/motion.ts`:

```ts
import type { Variants } from "motion/react";

export const durations = { fast: 0.15, base: 0.2, slow: 0.3 } as const;

export const easings = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easings.out } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.out },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.fast, ease: easings.out },
  },
};

export function staggerContainer(stagger = 0.04): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ui && bun run test`
Expected: PASS (5 tests).

---

### Task 4: Avatar identity utils + Avatar primitive

**Files:**

- Create: `packages/ui/src/lib/avatar.ts`
- Test: `packages/ui/src/lib/avatar.test.ts`
- Create: `packages/ui/src/components/avatar.tsx`

**Interfaces:**

- Produces: `initials(name: string): string`, `avatarHue(name: string): number` (0–359, deterministic); components `Avatar`, `AvatarImage`, `AvatarFallback` (`AvatarFallback` accepts `name?: string` — when given, renders initials tinted by deterministic hue). Consumed by Task 8 (org switcher, user menu) and phases 2–3 (feedback rows).

- [ ] **Step 1: Write the failing test**

`packages/ui/src/lib/avatar.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { avatarHue, initials } from "./avatar";

describe("initials", () => {
  it("should take first and last word initials", () => {
    expect(initials("John Doe")).toBe("JD");
    expect(initials("Priya Nair Kumar")).toBe("PK");
  });

  it("should use a single letter for one-word names", () => {
    expect(initials("Lens")).toBe("L");
  });

  it("should return ? for empty or whitespace names", () => {
    expect(initials("")).toBe("?");
    expect(initials("   ")).toBe("?");
  });
});

describe("avatarHue", () => {
  it("should be deterministic", () => {
    expect(avatarHue("John Doe")).toBe(avatarHue("John Doe"));
  });

  it("should stay within 0-359", () => {
    for (const name of ["a", "Marcus Reyes", "echo", "Tom Albrecht"]) {
      const hue = avatarHue(name);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });

  it("should differ for different names", () => {
    expect(avatarHue("John Doe")).not.toBe(avatarHue("Priya Nair"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/ui && bun run test`
Expected: FAIL — cannot resolve `./avatar`.

- [ ] **Step 3: Implement the utils**

`packages/ui/src/lib/avatar.ts`:

```ts
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  const result = `${first}${last}`.toUpperCase();
  return result === "" ? "?" : result;
}

export function avatarHue(name: string): number {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  return hash % 360;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ui && bun run test`
Expected: PASS.

- [ ] **Step 5: Create the Avatar component**

`packages/ui/src/components/avatar.tsx`:

```tsx
"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { avatarHue, initials } from "@echo/ui/lib/avatar";
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

function Avatar({ className, ...props }: AvatarPrimitive.Root.Props) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  name,
  style,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props & { name?: string }) {
  const hue = name ? avatarHue(name) : undefined;

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted",
        "text-[10px] font-semibold text-muted-foreground select-none",
        className,
      )}
      style={
        hue === undefined
          ? style
          : {
              backgroundColor: `oklch(0.6 0.14 ${hue} / 0.16)`,
              color: `oklch(0.52 0.14 ${hue})`,
              ...style,
            }
      }
      {...props}
    >
      {children ?? (name ? initials(name) : null)}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
```

Note: if `@base-ui/react/avatar` type names differ in 1.6, check
`node_modules/@base-ui/react/avatar/index.d.ts` and adapt import/prop types only —
keep the rendered classes identical.

- [ ] **Step 6: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types`
Expected: PASS.

---

### Task 5: Badge, Kbd, Separator, EmptyState (authored primitives)

**Files:**

- Create: `packages/ui/src/components/badge-variants.ts`
- Test: `packages/ui/src/components/badge-variants.test.ts`
- Create: `packages/ui/src/components/badge.tsx`, `kbd.tsx`, `separator.tsx`, `empty-state.tsx`

**Interfaces:**

- Produces: `badgeVariants({ variant })` with variants `default | accent | success | warning | destructive | info | outline`; `Badge` (`variant`, `dot?: boolean`); `Kbd`; `Separator` (`orientation`); `EmptyState` (`icon?, title, description?, action?, className?`). Consumed by Task 9 (notifications, kbd hint) and phases 2–4 (sentiment/source pills, empty tables).

- [ ] **Step 1: Write the failing test**

`packages/ui/src/components/badge-variants.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { badgeVariants } from "./badge-variants";

describe("badgeVariants", () => {
  it("should default to the neutral variant", () => {
    expect(badgeVariants({})).toContain("bg-secondary");
  });

  it("should map semantic variants to their token colors", () => {
    expect(badgeVariants({ variant: "success" })).toContain("text-success");
    expect(badgeVariants({ variant: "destructive" })).toContain("text-destructive");
    expect(badgeVariants({ variant: "accent" })).toContain("text-accent");
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });

  it("should always render as a pill", () => {
    expect(badgeVariants({ variant: "info" })).toContain("rounded-full");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/ui && bun run test`
Expected: FAIL — cannot resolve `./badge-variants`.

- [ ] **Step 3: Implement badge-variants and Badge**

`packages/ui/src/components/badge-variants.ts`:

```ts
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5",
    "text-[11px] font-medium whitespace-nowrap transition-colors",
    "[&_svg]:pointer-events-none [&_svg]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-accent/20 bg-accent/10 text-accent",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/25 bg-warning/15 text-warning-foreground",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        info: "border-info/20 bg-info/10 text-info",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
```

`packages/ui/src/components/badge.tsx`:

```tsx
import { badgeVariants, type BadgeVariantProps } from "@echo/ui/components/badge-variants";
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & BadgeVariantProps & { dot?: boolean }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export { Badge };
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ui && bun run test`
Expected: PASS.

- [ ] **Step 5: Create Kbd**

`packages/ui/src/components/kbd.tsx`:

```tsx
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-0.5",
        "rounded border border-border bg-muted px-1 font-sans text-[10px] font-medium",
        "text-muted-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
```

- [ ] **Step 6: Create Separator**

`packages/ui/src/components/separator.tsx`:

```tsx
"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "@echo/ui/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
```

- [ ] **Step 7: Create EmptyState**

`packages/ui/src/components/empty-state.tsx`:

```tsx
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="mb-1.5 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-64 text-xs/relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
```

- [ ] **Step 8: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types`
Expected: PASS.

---

### Task 6: Scaffold interactive primitives via shadcn CLI and normalize

**Files:**

- Create (via CLI): `packages/ui/src/components/dialog.tsx`, `sheet.tsx`, `tooltip.tsx`, `popover.tsx`, `tabs.tsx`, `select.tsx`
- Modify: `packages/ui/src/components/icons.tsx`, `packages/ui/package.json` (remove `lucide-react` if the CLI adds it)

**Interfaces:**

- Produces: standard shadcn base-lyra component APIs — `Dialog/DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter/DialogClose`, `Sheet/SheetTrigger/SheetContent/SheetHeader/SheetTitle/SheetDescription/SheetFooter/SheetClose`, `Tooltip/TooltipProvider/TooltipTrigger/TooltipContent`, `Popover/PopoverTrigger/PopoverContent`, `Tabs/TabsList/TabsTrigger/TabsContent` (or base-lyra's `TabsPanel` naming — keep whatever the scaffold exports), `Select/SelectTrigger/SelectValue/SelectContent/SelectItem`. Consumed by Task 9 (notifications popover) and phases 2–6.

- [ ] **Step 1: Scaffold**

Run: `cd packages/ui && bunx shadcn@latest add dialog sheet tooltip popover tabs select`

Expected: six new files in `src/components/`. If the CLI asks to install dependencies, accept.

- [ ] **Step 2: Normalize icons**

In each scaffolded file, replace any `lucide-react` imports with the `Icons` map
(`import { Icons } from "@echo/ui/components/icons";`):

- X/close icon → `Icons.x`
- ChevronDown → `Icons.chevronDown`
- Check → `Icons.check`
- ChevronUp (select scroll) → `Icons.chevronUp`

Add the missing icons to `packages/ui/src/components/icons.tsx` (imports come from
`@hugeicons/core-free-icons`, following the existing `createIcon` pattern):

```ts
x: createIcon(Cancel01Icon),
chevronUp: createIcon(ChevronUpIcon),
```

If the CLI added `lucide-react` to `packages/ui/package.json`, remove it and run `bun install`.

- [ ] **Step 3: Normalize styling**

In each scaffolded file, verify and adjust so they match the house style
(reference: `dropdown-menu.tsx`):

- Popups: `bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10` with
  `data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95` animations.
- Dialog backdrop: `bg-black/50 backdrop-blur-sm`.
- Sheet: right side default, `w-full max-w-md`, slide-in animation, `bg-card`.
- Tooltip popup: `rounded-md bg-foreground px-2 py-1 text-[11px] text-background shadow-sm`.
- Do not rename exported symbols from the scaffold.

- [ ] **Step 4: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types && cd packages/ui && bun run test`
Expected: both PASS.

---

### Task 7: Number formatting + AnimatedCounter

**Files:**

- Create: `packages/ui/src/lib/format.ts`
- Test: `packages/ui/src/lib/format.test.ts`
- Create: `packages/ui/src/components/animated-counter.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: `formatCount(value: number): string` (grouped integer, e.g. `22842 → "22,842"`); `formatCompact(value: number): string` (`22842 → "22.8K"`); `AnimatedCounter` component (`value: number; format?: (value: number) => string; className?: string`) that springs from 0 to `value` on mount, renders statically under reduced motion. Consumed by phase 2 hero metric cards.

- [ ] **Step 1: Write the failing test**

`packages/ui/src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { formatCompact, formatCount } from "./format";

describe("formatCount", () => {
  it("should group thousands", () => {
    expect(formatCount(22842)).toBe("22,842");
    expect(formatCount(0)).toBe("0");
  });

  it("should round non-integers", () => {
    expect(formatCount(1080.4)).toBe("1,080");
  });
});

describe("formatCompact", () => {
  it("should abbreviate thousands and millions", () => {
    expect(formatCompact(22842)).toBe("22.8K");
    expect(formatCompact(1200000)).toBe("1.2M");
  });

  it("should leave small numbers alone", () => {
    expect(formatCompact(842)).toBe("842");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/ui && bun run test`
Expected: FAIL — cannot resolve `./format`.

- [ ] **Step 3: Implement**

`packages/ui/src/lib/format.ts`:

```ts
const countFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ui && bun run test`
Expected: PASS.

- [ ] **Step 5: Create AnimatedCounter**

`packages/ui/src/components/animated-counter.tsx`:

```tsx
"use client";

import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

type AnimatedCounterProps = {
  value: number;
  format?: (value: number) => string;
  className?: string;
};

function AnimatedCounter({
  value,
  format = formatCount,
  className,
}: AnimatedCounterProps): React.ReactElement {
  const reduced = useReducedMotion();
  const spring = useSpring(reduced ? value : 0, { stiffness: 90, damping: 24 });
  const display = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span data-slot="animated-counter" className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}

export { AnimatedCounter };
```

- [ ] **Step 6: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types`
Expected: PASS.

---

### Task 8: Sidebar redesign

**Files:**

- Modify: `apps/web/src/app/dashboard/components/sidebar/nav-item.tsx`
- Modify: `apps/web/src/app/dashboard/components/sidebar/index.tsx`
- Modify: `apps/web/src/app/dashboard/components/sidebar/org-switcher.tsx`
- Modify: `apps/web/src/app/dashboard/components/sidebar/upgrade-card.tsx`
- Modify: `apps/web/src/app/dashboard/components/sidebar/user-menu.tsx`
- Modify: `apps/web/src/app/dashboard/layout.tsx` (sidebar width class)
- Delete: `apps/web/src/app/dashboard/components/sidebar/utils.ts`

**Interfaces:**

- Consumes: `Avatar/AvatarImage/AvatarFallback` (Task 4), `Separator` (Task 5), motion presets (Task 3).
- Produces: no API changes — `Sidebar` still default-exported member `Sidebar` from `./components/sidebar`.

- [ ] **Step 1: Rewrite nav-item.tsx with animated active indicator**

Replace the full contents of `nav-item.tsx`:

```tsx
"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { NavItem } from "./types";

type NavLinkProps = { item: NavItem; active: boolean };

const activeSpring = { type: "spring", stiffness: 500, damping: 40 } as const;

export const NavLink = ({
  item: { label, href, icon: Icon },
  active,
}: NavLinkProps): React.ReactElement => (
  <Link
    href={href as Route}
    aria-current={active ? "page" : undefined}
    className={cn(
      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.75 text-sm",
      "transition-colors duration-150",
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {active ? (
      <motion.span
        layoutId="sidebar-active"
        transition={activeSpring}
        className="absolute inset-0 rounded-lg bg-foreground/5"
      />
    ) : null}
    <Icon
      className={cn(
        "relative size-4.5 shrink-0 transition-colors duration-150",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      )}
    />
    <span className="relative">{label}</span>
  </Link>
);

type SubLink = { label: string; href: string };
type ExpandableNavLinkProps = { item: NavItem; subLinks: SubLink[] };

export const ExpandableNavLink = ({
  item: { label, icon: Icon },
  subLinks,
}: ExpandableNavLinkProps): React.ReactElement => {
  const pathname = usePathname();
  const isChildActive = subLinks.some(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.75 text-sm",
          "transition-colors duration-150",
          isChildActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-4.5 shrink-0 transition-colors duration-150",
            isChildActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        {label}
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="ml-auto"
        >
          <Icons.chevronRight className="size-3.5 text-muted-foreground/70" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="ml-4.75 flex flex-col gap-0.5 border-l border-border py-0.5 pl-2.5">
          {subLinks.map(({ label: subLabel, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href as Route}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150",
                  isActive
                    ? "text-foreground before:absolute before:-left-[11.5px] before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {subLabel}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 2: Refine sidebar/index.tsx**

Keep all logic (session/org guards, nav data). Change only the JSX shell:

```tsx
return (
  <aside className="fixed flex h-screen w-64 min-w-64 shrink-0 flex-col border-r border-border bg-sidebar px-3">
    <div className="flex h-14 items-center px-2">
      <Image src={imagotipo} alt="echo" className="h-5.5 w-auto" priority />
    </div>

    <div className="pb-2">
      <OrgSwitcher />
    </div>

    <nav aria-label="Main" className="flex flex-col gap-0.5 pt-1">
      <p className="micro-label px-2.5 pb-1.5">Workspace</p>
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} active={isActive(item.href)} />
      ))}
      <ExpandableNavLink item={collectItem} subLinks={collectSubLinks} />
      <NavLink item={settingsItem} active={isActive(settingsItem.href)} />
    </nav>

    <div className="flex-1" />

    <div className="flex flex-col gap-0.5 pb-3">
      <UpgradeCard />

      <div className="mt-2 flex flex-col gap-0.5">
        {utilityLinks.map((item) => (
          <NavLink key={item.label} item={item} active={false} />
        ))}
      </div>

      <div className="my-2 h-px bg-border" />

      {sessionPending ? (
        <Skeleton className="h-9 w-full rounded-lg" />
      ) : session ? (
        <UserMenu session={session} />
      ) : null}
    </div>
  </aside>
);
```

(Removes the divider under the logo; width 72→64; `bg-card`→`bg-sidebar`.)

In `apps/web/src/app/dashboard/layout.tsx` change `pl-72` to `pl-64`.

- [ ] **Step 3: Restyle org-switcher.tsx**

Replace the local `OrgAvatar` with the Avatar primitive and polish the trigger.
Imports to add:

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";
```

Replace `OrgAvatar` component with:

```tsx
type OrgAvatarProps = { logo?: string | null; name?: string | null };

const OrgAvatar = ({ logo, name }: OrgAvatarProps): React.ReactElement => (
  <Avatar className="size-6 rounded-md">
    {logo ? <AvatarImage src={logo} alt={`${name} logo`} /> : null}
    <AvatarFallback name={name ?? "·"} className="rounded-md text-[9px]" />
  </Avatar>
);
```

Trigger classes become:

```
"flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.75
text-sm outline-none transition-colors hover:border-border hover:bg-background
data-popup-open:border-border data-popup-open:bg-background"
```

and the trigger label drops the literal " project" suffix — show just the org name,
with the chevron becoming `Icons.chevronDown className="size-3.5 shrink-0 text-muted-foreground/70"`.
Remove the `next/image` import if no longer used. Keep the dropdown content
behavior identical.

- [ ] **Step 4: Rewrite upgrade-card.tsx (quieter)**

```tsx
import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import Link from "next/link";

export const UpgradeCard = (): React.ReactElement => (
  <Link
    href={"/dashboard/settings" as Route}
    className="group block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent/40"
  >
    <div className="flex items-center gap-2">
      <Icons.aiMagic className="size-4 text-accent" />
      <p className="text-xs font-medium text-foreground">Echo Pro</p>
    </div>
    <p className="mt-1 text-xs/relaxed text-muted-foreground">
      Unlimited feedback, AI summaries and webhooks.
    </p>
    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
      Upgrade
      <Icons.arrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </span>
  </Link>
);
```

- [ ] **Step 5: Restyle user-menu.tsx with the Avatar primitive**

Replace the local `UserAvatar` with:

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@echo/ui/components/avatar";

type AvatarSize = "sm" | "lg";

const UserAvatar = ({
  name,
  image,
  size,
}: {
  name: string;
  image?: string | null;
  size: AvatarSize;
}): React.ReactElement => (
  <Avatar className={size === "lg" ? "size-9" : "size-6"}>
    {image ? <AvatarImage src={image} alt={name} /> : null}
    <AvatarFallback name={name} className={size === "lg" ? "text-xs" : "text-[9px]"} />
  </Avatar>
);
```

Remove the `initials` import from `./utils` and the `next/image` import.
Delete `apps/web/src/app/dashboard/components/sidebar/utils.ts` after confirming
nothing else imports it: `grep -rn "sidebar/utils" apps/web/src` → expect no results.
Trigger classes align with org switcher (`rounded-lg px-2 py-1.5`).

- [ ] **Step 6: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types`
Expected: PASS.

---

### Task 9: Topbar redesign

**Files:**

- Modify: `apps/web/src/app/dashboard/components/topbar/index.tsx`
- Modify: `apps/web/src/app/dashboard/components/topbar/command-search.tsx`
- Modify: `apps/web/src/app/dashboard/components/topbar/notifications.tsx`
- Modify: `apps/web/src/app/dashboard/components/topbar/breadcrumb.tsx`

**Interfaces:**

- Consumes: `Kbd` (Task 5), `Popover/PopoverTrigger/PopoverContent` (Task 6), `EmptyState` (Task 5).
- Produces: no API changes.

- [ ] **Step 1: Tighten topbar shell**

In `topbar/index.tsx` change the header classes to:

```
"z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border
bg-sidebar px-5"
```

- [ ] **Step 2: Command search trigger with Kbd hint**

In `command-search.tsx`, import `Kbd` and replace the trigger button content:

```tsx
<button
  type="button"
  onClick={() => setOpen(true)}
  className="flex h-8 w-44 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 sm:w-60"
>
  <Icons.search className="size-3.5 shrink-0" />
  <span className="flex-1 text-left">Search…</span>
  <Kbd>⌘K</Kbd>
</button>
```

In the modal panel, replace the raw `<kbd>` ESC element with `<Kbd>ESC</Kbd>` and
the shortcut `<kbd>` inside items with `<Kbd className="bg-transparent border-0">{item.shortcut}</Kbd>`.
Panel container: `rounded-xl` and `shadow-md` (drop `shadow-2xl`), keep motion values.

- [ ] **Step 3: Notifications via Popover + EmptyState**

Rewrite `notifications.tsx`:

```tsx
"use client";

import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@echo/ui/components/popover";

export const Notifications = (): React.ReactElement => {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Notifications"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <Icons.bell className="size-4" />
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>
        <EmptyState
          icon={<Icons.bell />}
          title="You're all caught up"
          description="New notifications will show up here."
          className="py-10"
        />
      </PopoverContent>
    </Popover>
  );
};
```

(If the scaffolded Popover exports differ — e.g. trigger doesn't accept className
directly — follow the scaffold's composition, keeping these classes on the
rendered trigger element.)

- [ ] **Step 4: Breadcrumb polish**

In `breadcrumb.tsx`, class changes only — structure and logic stay exactly as
today: project span → `"truncate font-medium text-foreground"`, chevrons →
`"size-3 shrink-0 text-muted-foreground/50"`, intermediate crumbs →
`"truncate text-muted-foreground"`, last crumb → `"truncate text-foreground"`.

- [ ] **Step 5: Verify**

Run: `cd /home/francogalfre/Documentos/dev/echo && bun run check-types && cd packages/ui && bun run test`
Expected: PASS.

---

### Task 10: Full verification, visual review gate, commits

**Files:** none (verification + commits).

- [ ] **Step 1: Static checks**

Run from repo root: `bun run check-types` and `bun run lint` (if a lint task exists in turbo.json; otherwise `bunx eslint apps/web packages/ui --ext .ts,.tsx`).
Expected: PASS, no new warnings.

- [ ] **Step 2: Unit tests**

Run: `cd packages/ui && bun run test`
Expected: all tests PASS.

- [ ] **Step 3: Run the app and capture screenshots**

Start: `bun dev` (web serves on port 3001). Navigate to `/dashboard` logged in.
Capture light and dark mode screenshots of the shell (sidebar + topbar), including:
org switcher open, user menu open, notifications open, ⌘K palette open, Collect
section expanding.

- [ ] **Step 4: USER REVIEW GATE**

Present screenshots to the user. **Do not commit until explicit approval.**
Iterate on feedback within this task.

- [ ] **Step 5: Commit (after approval only)**

Atomic conventional commits, title only (no body, no co-author lines — user rule):

```bash
git add docs/superpowers/
git commit -m "docs: add phase 1 redesign spec and plan"

git add packages/ui/vitest.config.ts packages/ui/package.json bun.lock
git commit -m "chore(ui): add vitest infrastructure"

git add packages/ui/src/styles/globals.css apps/web/src/app/dashboard/components/motion-provider.tsx apps/web/src/app/dashboard/layout.tsx
git commit -m "feat(ui): refine design tokens and add reduced-motion provider"

git add packages/ui/src/lib packages/ui/src/components
git commit -m "feat(ui): add badge, avatar, dialog, sheet, tooltip, popover, tabs, select, kbd, separator, empty-state, animated-counter primitives"

git add apps/web/src/app/dashboard/components
git commit -m "feat(dashboard): redesign sidebar and topbar shell"
```

Adjust file lists to the actual changed set (`git status` first); keep commits atomic.
