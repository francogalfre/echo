# React/Next.js Standards

- Server components by default (Next.js 15 App Router)
- Use `'use client'` at leaf level only
- Props fully typed: `interface Props { ... }`
- No logic in JSX — extract to utils
- Use `useCallback` and `useMemo` sparingly (profile first)
- No prop drilling — use Context for shared state
