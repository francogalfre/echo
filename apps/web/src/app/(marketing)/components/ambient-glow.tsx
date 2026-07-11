export const AmbientGlow = (): React.ReactElement => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(ellipse_60%_55%_at_50%_-10%,oklch(0.567_0.202_282.7/0.18),transparent_70%)]"
    />
  );
};
