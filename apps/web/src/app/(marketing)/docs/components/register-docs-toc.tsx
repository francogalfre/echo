"use client";

import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";

import { useRegisterDocsToc } from "./docs-toc-context";

type RegisterDocsTocProps = {
  sections: readonly DocsTocSection[];
};

export function RegisterDocsToc({ sections }: RegisterDocsTocProps): null {
  useRegisterDocsToc(sections);
  return null;
}
