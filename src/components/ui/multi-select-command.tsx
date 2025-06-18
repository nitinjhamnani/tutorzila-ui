
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Badge and XCircle are no longer used for display in trigger
import { Check } from "lucide-react"; 

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectCommandProps {
  options: Option[];
  selectedValues: string[];
  onValueChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectCommand({
  options,
  selectedValues,
  onValueChange,
  placeholder = "Select options...",
  className,
}: MultiSelectCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValueChange(newSelectedValues);
  };

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const displayValue = React.useMemo(() => {
    if (selectedValues.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    return (
      <span className="text-sm text-popover-foreground">
        {selectedValues
          .map((value) => options.find((opt) => opt.value === value)?.label || value)
          .join(", ")}
      </span>
    );
  }, [selectedValues, options, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 py-2 px-3 text-left font-normal hover:bg-background",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <span className="truncate flex-1">{displayValue}</span>
           <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search options..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value} 
                  onSelect={() => { 
                    handleSelect(option.value);
                    // setInputValue(""); // Optionally clear input on select if desired
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Helper icon
const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

    