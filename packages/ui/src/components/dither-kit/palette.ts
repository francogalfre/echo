export type Rgb = [number, number, number];

export type DitherColor =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "orange"
  | "red"
  | "grey"
  | "accentDeep"
  | "accent"
  | "accentSoft"
  | "accentMuted";

export type Seed = { fill: Rgb; line: Rgb; star: Rgb };

// Each seed: the area-fill hue, the bright series line, and the star sparkle.
export const PALETTE: Record<DitherColor, Seed> = {
  green: { fill: [40, 210, 110], line: [150, 255, 180], star: [200, 255, 220] },
  blue: { fill: [53, 143, 243], line: [150, 200, 255], star: [205, 228, 255] },
  purple: {
    fill: [150, 110, 255],
    line: [200, 175, 255],
    star: [225, 210, 255],
  },
  pink: { fill: [240, 90, 190], line: [255, 170, 220], star: [255, 205, 235] },
  orange: {
    fill: [255, 150, 50],
    line: [255, 195, 130],
    star: [255, 220, 175],
  },
  red: { fill: [240, 70, 70], line: [255, 150, 140], star: [255, 195, 185] },
  // No-data: a muted grey so empty metrics read as "nothing here".
  grey: { fill: [92, 92, 100], line: [140, 140, 150], star: [165, 165, 175] },
  // Tonal ramp of the brand accent violet (#6B5CE7) — deep to muted, same hue
  // throughout, so multi-series charts stay within the accent family instead
  // of reaching for unrelated hues.
  accentDeep: { fill: [74, 60, 168], line: [130, 112, 220], star: [170, 155, 235] },
  accent: { fill: [107, 92, 231], line: [158, 146, 245], star: [195, 186, 250] },
  accentSoft: { fill: [150, 138, 240], line: [190, 182, 250], star: [216, 210, 253] },
  accentMuted: { fill: [193, 186, 224], line: [214, 209, 235], star: [230, 226, 243] },
};

export const rgb = ([r, g, b]: Rgb, k = 1, a = 1) =>
  `rgba(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)},${a})`;

export const seedOfColor = (color: DitherColor): Seed => PALETTE[color];
