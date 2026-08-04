"use client";

import { BarCanvas } from "./bar-canvas";
import { type CartesianChartProps, CartesianRoot } from "./cartesian-root";

type Row = object;

export function BarChart<TData extends Row>(props: CartesianChartProps<TData>) {
  return <CartesianRoot chartType="bar" Canvas={BarCanvas} {...props} />;
}
