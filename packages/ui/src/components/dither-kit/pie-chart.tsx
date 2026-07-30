"use client";

import type { ReactNode } from "react";
import type { ChartConfig, Margins } from "./chart-context";
import type { BloomInput } from "./dither-paint";
import { PieCanvas } from "./pie-canvas";
import { PolarRoot } from "./polar-root";

type Row = object;

export type PieChartProps<TData extends Row> = {
  data: TData[];
  config: ChartConfig;
  children: ReactNode;
  dataKey: string;
  nameKey: string;
  innerRadius?: number;
  margins?: Partial<Margins>;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
  replayToken?: number;
  bloom?: BloomInput;
  bloomOnHover?: boolean;
  defaultSelectedDataKey?: string | null;
  onSelectionChange?: (key: string | null) => void;
};

export function PieChart<TData extends Row>(props: PieChartProps<TData>) {
  return <PolarRoot chartType="pie" Canvas={PieCanvas} {...props} />;
}
