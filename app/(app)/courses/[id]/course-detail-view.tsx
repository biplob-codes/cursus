"use client";

import { useActionState, useEffect, useState } from "react";
import { updateCourse, createClass } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import { DAY_OF_WEEK_LABELS, dayOfWeekEnum } from "@/schema/course";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

type ClassItem = {
  id: string;
  day: string;
  roomNo: string | null;
  startsAt: string;
  endsAt: string | null;
};

type CourseData = {
  id: string;
  title: string;
  courseCode: string;
  credit: number;
  gradePoint: number | null;
  teacher: string | null;
  semesterId: string;
  classes: ClassItem[];
};

type SemesterOption = { id: string; label: string };

const PANEL_MS = 280;
const PANEL_WIDTH = 380;

const fieldClass =
  "w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40";

const labelClass = "text-sm text-muted-foreground shrink-0 w-[120px]";

export function CourseDetailView({
  course,
  semesters,
}: {
  course: CourseData;
  semesters: SemesterOption[];
}) {
  const [title, setTitle] = useState(course.title);
  const [courseCode, setCourseCode] = useState(course.courseCode);
  const [credit, setCredit] = useState(String(course.credit));
  const [gradePoint, setGradePoint] = useState(
    course.gradePoint !== null ? String(course.gradePoint) : "",
  );
  const [teacher, setTeacher] = useState(course.teacher ?? "");
  const [semesterId, setSemesterId] = useState(course.semesterId);

  const [updateState, updateAction, isUpdating] = useActionState(
    updateCourse,
    initialActionState,
  );

  // Class panel (local — does not hide sidebar)
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);

  const [day, setDay] = useState<string>("MONDAY");
  const [roomNo, setRoomNo] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [classState, classAction, isAddingClass] = useActionState(
    createClass,
    initialActionState,
  );

  useEffect(() => {
    if (panelOpen) {
      setPanelMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setPanelEntered(false);
    const t = setTimeout(() => setPanelMounted(false), PANEL_MS);
    return () => clearTimeout(t);
  }, [panelOpen]);

  useEffect(() => {
    if (classState.status === "success") {
      setPanelOpen(false);
      setDay("MONDAY");
      setRoomNo("");
      setStartsAt("");
      setEndsAt("");
    }
  }, [classState]);

  function openPanel() {
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  return (
    <div className="relative flex min-h-full">
      {/* Main content */}
      <div
        className={cn(
          "mx-auto w-full max-w-2xl flex-1 space-y-8 transition-[padding] duration-300",
          panelEntered ? "pr-2" : "",
        )}
      >
        <form action={updateAction} className="space-y-8">
          <input type="hidden" name="id" value={course.id} />
          <input type="hidden" name="semesterId" value={semesterId} />

          {/* Title — borderless, Notion-like */}
          <div>
            <textarea
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              rows={1}
              placeholder="Untitled course"
              className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
            />
            {updateState.errors?.title?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {updateState.errors.title[0]}
              </p>
            )}
          </div>

          {/* Property rows — no borders */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={labelClass}>Semester</span>
              <Select
                value={semesterId}
                onValueChange={(v) => setSemesterId(v as string)}
              >
                <SelectTrigger className="h-auto w-auto gap-1 border-0 bg-transparent px-0 py-1 shadow-none hover:bg-transparent focus-visible:ring-0 data-[popup-open]:bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="courseCode" className={labelClass}>
                Course code
              </label>
              <input
                id="courseCode"
                name="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CSE-2201"
                className={fieldClass}
              />
            </div>
            {updateState.errors?.courseCode?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {updateState.errors.courseCode[0]}
              </p>
            )}

            <div className="flex items-center gap-3">
              <label htmlFor="credit" className={labelClass}>
                Credit
              </label>
              <input
                id="credit"
                name="credit"
                type="number"
                step="0.5"
                min="0"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="3"
                className={cn(fieldClass, "max-w-[100px]")}
              />
            </div>
            {updateState.errors?.credit?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {updateState.errors.credit[0]}
              </p>
            )}

            <div className="flex items-center gap-3">
              <label htmlFor="teacher" className={labelClass}>
                Teacher
              </label>
              <input
                id="teacher"
                name="teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Optional"
                className={fieldClass}
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="gradePoint" className={labelClass}>
                Grade point
              </label>
              <input
                id="gradePoint"
                name="gradePoint"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={gradePoint}
                onChange={(e) => setGradePoint(e.target.value)}
                placeholder="Optional"
                className={cn(fieldClass, "max-w-[100px]")}
              />
            </div>
            {updateState.errors?.gradePoint?.[0] && (
              <p className="pl-[132px] text-xs text-destructive">
                {updateState.errors.gradePoint[0]}
              </p>
            )}
          </div>

          {updateState.status === "error" &&
            updateState.message &&
            !updateState.errors && (
              <p className="text-sm text-destructive">{updateState.message}</p>
            )}
          {updateState.status === "success" && (
            <p className="text-sm text-muted-foreground">
              {updateState.message}
            </p>
          )}

          <div>
            <Button type="submit" disabled={isUpdating} size="sm">
              {isUpdating ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>

        {/* Classes section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Classes</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openPanel}
              className="gap-1.5 text-muted-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add class
            </Button>
          </div>

          {course.classes.length === 0 ? (
            <p className="px-1 text-sm text-muted-foreground">
              No classes scheduled yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {course.classes.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">
                    {DAY_OF_WEEK_LABELS[
                      c.day as keyof typeof DAY_OF_WEEK_LABELS
                    ] ?? c.day}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {c.startsAt}
                    {c.endsAt ? ` – ${c.endsAt}` : ""}
                    {c.roomNo ? ` · ${c.roomNo}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Desktop right panel — narrower, does not hide sidebar */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden border-l border-border transition-[width] duration-300 ease-out md:block",
          panelEntered ? "" : "border-transparent",
        )}
        style={{ width: panelEntered ? PANEL_WIDTH : 0 }}
      >
        <div
          className={cn(
            "flex h-full flex-col transition-transform duration-300 ease-out",
            panelEntered ? "translate-x-0" : "translate-x-full",
          )}
          style={{ width: PANEL_WIDTH }}
        >
          {panelMounted && (
            <ClassEditorPanel
              courseId={course.id}
              day={day}
              roomNo={roomNo}
              startsAt={startsAt}
              endsAt={endsAt}
              onDayChange={setDay}
              onRoomNoChange={setRoomNo}
              onStartsAtChange={setStartsAt}
              onEndsAtChange={setEndsAt}
              onClose={closePanel}
              formAction={classAction}
              state={classState}
              isPending={isAddingClass}
            />
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          panelMounted ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            panelEntered ? "opacity-100" : "opacity-0",
          )}
          onClick={closePanel}
          aria-hidden
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-background shadow-xl transition-transform duration-300 ease-out",
            panelEntered ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>
          {panelMounted && (
            <ClassEditorPanel
              courseId={course.id}
              day={day}
              roomNo={roomNo}
              startsAt={startsAt}
              endsAt={endsAt}
              onDayChange={setDay}
              onRoomNoChange={setRoomNo}
              onStartsAtChange={setStartsAt}
              onEndsAtChange={setEndsAt}
              onClose={closePanel}
              formAction={classAction}
              state={classState}
              isPending={isAddingClass}
              variant="sheet"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ClassEditorPanel({
  courseId,
  day,
  roomNo,
  startsAt,
  endsAt,
  onDayChange,
  onRoomNoChange,
  onStartsAtChange,
  onEndsAtChange,
  onClose,
  formAction,
  state,
  isPending,
  variant = "side",
}: {
  courseId: string;
  day: string;
  roomNo: string;
  startsAt: string;
  endsAt: string;
  onDayChange: (v: string) => void;
  onRoomNoChange: (v: string) => void;
  onStartsAtChange: (v: string) => void;
  onEndsAtChange: (v: string) => void;
  onClose: () => void;
  formAction: (payload: FormData) => void;
  state: typeof initialActionState;
  isPending: boolean;
  variant?: "side" | "sheet";
}) {
  return (
    <form
      action={formAction}
      className={cn("flex flex-1 flex-col", variant === "side" ? "h-full" : "")}
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="day" value={day} />

      <div
        className={cn(
          "flex items-center justify-between border-b border-border",
          variant === "side" ? "px-5 py-4" : "px-4 py-2",
        )}
      >
        <h3 className="text-sm font-semibold text-foreground">Add class</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-5 overflow-y-auto",
          variant === "side" ? "px-5 py-5" : "px-4 py-4",
        )}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Day</label>
          <Select value={day} onValueChange={(v) => onDayChange(v as string)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekEnum.options.map((value) => (
                <SelectItem key={value} value={value}>
                  {DAY_OF_WEEK_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.day?.[0] && (
            <p className="text-xs text-destructive">{state.errors.day[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="startsAt"
            className="text-sm font-medium text-foreground"
          >
            Starts at
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="time"
            value={startsAt}
            onChange={(e) => onStartsAtChange(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {state.errors?.startsAt?.[0] && (
            <p className="text-xs text-destructive">
              {state.errors.startsAt[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="endsAt"
            className="text-sm font-medium text-foreground"
          >
            Ends at
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="time"
            value={endsAt}
            onChange={(e) => onEndsAtChange(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {state.errors?.endsAt?.[0] && (
            <p className="text-xs text-destructive">{state.errors.endsAt[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="roomNo"
            className="text-sm font-medium text-foreground"
          >
            Room
          </label>
          <input
            id="roomNo"
            name="roomNo"
            value={roomNo}
            onChange={(e) => onRoomNoChange(e.target.value)}
            placeholder="Optional"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        {state.status === "error" && state.message && !state.errors && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>

      <div
        className={cn(
          "flex shrink-0 gap-2 border-t border-border",
          variant === "side" ? "px-5 py-4" : "px-4 py-3",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isPending || !startsAt}
        >
          {isPending ? "Adding…" : "Add class"}
        </Button>
      </div>
    </form>
  );
}
