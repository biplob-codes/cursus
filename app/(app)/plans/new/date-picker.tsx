"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

export function DatePickerField({
  date,
  onDateChange,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="sr-only">Change date</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => selected && onDateChange(selected)}
        />
      </PopoverContent>
    </Popover>
  );
}
