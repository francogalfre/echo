import { cn } from "../lib/utils";

type SpiralLoaderProps = {
  size?: number;
  className?: string;
};

export const SpiralLoader = ({
  size = 40,
  className,
}: SpiralLoaderProps): React.ReactElement => (
  <div
    className={cn("relative shrink-0", className)}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  >
    <svg
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      className="absolute inset-0 animate-spin"
      style={{ animationDuration: "1.1s", animationTimingFunction: "linear" }}
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="70 30"
        className="opacity-90"
      />
    </svg>
    <svg
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      className="absolute inset-0 animate-spin"
      style={{
        animationDuration: "0.75s",
        animationTimingFunction: "linear",
        animationDirection: "reverse",
      }}
    >
      <circle
        cx="20"
        cy="20"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="40 22"
        className="opacity-60"
      />
    </svg>
    <svg
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      className="absolute inset-0 animate-spin"
      style={{ animationDuration: "0.5s", animationTimingFunction: "linear" }}
    >
      <circle
        cx="20"
        cy="20"
        r="5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="18 14"
        className="opacity-40"
      />
    </svg>
  </div>
);
