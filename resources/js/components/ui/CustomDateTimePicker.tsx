'use client';

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/contextHooks/useTheme";
import { Input } from "@/components/ui/Input";

interface CustomDateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  label?: string;
  disabled?: boolean;
}

export function CustomDateTimePicker({
  date,
  setDate,
  time,
  setTime,
  label,
  disabled = false,
}: CustomDateTimePickerProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium" style={{ color: theme.text }}>{label}</label>}
      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 justify-start text-left font-normal transition-all",
                !date && "text-muted-foreground"
              )}
              style={{
                background: theme.bg,
                border: `2px solid ${theme.border}`,
                color: theme.text,
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" style={{ color: theme.primary }} />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            style={{ background: theme.card, border: `1px solid ${theme.border}` }}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <div className="relative w-32">
          <Clock 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" 
            style={{ color: theme.primary }}
          />
          <Input
            type="time"
            disabled={disabled}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="pl-9 pr-2 transition-all focus:ring-2 h-10"
            style={{
              background: theme.bg,
              border: `2px solid ${theme.border}`,
              color: theme.text,
            }}
          />
        </div>
      </div>
    </div>
  );
}
