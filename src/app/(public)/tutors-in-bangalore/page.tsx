
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, BookOpen, GraduationCap, MapPin, RadioTower } from "lucide-react";

const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Hindi"];
const modes = ["Online", "Home Tuition"];
const localities = [
  "Electronic City", "Whitefield", "HSR Layout", "Koramangala", 
  "Marathahalli", "Indiranagar", "Jayanagar", "JP Nagar", 
  "BTM Layout", "Bellandur", "Malleshwaram", "Rajajinagar"
];

export default function TutorsInBangalorePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  const handleSearch = () => {
    // In a real application, you would use these state variables
    // to filter and display tutor profiles.
    console.log({
      class: selectedClass,
      subject: selectedSubject,
      mode: selectedMode,
      locality: selectedLocality,
    });
  };

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-12 animate-in fade-in duration-700 ease-out">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
            Best Tutors in Bangalore – Home & Online Tuition for All Subjects
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
            Find verified, experienced tutors in Bangalore for all subjects and classes. Tutorzila connects students with qualified home tutors and online tutors across Electronic City, Whitefield, HSR Layout, Koramangala, Marathahalli, Indiranagar, and more. Browse profiles, check experience, compare fees, and book a demo instantly.
          </p>
        </div>

        {/* Search Filters Section */}
        <Card className="max-w-4xl mx-auto shadow-xl border rounded-xl animate-in fade-in zoom-in-95 duration-500 ease-out">
          <CardHeader className="p-5 md:p-6 bg-muted/30 rounded-t-xl">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Search className="w-5 h-5 mr-2.5" />
              Find a Tutor
            </CardTitle>
            <CardDescription className="text-sm text-foreground/70">
              Use the filters below to find the perfect tutor for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="class-filter" className="text-xs font-medium text-muted-foreground flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Class
                </Label>
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                  <SelectTrigger id="class-filter" className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject-filter" className="text-xs font-medium text-muted-foreground flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Subject
                </Label>
                <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                  <SelectTrigger id="subject-filter" className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mode-filter" className="text-xs font-medium text-muted-foreground flex items-center">
                  <RadioTower className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Mode
                </Label>
                <Select onValueChange={setSelectedMode} value={selectedMode}>
                  <SelectTrigger id="mode-filter" className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="locality-filter" className="text-xs font-medium text-muted-foreground flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>Locality
                </Label>
                <Select onValueChange={setSelectedLocality} value={selectedLocality}>
                  <SelectTrigger id="locality-filter" className="bg-input border-border focus:border-primary focus:ring-primary/30 shadow-sm">
                    <SelectValue placeholder="Select Locality" />
                  </SelectTrigger>
                  <SelectContent>
                    {localities.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSearch} 
                size="lg" 
                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Tutors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
