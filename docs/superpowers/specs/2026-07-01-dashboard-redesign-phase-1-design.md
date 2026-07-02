# Echo Dashboard Redesign — Phase 1: Design System Foundation + Shell

Date: 2026-07-01
Status: Approved direction, pending spec review

## Context

Full redesign of the Echo dashboard per `.claude/DASHBOARD.md`, executed in phases with
one reviewed commit per phase:

1. **Design system foundation + sidebar/shell** ← this spec
2. Dashboard Home analytics (Recharts)
3. Feedback page
4. Board
5. Page builder + widget
6. API page
7. Security review

Aesthetic target: clean, minimal, spacious — Vercel, Polar.sh, Linear, Notion, Apple.
Primary visual reference: `.claude/inspiration/design.png` (light UI, violet accent,
soft cards, generous whitespace).

## Decisions

- **Approach A**: extend `@echo/ui` with primitives built on `@base-ui/react`
  (already the package's foundation). No Radix, no second headless library.
- Keep the violet accent `#6B5CE7` (`oklch(0.567 0.202 282.7)`).
- Charts: Recharts, introduced in phase 2, styled via `--chart-*` tokens.
- New dependencies allowed when they serve the clean/minimal goal.
- Light and dark mode both first-class (next-themes already wired).

## 1. Design tokens (`packages/ui/src/styles/globals.css`)

Keep the existing token structure and violet accent. Refine:

- **Shadows**: low-elevation layered scale (`--shadow-xs/sm/md`) — hairline borders
  carry hierarchy, shadows stay subtle (Vercel-style).
- **Radius rhythm**: cards 12px, controls 8px, pills full. Single `--radius` base.
- **Surface step**: `--surface` between `--background` and `--card` for nested panels.
- **Dark mode**: borders as white-alpha (partially done), verify contrast of accent,
  semantic colors, and muted text.
- **Typography utilities**: tabular-nums for metrics; consistent scale
  (page title / section title / body / caption).

No breaking token renames — existing components keep working.

## 2. New primitives in `packages/ui/src/components/`

All Base UI underneath, styled with tokens, named exports, explicit prop types,
max 300 lines per file:

| Primitive          | Notes                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `badge`            | Pill; variants for sentiment (positive/negative/neutral) and source (api/widget/form) with dot option |
| `dialog`           | Modal, animated via motion presets                                                                    |
| `drawer`           | Side sheet (right), for AI workflows and detail views                                                 |
| `tooltip`          | Delay group support for sidebar/nav                                                                   |
| `tabs`             | Underline style                                                                                       |
| `select`           | Bordered trigger, popover list                                                                        |
| `popover`          | Base for org switcher, notifications                                                                  |
| `avatar`           | Image + initials fallback, deterministic hue from name                                                |
| `separator`        | Horizontal/vertical                                                                                   |
| `kbd`              | For ⌘K hints                                                                                          |
| `empty-state`      | Icon + title + description + action slot                                                              |
| `animated-counter` | Motion spring number, respects reduced motion                                                         |

Existing primitives (button, card, input, checkbox, dropdown-menu, skeleton,
code-block, field, label, sonner) get a consistency pass against the refined tokens —
no API changes.

## 3. Motion system (`packages/ui/src/lib/motion.ts`)

Preset module used by every animated component:

- Variants: `fadeIn`, `fadeInUp`, `scaleIn`, `staggerChildren`.
- Durations: 150/200/300ms; standard ease curves.
- All presets no-op under `prefers-reduced-motion`.
- Dialog/drawer/dropdown/popover animate exclusively through these presets.

## 4. Sidebar & shell redesign (`apps/web/src/app/dashboard/components/`)

Linear/Vercel-style, same routes, no data-layer changes:

- **Org switcher**: compact popover trigger at top (avatar + name + chevron).
- **Nav items**: icon + label, hover state, animated active indicator
  (Motion `layoutId` sliding highlight).
- **Collect section**: smooth height-animated collapse; sub-links with indent rail.
- **Section grouping**: muted uppercase micro-labels where grouping helps.
- **Upgrade card**: visually quieter, single accent element.
- **User menu**: uses new avatar primitive.
- **Topbar**: refined breadcrumb; ⌘K search as bordered input with `kbd` hint;
  notifications in the new popover.

Auth-guard logic in the sidebar stays as-is (moves are out of scope for phase 1).

## Out of scope for phase 1

Dashboard Home content, feedback page, board, page builder, widget, API page,
charts, backend/API changes.

## Verification

- `bun run check-types` and lint pass.
- Run the app, visually verify shell in light and dark mode, screenshot for review.
- No commit until user approves the result.
