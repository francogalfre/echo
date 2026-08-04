import { Icons } from "@echo/ui/components/icons";

export type ThemeValue = "system" | "light" | "dark";

export type ThemeOption = {
  value: ThemeValue;
  label: string;
  icon: typeof Icons.sun;
};

export const themeOptions: readonly ThemeOption[] = [
  { value: "system", label: "System", icon: Icons.monitor },
  { value: "light", label: "Light", icon: Icons.sun },
  { value: "dark", label: "Dark", icon: Icons.moon },
];
