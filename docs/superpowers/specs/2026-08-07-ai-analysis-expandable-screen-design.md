# AI Analysis — Expandable Screen Redesign

Date: 2026-08-07
Status: Approved direction, pending spec review

## Context

The "AI Analysis" feature (`AiAnalysisButton` → `DigestModal`) currently opens as a
bottom `Drawer` (vaul) with three tabs (Issues / Themes / Mood) and a right-side
history rail. The request is to replace this with an interaction modeled on
cult-ui's `ExpandableScreen` (https://www.cult-ui.com/docs/components/expandable-screen)
and `Expandable` (https://www.cult-ui.com/docs/components/expandable) components:
the trigger button morphs into a near-fullscreen panel, the tab split is removed in
favor of one continuous analysis view, and digest history moves from a side rail
into a horizontal row of cards at the bottom of the panel — each card expanding
in place when clicked.

Both cult-ui components are built on `motion/react`, which is already a dependency
across `packages/ui` and `apps/web`. This is a **UI-only redesign**: the digest
data model (`feedback_digests` table), the `digest.get` / `digest.history` /
`digest.generate` tRPC procedures, and the `useDigest` hook's state machine
already support everything needed (cached latest digest, full history list,
regenerate with quota/upgrade handling). No backend or schema changes.

## Decisions

- **Trigger → panel, not a copy-pasted cult-ui file**: reimplement the morph
  interaction (shared `layoutId` between trigger and panel, `motion/react`)
  as a new Echo component following existing conventions (named exports, no
  default exports, `packages/ui` primitives where shared, house Tailwind
  tokens) rather than porting cult-ui's file verbatim — its version uses
  shadcn primitives and `lucide-react`, neither of which Echo uses.
- **Replaces the Drawer, not `DigestModal`'s data contract**: the new panel
  keeps the same `{ open, onOpenChange }` props so `AiAnalysisButton` barely
  changes. `useDigest()` is reused unmodified.
- **No tabs**: `DIGEST_SECTIONS` tab-switching UI is removed. All sections
  render together in one scroll: Executive Summary → Top Issues → Themes →
  Positive Highlight. (Executive Summary is newly surfaced — `DigestOutput`
  already returns it but the current tabbed UI never renders it.)
- **History becomes a card row, not a side rail**: `DigestHistoryPanel` is
  replaced by a horizontal `overflow-x-auto` row of up to-4-visible cards,
  one per past digest run (`digest.history` data, already fetched by
  `useDigest`). Clicking a card expands it in place (height animates open)
  to show that run's full analysis, styled like the main panel's content but
  scoped to the card. This does **not** touch the main panel — "latest" stays
  pinned at the top; cards represent everything in history including the
  latest run's own past regenerations.
- **Regenerate stays**: same quota/upgrade rules (`canRegenerate`,
  `isUpgradeError` → `UpgradeDialog`), moved into the panel header area
  instead of the drawer footer.
- **Sizing**: panel is `~85vw` / `~85vh` (roughly `max-w-4xl`), centered,
  rounded, with a backdrop — smaller than cult-ui's full-bleed demo per the
  request ("a little smaller").

## 1. Component structure

```
apps/web/src/app/dashboard/components/ai/
  ai-analysis-button.tsx        (existing — swaps DigestModal for AnalysisScreen)
  expandable-screen.tsx          (new — generic morph-from-trigger primitive)
  digest-modal/
    index.tsx                    (rebuilt: renders ExpandableScreen + AnalysisPanel)
    analysis-header.tsx          (new — avatar + font-pixel title + description + regenerate)
    analysis-content.tsx         (new — combined, tab-free sections; replaces digest-summary.tsx tab wrapper)
    digest-history-row.tsx       (new — replaces digest-history.tsx; horizontal expandable cards)
    digest-summary.tsx           (kept — IssuesContent/MoodContent bodies, minus tab shell)
    digest-themes.tsx            (kept — ThemesContent body, minus tab shell)
```

`expandable-screen.tsx` is a small generic primitive (context + trigger +
content, `layoutId`-based), not digest-specific, so it can be reused later by
other "expand a button into a screen" needs — but it is being built _for_ this
feature, not spec'd as a shared design system primitive beyond that.

## 2. `ExpandableScreen` primitive

- Context holds `isExpanded`, `expand()`, `collapse()`, a stable `layoutId`.
- `ExpandableScreenTrigger`: wraps `AiAnalysisButton`'s existing `Button`,
  adds `layoutId` + `onClick={expand}`.
- `ExpandableScreenContent`: `motion.div` with the same `layoutId`, rendered
  in a portal + `AnimatePresence`, backdrop `motion.div` fades in/out
  alongside it, `Escape` key and backdrop click both call `collapse()`.
- Sizing/position handled by the consumer (digest-modal passes the
  `~85vw/85vh` classes), not hardcoded in the primitive.

## 3. Panel layout (`digest-modal/index.tsx`)

```
┌─────────────────────────────────────────────────────┐
│ [Echo avatar]  Make an analysis of all your feedback │  <- font-pixel title
│                One line description of what this is  │
│                                          [Regenerate] │
├─────────────────────────────────────────────────────┤
│  (scrollable)                                         │
│  Executive Summary                                    │
│  ...                                                   │
│  Top Issues                                            │
│  ...                                                   │
│  Themes                                                │
│  ...                                                   │
│  Positive Highlight                                    │
│  ...                                                   │
├─────────────────────────────────────────────────────┤
│  Past analyses                                         │
│  [card][card][card][card] → scroll-x if more           │
└─────────────────────────────────────────────────────┘
```

- Loading (`generating`/initial `loading`): `AiThinking` + skeleton, same as
  today, shown over the content area only (header + history row stay put).
- Idle (no digest yet): `EmptyState` with "Generate Analysis" CTA in place of
  the section stack; history row hidden if there's no history yet.
- Error: `ErrorCard` with retry, same as today.

## 4. History card (`digest-history-row.tsx`)

- Collapsed: fixed-width card (`~13rem`), shows relative date, feedback
  count, and a one-line preview (first `topIssues` entry, falling back to a
  truncated `executiveSummary`).
- Expanded (click toggles, one card open at a time): the card grows in place
  — `motion` `layout` animation on height — to show that run's full
  Executive Summary / Top Issues / Themes / Positive Highlight, reusing the
  same content sub-components as the main panel. A small close affordance
  collapses it back.
- Row container: `flex gap-3 overflow-x-auto` (scroll-x only past 4 cards,
  naturally, since 4 cards fit the panel width).
- Purely presentational — reads from `useDigest()`'s existing `history`
  array; no new data fetching.

## 5. Out of scope

- No changes to `insight-panel.tsx` (per-feedback-item insight) — separate
  feature, not touched.
- No changes to quota/plan logic, `useDigest` state machine, or any tRPC
  procedure signatures.
- No new persistence — `feedback_digests` already stores every run.
