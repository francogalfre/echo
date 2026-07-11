import imagotipoDark from "@echo/assets/imagotipo/dark.png";
import imagotipoLight from "@echo/assets/imagotipo/light.png";
import { cn } from "@echo/ui/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps): React.ReactElement => {
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
