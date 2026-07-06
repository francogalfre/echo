"use client";

import { useState } from "react";

import { cn } from "@echo/ui/lib/utils";

type Size = "sm" | "default" | "lg";

const SIZE_PX: Record<Size, number> = {
  sm: 16,
  default: 20,
  lg: 24,
};

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

type StarProps = {
  index: number;
  display: number;
  size: Size;
  accentColor: string;
  editable: boolean;
  onHover: (i: number) => void;
  onLeave: () => void;
  onClick: (i: number) => void;
};

function Star({
  index,
  display,
  size,
  accentColor,
  editable,
  onHover,
  onLeave,
  onClick,
}: StarProps): React.ReactElement {
  const filled = display >= index;
  const partial = display > index - 1 && display < index;
  const fillPct = partial ? (display - (index - 1)) * 100 : 0;
  const px = SIZE_PX[size];
  const clipId = `star-clip-${index}`;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      className={cn(
        editable &&
          "cursor-pointer transition-transform duration-150 hover:scale-125 active:scale-95",
      )}
      onClick={() => editable && onClick(index)}
      onMouseEnter={() => editable && onHover(index)}
      onMouseLeave={() => editable && onLeave()}
      aria-label={`${index} star`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={filled ? 24 : (24 * fillPct) / 100} height="24" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill="currentColor" className="text-foreground/15" />
      <path d={STAR_PATH} fill={accentColor} clipPath={`url(#${clipId})`} />
    </svg>
  );
}

type Props = {
  rating: number;
  maxRating?: number;
  size?: Size;
  accentColor?: string;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
};

export function Rating({
  rating,
  maxRating = 5,
  size = "default",
  accentColor = "#F59E0B",
  editable = false,
  onRatingChange,
  className,
}: Props): React.ReactElement {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = editable && hovered !== null ? hovered : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          index={star}
          display={display}
          size={size}
          accentColor={accentColor}
          editable={editable}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
          onClick={(i) => onRatingChange?.(i)}
        />
      ))}
    </div>
  );
}
