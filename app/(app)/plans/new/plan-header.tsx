"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { format } from "date-fns";
import { getRelativeDayLabel } from "@/lib/date";
import { useState } from "react";

interface PlanHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function PlanHeader({ date, onDateChange }: PlanHeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create a plan for {getRelativeDayLabel(date)}{" "}
        <span className="font-normal text-muted-foreground">
          ({format(date, "d MMMM yyyy")})
        </span>
      </h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            type="button"
            variant="ghost"
            className="shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground"
            style={{ width: 40, height: 40 }}
          >
            <CalendarIcon style={{ width: 22, height: 22 }} />
            <span className="sr-only">Change date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              if (!selected) return;
              onDateChange(selected);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
