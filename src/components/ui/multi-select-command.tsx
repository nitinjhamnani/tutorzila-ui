
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { XCircle, Check, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleUnselect = (value: string) => {
    onValueChange(selectedValues.filter((v) => v !== value));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 py-2 px-3 text-left font-normal hover:bg-background flex items-start gap-1 flex-wrap group",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <div className="flex gap-1.5 flex-wrap flex-grow">
            {selectedValues.length > 0 ? (
              selectedValues.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="rounded-md px-2 py-1 text-xs"
                  >
                    {option?.label || value}
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-1.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleUnselect(value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the dialog
                        handleUnselect(value);
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground text-sm py-1">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-auto transition-colors group-hover:text-primary group-hover:opacity-100" />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="w-[90vw] max-w-md p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-4 pt-4 pb-2 border-b">
          <DialogTitle>{placeholder}</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Search options..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <ScrollArea className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option.value);
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
            </ScrollArea>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
