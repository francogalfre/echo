import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import {
  Home01Icon,
  Message01Icon,
  Radar02Icon,
  HelpCircleIcon,
  Book01Icon,
  SlidersHorizontalIcon,
  Settings01Icon,
  Logout01Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  AddCircleIcon,
  CheckIcon,
  Loading03Icon,
  ImageAdd01Icon,
  CircleCheckIcon,
  AlertCircleIcon,
  CancelCircleIcon,
  InformationCircleIcon,
  TriangleIcon,
  Copy01Icon,
  ExternalLinkIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowReloadHorizontalIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons";

type IconProps = Omit<HugeiconsIconProps, "icon">;

function createIcon(icon: HugeiconsIconProps["icon"]) {
  const Component = (props: IconProps) => <HugeiconsIcon icon={icon} {...props} />;
  Component.displayName = "Icon";

  return Component;
}

export const Icons = {
  home: createIcon(Home01Icon),
  message: createIcon(Message01Icon),
  radar: createIcon(Radar02Icon),
  help: createIcon(HelpCircleIcon),
  book: createIcon(Book01Icon),
  slidersHorizontal: createIcon(SlidersHorizontalIcon),
  settings: createIcon(Settings01Icon),
  logout: createIcon(Logout01Icon),
  chevronDown: createIcon(ChevronDownIcon),
  chevronRight: createIcon(ChevronRightIcon),
  circlePlus: createIcon(AddCircleIcon),
  check: createIcon(CheckIcon),
  loading: createIcon(Loading03Icon),
  imageAdd: createIcon(ImageAdd01Icon),
  circleCheck: createIcon(CircleCheckIcon),
  alertCircle: createIcon(AlertCircleIcon),
  cancelCircle: createIcon(CancelCircleIcon),
  info: createIcon(InformationCircleIcon),
  triangleAlert: createIcon(TriangleIcon),
  copy: createIcon(Copy01Icon),
  externalLink: createIcon(ExternalLinkIcon),
  arrowLeft: createIcon(ArrowLeft01Icon),
  arrowRight: createIcon(ArrowRight01Icon),
  refresh: createIcon(ArrowReloadHorizontalIcon),
  lock: createIcon(LockIcon),
  eye: createIcon(EyeIcon),
  eyeOff: createIcon(EyeOffIcon),
};
