import imagotipoDark from "@echo/assets/imagotipo/dark.png";
import imagotipoLight from "@echo/assets/imagotipo/light.png";
import { cn } from "@echo/ui/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
  theme?: "light" | "dark";
};

export const Logo = ({ className, theme }: LogoProps): React.ReactElement => {
  if (theme) {
    if (theme === "light")
      return <Image src={imagotipoDark} alt="echo" className="h-6 w-auto" priority />;
    if (theme === "dark")
      return <Image src={imagotipoLight} alt="echo" className="h-6 w-auto" priority />;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Image src={imagotipoDark} alt="echo" className="h-6 w-auto dark:hidden" priority />

      <Image
        src={imagotipoLight}
        alt="echo"
        className="hidden h-6 w-auto dark:block"
        priority
      />
    </div>
  );
};
