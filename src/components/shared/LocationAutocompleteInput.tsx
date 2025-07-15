
"use client";

import React, { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacesWidget } from "react-google-autocomplete";
import { cn } from "@/lib/utils";

interface LocationAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LocationAutocompleteInput({
  value,
  onChange,
  placeholder = "Enter a location...",
}: LocationAutocompleteInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-places',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      onChange(place.formatted_address || place.name || "");
    },
    options: {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "in" },
    },
  });

  if (loadError) {
    return (
      <Input
        value="Map API failed to load. Please check API key and try again."
        disabled
        className="border-destructive text-destructive"
      />
    );
  }

  if (!isLoaded) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        defaultValue={value} 
        className={cn(
          "pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm",
          "pac-target-input" // The hook looks for this class
        )}
      />
    </div>
  );
}
