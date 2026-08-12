"use client";

import { DocsToc } from "@echo/ui/components/docs/docs-toc";

import { useDocsTocSections } from "./docs-toc-context";

export function DocsTocSlot(): React.ReactElement | null {
  const sections = useDocsTocSections();
  if (sections.length === 0) return null;

  return (
    <DocsToc
      sections={sections}
      layoutId="docs-toc-active"
      showMobileRow={false}
      className="hidden docs-toc-rail"
    />
  );
}
