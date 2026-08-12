"use client";

import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type DocsTocContextValue = {
  sections: readonly DocsTocSection[];
  setSections: (sections: readonly DocsTocSection[]) => void;
};

const DocsTocContext = createContext<DocsTocContextValue | null>(null);

export function DocsTocProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [sections, setSections] = useState<readonly DocsTocSection[]>([]);

  return (
    <DocsTocContext.Provider value={{ sections, setSections }}>
      {children}
    </DocsTocContext.Provider>
  );
}

export function useRegisterDocsToc(sections: readonly DocsTocSection[]): void {
  const context = useContext(DocsTocContext);

  useEffect(() => {
    context?.setSections(sections);
    return () => context?.setSections([]);
  }, [context, sections]);
}

export function useDocsTocSections(): readonly DocsTocSection[] {
  return useContext(DocsTocContext)?.sections ?? [];
}
