import Image from "next/image";
import type { CSSProperties } from "react";

const fade = "linear-gradient(to bottom, black 0%, black 52%, transparent 100%)";

const field: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 55% 46% at 50% -6%, color-mix(in oklch, var(--accent) 62%, transparent), transparent 62%)",
    "radial-gradient(ellipse 40% 40% at 14% -8%, color-mix(in oklch, var(--accent-soft) 52%, transparent), transparent 66%)",
    "radial-gradient(ellipse 44% 44% at 88% 2%, color-mix(in oklch, var(--accent-deep) 42%, transparent), transparent 68%)",
    "radial-gradient(ellipse 80% 30% at 50% 34%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 70%)",
  ].join(", "),
  maskImage: fade,
  WebkitMaskImage: fade,
};

const veil: CSSProperties = {
  backgroundImage:
    "radial-gradient(ellipse 40% 26% at 50% 2%, color-mix(in oklch, var(--background) 62%, transparent), transparent 74%)",
};

type HeroBackdropProps = {
  image?: string;
};

export const HeroBackdrop = ({ image }: HeroBackdropProps): React.ReactElement => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[64rem]">
      {image ? (
        <div
          className="absolute inset-0 opacity-100 brightness-80"
          style={{ maskImage: fade, WebkitMaskImage: fade }}
        >
          <Image
            src={image}
            alt="Hero background clouds in a purple sky"
            fill
            priority
            loading="eager"
            className="object-cover rounded-2xl"
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 blur-[64px]" style={field} />
          <div className="absolute inset-0" style={veil} />
        </>
      )}
    </div>
  );
};
