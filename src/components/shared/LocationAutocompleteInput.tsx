
"use client";

import React from "react";
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

  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = React.useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
  }, []);

  const onUnmount = React.useCallback(() => {
    autocompleteRef.current = null;
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      onChange(place.formatted_address || place.name || "");
    } else {
      console.error("Autocomplete instance not available");
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
        onUnmount={onUnmount}
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
