"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@echo/ui/components/tooltip";
import { cn } from "@echo/ui/lib/utils";

import { ColorPicker } from "./color-picker";

type EditorDockProps = {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  bannerEnabled: boolean;
  onToggleBanner: () => void;
  feedbackPanelEnabled: boolean;
  onToggleFeedbackPanel: () => void;
  isPublished: boolean;
  isSaving: boolean;
  isLoading: boolean;
  onCopyLink: () => void;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
};

type DockIconButtonProps = {
  active?: boolean;
  onClick: () => void;
  icon: (props: { className?: string }) => React.ReactElement;
  label: string;
};

const DockIconButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}: DockIconButtonProps): React.ReactElement => (
  <Tooltip>
    <TooltipTrigger
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg outline-none transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

const DockDivider = (): React.ReactElement => <div className="h-6 w-px bg-border" />;

export const EditorDock = ({
  accentColor,
  onAccentColorChange,
  bannerEnabled,
  onToggleBanner,
  feedbackPanelEnabled,
  onToggleFeedbackPanel,
  isPublished,
  isSaving,
  isLoading,
  onCopyLink,
  onPreview,
  onSave,
  onPublish,
}: EditorDockProps): React.ReactElement => (
  <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
    <TooltipProvider delay={200}>
      <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-lg ring-1 ring-foreground/10 backdrop-blur-sm">
        <ColorPicker value={accentColor} onChange={onAccentColorChange} />

        <DockDivider />

        <DockIconButton
          active={bannerEnabled}
          onClick={onToggleBanner}
          icon={Icons.imageAdd}
          label="Toggle banner"
        />
        <DockIconButton
          active={feedbackPanelEnabled}
          onClick={onToggleFeedbackPanel}
          icon={Icons.message}
          label="Show recent feedback"
        />

        <DockDivider />

        {isPublished && (
          <>
            <DockIconButton onClick={onCopyLink} icon={Icons.copy} label="Copy link" />
            <DockIconButton
              onClick={onPreview}
              icon={Icons.externalLink}
              label="Open preview"
            />
          </>
        )}

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="secondary"
                size="sm"
                onClick={onSave}
                disabled={isSaving || isLoading}
              />
            }
          >
            {isSaving && <Icons.loading className="size-3.5 animate-spin" />}
            Save
          </TooltipTrigger>
          <TooltipContent>Save changes</TooltipContent>
        </Tooltip>

        {!isPublished && (
          <Button size="sm" onClick={onPublish} disabled={isSaving || isLoading}>
            {isSaving && <Icons.loading className="size-3.5 animate-spin" />}
            Publish
          </Button>
        )}
      </div>
    </TooltipProvider>
  </div>
);
