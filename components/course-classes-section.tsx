"use client";

import { DAY_OF_WEEK_LABELS } from "@/schema/course";
import { Plus, X } from "lucide-react";
import {
  formatClassPreview,
  formatTimeLabel,
} from "@/components/course-form-shared";
import type { ClassDraft } from "@/components/class-composer-panel";

type ClassListItem = {
  id?: string;
  day: string;
  roomNo?: string | null;
  startsAt: string;
  endsAt?: string | null;
};

type CourseClassesSectionProps = {
  classes: ClassListItem[];
  draft: ClassDraft;
  showDraftPreview: boolean;
  onAddClick: () => void;
  onItemClick: (index: number) => void;
  onRemoveClick?: (index: number) => void;
  disabled?: boolean;
  editingIndex?: number | null;
};

export function CourseClassesSection({
  classes,
  draft,
  showDraftPreview,
  onAddClick,
  onItemClick,
  onRemoveClick,
  disabled = false,
  editingIndex = null,
}: CourseClassesSectionProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-foreground">Classes</h2>

      {classes.length > 0 && (
        <ul className="space-y-0.5">
          {classes.map((c, index) => {
            const isEditing = editingIndex === index;

            const day = isEditing ? draft.day : c.day;
            const startsAt = isEditing ? draft.startsAt : c.startsAt;
            const roomNo = isEditing ? draft.roomNo : (c.roomNo ?? "");

            return (
              <li
                key={c.id ?? `${c.day}-${c.startsAt}-${index}`}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                onClick={() => onItemClick(index)}
              >
                <span className="min-w-0 flex-1 font-medium text-foreground">
                  {DAY_OF_WEEK_LABELS[day as keyof typeof DAY_OF_WEEK_LABELS] ??
                    day}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatTimeLabel(startsAt)}
                  {roomNo ? ` · ${roomNo}` : ""}
                </span>
                {onRemoveClick && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveClick(index);
                    }}
                    className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Remove class"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {showDraftPreview && (
        <div className="flex items-center gap-2 rounded bg-muted/40 px-2 py-1.5">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {formatClassPreview(draft) || (
              <span className="text-muted-foreground">New class</span>
            )}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onAddClick}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add class
      </button>
    </div>
  );
}
