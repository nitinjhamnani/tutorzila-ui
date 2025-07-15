
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface LocationAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocompleteInput({
  value,
  onChange,
  placeholder = "Enter a location...",
  className,
}: LocationAutocompleteInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-places',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  const fetchSuggestions = (input: string) => {
    if (!autocompleteService.current || input.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsTyping(true);
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "in" },
      },
      (predictions, status) => {
        setIsTyping(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300); // Debounce API calls
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    const newDescription = suggestion.description;
    setInputValue(newDescription);
    onChange(newDescription);
    setShowSuggestions(false);
  };
  
  const handleClearInput = () => {
    setInputValue("");
    onChange("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (loadError) {
    return <Input value="Maps API Error" disabled className="border-destructive" />;
  }

  if (!isLoaded) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
          className={cn("pl-10", inputValue ? "pr-10" : "pr-4", className)}
          autoComplete="off"
        />
        {isTyping && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        {!isTyping && inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={handleClearInput}
          >
            <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="cursor-pointer p-3 hover:bg-accent hover:text-accent-foreground text-sm flex items-center gap-2"
              onMouseDown={(e) => { // Use onMouseDown to prevent input blur before click registers
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
            >
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{suggestion.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
