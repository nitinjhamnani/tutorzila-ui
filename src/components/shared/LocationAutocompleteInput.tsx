
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, XCircle, MapPinned } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface LocationDetails {
  name?: string; 
  address: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  googleMapsUrl?: string;
}

interface LocationAutocompleteInputProps {
  initialValue?: LocationDetails | null;
  onValueChange: (details: LocationDetails | null) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocompleteInput({
  initialValue = null,
  onValueChange,
  placeholder = "Enter a location...",
  className,
}: LocationAutocompleteInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-places',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [inputValue, setInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (initialValue) {
      setInputValue(initialValue.name || initialValue.address);
      setSelectedLocation(initialValue);
    } else {
      setInputValue("");
      setSelectedLocation(null);
    }
  }, [initialValue]);


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
    }, 300);
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);

    if (!placesService.current || !suggestion.place_id) return;
    
    const request = {
      placeId: suggestion.place_id,
      fields: ['name', 'formatted_address', 'address_components', 'url'],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        let city = '', state = '', country = '', pincode = '', area = '';
        
        place.address_components?.forEach(component => {
            const types = component.types;
            if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
              area = component.long_name;
            }
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.long_name;
            if (types.includes('country')) country = component.long_name;
            if (types.includes('postal_code')) pincode = component.long_name;
        });

        const locationDetails: LocationDetails = {
            name: place.name,
            address: place.formatted_address || suggestion.description,
            area: area || city, // Fallback to city if area is not found
            city,
            state,
            country,
            pincode,
            googleMapsUrl: place.url,
        };
        
        setSelectedLocation(locationDetails);
        onValueChange(locationDetails);
      }
    });
  };
  
  const handleClearInput = () => {
    setInputValue("");
    setSelectedLocation(null);
    onValueChange(null);
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
          value={inputValue || ''}
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
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full group/clear"
            onClick={handleClearInput}
          >
            <XCircle className="h-4 w-4 text-muted-foreground group-hover/clear:text-white" />
          </Button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-[9999] mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="cursor-pointer p-3 hover:bg-accent hover:text-accent-foreground text-sm flex items-center gap-2 group"
              onMouseDown={(e) => { 
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
            >
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-white" />
              <span>{suggestion.description}</span>
            </li>
          ))}
        </ul>
      )}
      {selectedLocation && selectedLocation.address && (
        <div className="mt-2 p-2 bg-card border rounded-md">
          {selectedLocation.googleMapsUrl ? (
            <a
              href={selectedLocation.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <MapPinned className="h-3 w-3" />
              {selectedLocation.name || selectedLocation.address}
            </a>
          ) : (
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPinned className="h-3 w-3"/>{selectedLocation.name || selectedLocation.address}</p>
          )}
          {(selectedLocation.name && selectedLocation.name !== selectedLocation.address) && (
            <p className="text-xs text-muted-foreground mt-0.5">{selectedLocation.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
