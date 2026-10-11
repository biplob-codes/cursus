"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { fieldInput, labelClass } from "@/components/course-form-shared";

type SemesterOption = {
  id: string;
  label: string;
};

type CoursePropertyFieldsProps = {
  semesterId: string;
  onSemesterChange: (id: string) => void;
  semesters: SemesterOption[];
  courseCode: string;
  onCourseCodeChange: (value: string) => void;
  credit: string;
  onCreditChange: (value: string) => void;
  teacher: string;
  onTeacherChange: (value: string) => void;
  gradePoint: string;
  onGradePointChange: (value: string) => void;
  errors?: {
    semesterId?: string[];
    courseCode?: string[];
    credit?: string[];
    gradePoint?: string[];
  };
  /** When true, also render the hidden semesterId input (needed for create form) */
  includeHiddenSemester?: boolean;
};

export function CoursePropertyFields({
  semesterId,
  onSemesterChange,
  semesters,
  courseCode,
  onCourseCodeChange,
  credit,
  onCreditChange,
  teacher,
  onTeacherChange,
  gradePoint,
  onGradePointChange,
  errors,
  includeHiddenSemester = false,
}: CoursePropertyFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Semester */}
      <div className="flex items-center gap-3">
        <span className={labelClass}>Semester</span>
        <Select
          value={semesterId}
          onValueChange={(v) => onSemesterChange(v as string)}
          items={semesters.map((s) => ({
            value: s.id,
            label: s.label,
          }))}
        >
          <SelectTrigger
            className={cn(
              "h-auto w-auto min-w-[140px] gap-1 border-0 bg-transparent px-0 py-1 text-base shadow-none",
              "hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent",
              "data-[popup-open]:bg-transparent",
            )}
          >
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent className="min-w-[180px] py-1">
            {semesters.map((s) => (
              <SelectItem
                key={s.id}
                value={s.id}
                className="py-1.5 pl-2 pr-8 text-sm"
              >
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {includeHiddenSemester && (
          <input type="hidden" name="semesterId" value={semesterId} />
        )}
      </div>
      {errors?.semesterId?.[0] && (
        <p className="pl-[132px] text-xs text-destructive">
          {errors.semesterId[0]}
        </p>
      )}

      {/* Course code */}
      <div className="flex items-center gap-3">
        <label htmlFor="courseCode" className={labelClass}>
          Course code
        </label>
        <input
          id="courseCode"
          name="courseCode"
          value={courseCode}
          onChange={(e) => onCourseCodeChange(e.target.value)}
          placeholder="e.g. CSE 2201"
          autoComplete="off"
          className={fieldInput}
        />
      </div>
      {errors?.courseCode?.[0] && (
        <p className="pl-[132px] text-xs text-destructive">
          {errors.courseCode[0]}
        </p>
      )}

      {/* Credit */}
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
          onChange={(e) => onCreditChange(e.target.value)}
          onBlur={() => {
            const n = parseFloat(credit);
            if (!Number.isNaN(n)) onCreditChange(n.toFixed(1));
          }}
          placeholder="3.0"
          autoComplete="off"
          className={cn(fieldInput, "max-w-[120px] tabular-nums")}
        />
      </div>
      {errors?.credit?.[0] && (
        <p className="pl-[132px] text-xs text-destructive">
          {errors.credit[0]}
        </p>
      )}

      {/* Teacher */}
      <div className="flex items-center gap-3">
        <label htmlFor="teacher" className={labelClass}>
          Teacher
        </label>
        <input
          id="teacher"
          name="teacher"
          value={teacher}
          onChange={(e) => onTeacherChange(e.target.value)}
          placeholder="Dr. Rahman"
          autoComplete="off"
          className={fieldInput}
        />
      </div>

      {/* Grade point */}
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
          onChange={(e) => onGradePointChange(e.target.value)}
          placeholder="e.g. 3.75"
          autoComplete="off"
          className={cn(fieldInput, "max-w-[120px] tabular-nums")}
        />
      </div>
      {errors?.gradePoint?.[0] && (
        <p className="pl-[132px] text-xs text-destructive">
          {errors.gradePoint[0]}
        </p>
      )}
    </div>
  );
}
