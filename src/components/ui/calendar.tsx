"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "./scroll-area"


export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  captionLayout?: "buttons" | "dropdown" | "dropdown-buttons";
  fromYear?: number;
  toYear?: number;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown-buttons", // Default to dropdown-buttons for month/year navigation
  fromYear,
  toYear,
  weekStartsOn = 0, // Default to Sunday, can be overridden (e.g., 1 for Monday)
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear()
  const defaultFromYear = fromYear || currentYear - 100;
  const defaultToYear = toYear || currentYear;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout={captionLayout}
      fromYear={defaultFromYear}
      toYear={defaultToYear}
      weekStartsOn={weekStartsOn}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: captionLayout === "dropdown-buttons" || captionLayout === "dropdown" ? "text-sm font-medium hidden" : "text-sm font-medium",
        caption_dropdowns: "flex gap-1.5 justify-center", // Added justify-center
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        vhidden: "hidden", 
        dropdown: "rdp-dropdown bg-card text-card-foreground border-border rounded-md text-xs px-1 py-0.5 focus:ring-primary focus:border-primary",
        dropdown_month: "rdp-dropdown_month",
        dropdown_year: "rdp-dropdown_year",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        Dropdown: (dropdownProps: DropdownProps) => {
          const { name, value, onChange, children } = dropdownProps;
          const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
          
          let selectItems = options.map((option) => (
            <SelectItem key={option.props.value} value={String(option.props.value)}>
              {option.props.children}
            </SelectItem>
          ));

          if (name === 'years') {
             const years = Array.from({ length: (toYear || defaultToYear) - (fromYear || defaultFromYear) + 1 }, (_, i) => (fromYear || defaultFromYear) + i);
             selectItems = years.map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
             ));
          }


          return (
            <Select
              value={String(value)}
              onValueChange={(newValue) => {
                if (onChange) {
                  const event = {
                    target: { value: newValue },
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(event);
                }
              }}
            >
              <SelectTrigger className={cn(buttonVariants({variant: "outline"}), "h-7 w-auto px-2 text-xs font-medium rdp-dropdown border-border/50 focus:ring-primary/30")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <ScrollArea className="h-full">
                 {selectItems}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
