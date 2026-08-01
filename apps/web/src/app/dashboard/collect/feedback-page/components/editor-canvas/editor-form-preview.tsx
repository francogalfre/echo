"use client";

import { Icons } from "@echo/ui/components/icons";
import { Rating } from "@echo/ui/components/reui/rating";

import type { ConfigValues } from "../types";
import { AddFieldMenu, type AddableField } from "./add-field-menu";
import { FauxField } from "./faux-field";

type EditorFormPreviewProps = {
  config: ConfigValues;
  accentColor: string;
  addableFields: { field: AddableField; label: string }[];
  onRemoveField: (field: AddableField) => void;
  onAddField: (field: AddableField) => void;
};

export function EditorFormPreview({
  config,
  accentColor,
  addableFields,
  onRemoveField,
  onAddField,
}: EditorFormPreviewProps): React.ReactElement {
  return (
    <div className="mt-10 space-y-6">
      <FauxField label="Name" placeholder="Your name" />
      <FauxField label="Your feedback" placeholder="Tell us what you think…" multiline />
      {config.enableEmail && (
        <FauxField
          label="Email"
          placeholder="you@example.com"
          onRemove={() => onRemoveField("enableEmail")}
        />
      )}
      {config.enableRating && (
        <div className="group/field relative">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Rating</span>
          <Rating rating={4} accentColor={accentColor} size="lg" />
          <button
            type="button"
            onClick={() => onRemoveField("enableRating")}
            aria-label="Remove Rating"
            className="absolute top-0 right-0 rounded text-muted-foreground/50 opacity-0 transition-opacity duration-150 group-hover/field:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icons.cancelCircle className="size-4" />
          </button>
        </div>
      )}

      <AddFieldMenu fields={addableFields} onAdd={onAddField} />

      <button
        type="button"
        className="mt-1 h-11 w-full rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: accentColor }}
      >
        Send feedback
      </button>
      <p className="text-center text-xs text-muted-foreground">Powered by echo</p>
    </div>
  );
}
