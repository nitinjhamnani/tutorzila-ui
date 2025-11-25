"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TutorProfile, PublicTutorProfileResponse } from "@/types";
import { TutorPublicProfile } from "@/components/tutors/TutorPublicProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserX, Star, Send, Quote, Send as SendIcon } from "lucide-react"; // Added Star, Send, Quote
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import AuthModal from "@/components/auth/AuthModal";

const transformApiResponseToTutorProfile = (
  id: string,
  data: PublicTutorProfileResponse
): TutorProfile => {
  const transformStringToArray = (str: string | null | undefined): string[] => {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.split(',').map(s => s.trim());
    }
    return [];
  };

  const teachingModes: ("Online" | "Offline (In-person)")[] = [];
  if (data.online) teachingModes.push("Online");
  if (data.offline) teachingModes.push("Offline (In-person)");


  return {
    id: id,
    name: data.tutorName,
    role: "tutor", // Assumed role
    email: "", // Not provided in this public API
    subjects: transformStringToArray(data.subjects),
    gradeLevelsTaught: transformStringToArray(data.grades),
    boardsTaught: transformStringToArray(data.boards),
    location: [data.area, data.city, data.state, data.country].filter(Boolean).join(', '),
    gender: data.gender,
    qualifications: transformStringToArray(data.qualifications),
    preferredDays: transformStringToArray(data.availabilityDays),
    preferredTimeSlots: transformStringToArray(data.availabilityTime),
    bio: data.bio,
    languages: transformStringToArray(data.languages),
    teachingMode: teachingModes,
    experience: data.experience,
    hourlyRate: String(data.hourlyRate),
    isRateNegotiable: data.rateNegotiable,
    rating: 0, 
    avatar: undefined, 
    status: "Active", // Assumed
  };
};


const fetchTutorPublicProfile = async (id: string): Promise<TutorProfile> => {
  if (!id) throw new Error("Tutor ID is required.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/auth/tutor/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Tutor not found.");
    }
    throw new Error("Failed to fetch tutor details.");
  }
  const data: PublicTutorProfileResponse = await response.json();
  return transformApiResponseToTutorProfile(id, data);
};

export default function TutorProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'signin' | 'signup'>('signin');

  const { data: tutor, isLoading, error } = useQuery({
    queryKey: ['tutorPublicProfile', id],
    queryFn: () => fetchTutorPublicProfile(id),
    enabled: !!id, // Only run the query if the id exists
    refetchOnWindowFocus: false,
  });

  const containerPadding = "container mx-auto px-4 sm:px-6 md:px-8";
  const sectionPadding = "py-10 md:py-16";

  const handleTriggerSignUp = () => {
    setAuthModalInitialView('signup');
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={`${containerPadding} py-8 md:py-12`}>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[180px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerPadding} py-12 flex justify-center items-center min-h-[calc(100vh-var(--header-height)-var(--footer-height,0px))]`}>
        <Alert variant="destructive" className="max-w-md text-center shadow-lg rounded-xl">
          <UserX className="h-10 w-10 mx-auto mb-3 text-destructive" />
          <AlertTitle className="text-xl font-semibold">Profile Not Found</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className={`${containerPadding} py-12 text-center`}>
        No tutor data available.
      </div>
    );
  }

  return (
    <>
      <div className={`${containerPadding} py-6 md:py-10 animate-in fade-in duration-500 ease-out pb-10 md:pb-12`}>
        <TutorPublicProfile tutor={tutor} />
      </div>
       {/* Call to Action */}
      <section className={`w-full text-center ${sectionPadding} bg-primary`}>
        <div className={`${containerPadding} animate-in fade-in zoom-in-95 duration-700 ease-out`}>
          <div className="inline-block p-4 bg-primary-foreground/10 rounded-full mb-5 shadow-sm">
              <Star className="w-9 h-9 text-white"/>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-white/90 md:text-lg">
            Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
          </p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" className="shadow-xl text-secondary-foreground hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-100 animate-pulse-once py-3.5 px-8 text-base" onClick={handleTriggerSignUp}>
                Sign Up Now <Send className="ml-2.5 h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
                <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
                  <Quote className="w-8 h-8 text-primary"/>
              </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">What Our Users Say</h2>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: MOCK_TESTIMONIALS.length > 2, 
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-3.5 md:-ml-4.5">
              {MOCK_TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-3.5 md:pl-4.5">
                    <div className="p-1.5 h-full">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-10 space-x-4">
              <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`w-full bg-primary text-primary-foreground ${sectionPadding}`}>
          <div className={`${containerPadding} text-center`}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Stay Updated with Tutorzila
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-white/90 md:text-lg">
                  Subscribe to our newsletter for the latest updates on tutors, special offers, and educational tips.
              </p>
              <div className="mt-8 max-w-lg mx-auto">
                  <form className="flex flex-col sm:flex-row gap-3">
                      <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="flex-grow bg-card/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white focus:text-card-foreground py-3.5 px-4 text-base h-auto"
                          aria-label="Email address"
                      />
                      <Button type="submit" variant="secondary" size="lg" className="shrink-0 text-secondary-foreground shadow-md hover:shadow-lg transition-shadow">
                          Subscribe
                      </Button>
                  </form>
              </div>
          </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
          initialForm={authModalInitialView}
        />
      )}
    </>
  );
}
