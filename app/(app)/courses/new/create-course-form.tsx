"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCourse } from "@/actions/course";
import { initialActionState } from "@/actions/action-state";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

type SemesterOption = {
  id: string;
  label: string;
};

export function CreateCourseForm({
  semesters,
}: {
  semesters: SemesterOption[];
}) {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [credit, setCredit] = useState("");
  const [gradePoint, setGradePoint] = useState("");
  const [teacher, setTeacher] = useState("");
  const [semesterId, setSemesterId] = useState(semesters[0]?.id ?? "");

  const [state, formAction, isPending] = useActionState(
    createCourse,
    initialActionState,
  );

  if (semesters.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Create course
        </h1>
        <p className="text-sm text-muted-foreground">
          You need a semester before you can add courses.{" "}
          <Link
            href="/semesters"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Create a semester
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto w-full max-w-2xl space-y-8">
      {/* Large Notion-style title */}
      <div className="space-y-1">
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
          placeholder="Untitled course"
          rows={1}
          autoFocus
          className="w-full resize-none overflow-hidden bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/35"
        />
        {state.errors?.title?.[0] && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Properties — clean property rows */}
      <div className="space-y-4">
        {/* Semester */}
        <div className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center">
          <label className="text-sm text-muted-foreground">Semester</label>
          <div>
            <Select
              value={semesterId}
              onValueChange={(value) => setSemesterId(value as string)}
            >
              <SelectTrigger className="w-full sm:max-w-xs">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="semesterId" value={semesterId} />
            {state.errors?.semesterId?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.semesterId[0]}
              </p>
            )}
          </div>
        </div>

        {/* Course code */}
        <div className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center">
          <label htmlFor="courseCode" className="text-sm text-muted-foreground">
            Course code
          </label>
          <div>
            <Input
              id="courseCode"
              name="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g. CSE-2201"
              className="sm:max-w-xs"
              aria-invalid={!!state.errors?.courseCode}
            />
            {state.errors?.courseCode?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.courseCode[0]}
              </p>
            )}
          </div>
        </div>

        {/* Credit */}
        <div className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center">
          <label htmlFor="credit" className="text-sm text-muted-foreground">
            Credit
          </label>
          <div>
            <Input
              id="credit"
              name="credit"
              type="number"
              step="0.5"
              min="0"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="3"
              className="sm:max-w-[120px]"
              aria-invalid={!!state.errors?.credit}
            />
            {state.errors?.credit?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.credit[0]}
              </p>
            )}
          </div>
        </div>

        {/* Teacher */}
        <div className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center">
          <label htmlFor="teacher" className="text-sm text-muted-foreground">
            Teacher
          </label>
          <div>
            <Input
              id="teacher"
              name="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Optional"
              className="sm:max-w-xs"
              aria-invalid={!!state.errors?.teacher}
            />
            {state.errors?.teacher?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.teacher[0]}
              </p>
            )}
          </div>
        </div>

        {/* Grade point */}
        <div className="grid gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center">
          <label htmlFor="gradePoint" className="text-sm text-muted-foreground">
            Grade point
          </label>
          <div>
            <Input
              id="gradePoint"
              name="gradePoint"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={gradePoint}
              onChange={(e) => setGradePoint(e.target.value)}
              placeholder="Optional"
              className="sm:max-w-[120px]"
              aria-invalid={!!state.errors?.gradePoint}
            />
            {state.errors?.gradePoint?.[0] && (
              <p className="mt-1 text-xs text-destructive">
                {state.errors.gradePoint[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {state.status === "error" && state.message && !state.errors && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link href="/courses" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isPending || !title.trim() || !courseCode.trim() || !credit}
        >
          {isPending ? "Creating…" : "Create course"}
        </Button>
      </div>
    </form>
  );
}
