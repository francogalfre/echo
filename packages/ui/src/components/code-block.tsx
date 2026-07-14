"use client";

import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

type CodeTab = {
  label: string;
  code: string;
  language?: string;
};

type CodeBlockProps = {
  tabs?: CodeTab[];
  code?: string;
  language?: string;
  className?: string;
};

export function CodeBlock({
  tabs,
  code,
  language = "bash",
  className,
}: CodeBlockProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState(0);
  const preRef = useRef<HTMLPreElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measureIndicator = useCallback(() => {
    const container = tabsContainerRef.current;
    const activeEl = tabRefs.current[activeTab];

    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - containerRect.left,
      width: tabRect.width,
    });
  }, [activeTab]);

  const codeContent = useMemo<CodeTab[]>(() => {
    if (tabs && tabs.length > 0) return tabs;
    if (code) return [{ label: language, code, language }];
    return [];
  }, [tabs, code, language]);

  const currentCode = codeContent[activeTab]?.code ?? "";

  useLayoutEffect(() => {
    measureIndicator();

    const resizeObserver = new ResizeObserver(measureIndicator);
    const container = tabsContainerRef.current;
    if (container) resizeObserver.observe(container);
    for (const tab of tabRefs.current) {
      if (tab) resizeObserver.observe(tab);
    }

    return () => resizeObserver.disconnect();
  }, [measureIndicator]);

  useLayoutEffect(() => {
    const checkOverflow = (): void => {
      if (preRef.current) {
        setHasOverflow(preRef.current.scrollWidth > preRef.current.clientWidth);
      }
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (preRef.current) resizeObserver.observe(preRef.current);

    return () => resizeObserver.disconnect();
  }, [currentCode]);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (index: number): void => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  if (codeContent.length === 0) return null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-0.5 text-foreground",
        className,
      )}
    >
      {codeContent.length > 1 && (
        <div className="relative flex items-center pr-2.5">
          <div
            role="tablist"
            className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden rounded-tl-xl text-xs leading-6"
          >
            <div ref={tabsContainerRef} className="relative flex gap-1">
              {codeContent.map((tab, index) => (
                <button
                  key={tab.label}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === index}
                  onClick={() => handleTabChange(index)}
                  className={cn(
                    "relative my-1 mb-1.5 flex items-center gap-1.5 rounded-lg px-1.5 font-medium whitespace-nowrap outline-0 transition-colors duration-150 first:ml-2.5 hover:bg-muted",
                    activeTab === index ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
              {indicator && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-foreground"
                  initial={false}
                  animate={{ left: indicator.left, width: indicator.width }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <motion.button
          type="button"
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
          className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2 py-1.5 text-xs font-medium text-muted-foreground opacity-70 backdrop-blur-sm transition-[opacity,background-color,color,box-shadow] duration-150 group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label="Copy code"
        >
          <span className="relative size-3.5">
            <motion.span
              initial={false}
              animate={{
                scale: copied ? 0 : 1,
                opacity: copied ? 0 : 1,
                rotate: copied ? 90 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Icons.copy className="size-full" />
            </motion.span>
            <motion.span
              initial={false}
              animate={{
                scale: copied ? 1 : 0,
                opacity: copied ? 1 : 0,
                rotate: copied ? 0 : -90,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Icons.check className="size-full" />
            </motion.span>
          </span>
          <span>{copied ? "Copied" : "Copy"}</span>
        </motion.button>

        <pre
          ref={preRef}
          className={cn(
            "m-0 bg-background p-4 text-sm leading-relaxed",
            codeContent.length > 1 ? "rounded-b-2xl" : "rounded-2xl",
            hasOverflow ? "overflow-x-auto" : "overflow-x-hidden",
          )}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.code
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 20 : -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: direction > 0 ? -20 : 20, filter: "blur(4px)" }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="block whitespace-pre font-mono text-foreground"
            >
              {currentCode}
            </motion.code>
          </AnimatePresence>
        </pre>
      </div>
    </div>
  );
}
