"use client";

import { BannerPicker } from "../banner-picker";
import type { ConfigValues } from "../types";

type EditorBannerProps = {
  config: ConfigValues;
  orgId: string;
  hasImage: boolean;
  onSelectColor: (value: string) => void;
  onUploaded: (url: string) => void;
};

export function EditorBanner({
  config,
  orgId,
  hasImage,
  onSelectColor,
  onUploaded,
}: EditorBannerProps): React.ReactElement | null {
  if (!config.enableCoverBanner) return null;

  return (
    <div
      className="group/banner relative h-48 w-full sm:h-64"
      style={
        hasImage
          ? {
              backgroundImage: `url("${config.coverBannerUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: config.backgroundColor }
      }
    >
      <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-150 group-hover/banner:opacity-100">
        <BannerPicker
          organizationId={orgId}
          currentValue={config.backgroundColor}
          hasImage={hasImage}
          onSelectColor={onSelectColor}
          onUploaded={onUploaded}
        />
      </div>
    </div>
  );
}
