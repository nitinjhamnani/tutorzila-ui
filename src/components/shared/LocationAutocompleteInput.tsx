
"use client";

import React, { useState, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      onChange(place.formatted_address || place.name || "");
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

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
       <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "in" },
          types: ["geocode", "establishment"]
        }}
       >
        <Input
          type="text"
          placeholder={placeholder}
          defaultValue={value} 
          className={cn(
            "pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"
          )}
        />
       </Autocomplete>
    </div>
  );
}
