
"use client";

import React, { useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LocationAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const libraries: ("places")[] = ["places"];

export function LocationAutocompleteInput({
  value,
  onChange,
  placeholder = "Enter a location...",
}: LocationAutocompleteInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
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
      console.log("Autocomplete is not loaded yet!");
    }
  };

  if (loadError) {
    return (
      <Input
        value="Map load error. Please check API key and try again."
        disabled
        className="border-destructive text-destructive"
      />
    );
  }

  if (!isLoaded) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      fields={["address_components", "formatted_address", "geometry", "icon", "name"]}
      options={{
        componentRestrictions: { country: "in" },
      }}
    >
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"
        />
      </div>
    </Autocomplete>
  );
}
