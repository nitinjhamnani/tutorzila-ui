
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  BookOpen,
  GraduationCap,
  MapPin,
  RadioTower,
  Calculator,
  Atom,
  Code,
  Globe,
  Palette,
  Music,
  Lightbulb,
  SquarePen,
  SearchCheck,
  MessageSquareQuote,
  UserRoundCheck,
  PlusCircle,
  ShieldCheck,
  Presentation,
  DollarSign,
  UsersRound,
  ClipboardEdit,
  Users,
  FlaskConical,
  Microscope,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { PostRequirementModal } from "@/components/common/modals/PostRequirementModal";
import bannerImage from "@/assets/images/banner-9.png";
import hireTutorImage from "@/assets/images/banner-8.png";
import { useAuthMock } from "@/hooks/use-auth-mock";
import AuthModal from "@/components/auth/AuthModal";

const popularSubjects = [
  { name: "Mathematics", icon: Calculator },
  { name: "Science", icon: Atom },
  { name: "English", icon: BookOpen },
  { name: "Coding", icon: Code },
  { name: "History", icon: Landmark },
  { name: "Physics", icon: Lightbulb },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Biology", icon: Microscope },
  { name: "Geography", icon: Globe },
  { name: "Economics", icon: TrendingUp },
];

const howItWorksSteps = [
  {
    icon: SquarePen,
    title: "Post Your Need",
    description: "Clearly outline the subject, grade, and specific help required.",
  },
  {
    icon: SearchCheck,
    title: "Browse Profiles",
    description: "Review detailed tutor profiles, experience, and qualifications.",
  },
  {
    icon: MessageSquareQuote,
    title: "Connect & Discuss",
    description: "Message tutors to discuss requirements and schedule a trial.",
  },
  {
    icon: UserRoundCheck,
    title: "Start Learning",
    description: "Finalize with your chosen tutor and begin personalized sessions.",
  },
];

const whyChooseUsBenefits = [
    {
        icon: ShieldCheck,
        title: "Verified Tutors",
        description: "Every tutor on our platform is thoroughly verified for their qualifications and experience.",
    },
    {
        icon: Presentation,
        title: "Demo Class",
        description: "Schedule a free demo session to ensure the tutor is the perfect fit for your learning needs.",
    },
    {
        icon: DollarSign,
        title: "Affordable Fees",
        description: "We offer competitive and transparent pricing with no hidden costs.",
    },
    {
        icon: UsersRound,
        title: "Tutor Match Guarantee",
        description: "Our system helps you find the most suitable tutor based on your specific requirements.",
    },
    {
        icon: ClipboardEdit,
        title: "Personalized Learning",
        description: "Tutors create customized learning plans to cater to each student's unique pace and style.",
    },
];


export default function TutorsInBangalorePage() {
  const [isPostRequirementModalOpen, setIsPostRequirementModalOpen] =
    useState(false);
  const [initialSubjectForModal, setInitialSubjectForModal] = useState<
    string[] | undefined
  >(undefined);
  const { user, isAuthenticated } = useAuthMock();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const handleOpenRequirementModal = (subjectName?: string) => {
    setInitialSubjectForModal(subjectName ? [subjectName] : undefined);
    setIsPostRequirementModalOpen(true);
  };
  
  const handleTriggerSignIn = () => {
    setIsPostRequirementModalOpen(false);
    setIsAuthModalOpen(true);
  };


  const sectionPadding = "py-10 md:py-16";
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <>
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${containerPadding}`}
        >
          <div className="flex flex-col justify-center space-y-5 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Best Tutors in Bangalore – Home & Online Tuition for All Subjects
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Find verified, experienced tutors in Bangalore for all subjects
              and classes. Tutorzila connects students with qualified home
              tutors and online tutors across Electronic City, Whitefield, HSR
              Layout, Koramangala, Marathahalli, Indiranagar, and more. Browse
              profiles, check experience, compare fees, and book a demo
              instantly.
            </p>
            <div className="flex flex-col gap-3.5 min-[400px]:flex-row pt-2">
              <Dialog
                open={isPostRequirementModalOpen}
                onOpenChange={setIsPostRequirementModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => handleOpenRequirementModal()}
                  >
                    <SquarePen className="mr-2.5 h-5 w-5" /> Post Your
                    Requirement
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <PostRequirementModal
                    onSuccess={() => setIsPostRequirementModalOpen(false)}
                    initialSubject={initialSubjectForModal}
                    onTriggerSignIn={handleTriggerSignIn}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out order-first lg:order-last">
            <Image
              src={bannerImage}
              alt="Learning Illustration"
              width={550}
              height={550}
              className="rounded-xl object-contain"
              priority
              data-ai-hint="education online learning"
            />
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className={`w-full ${sectionPadding} bg-background`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12 md:mb-16 animate-in fade-in duration-500 ease-out">
            <div className="inline-block p-3.5 bg-primary/10 rounded-full mb-4 shadow-sm">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Explore Popular Subjects
            </h2>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {popularSubjects.map((subject, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-3 md:pl-4"
                >
                  <div
                    className="p-1.5"
                    onClick={() => handleOpenRequirementModal(subject.name)}
                  >
                    <Card className="group bg-card hover:shadow-xl transition-all duration-300 rounded-full aspect-square flex flex-col items-center justify-center text-center p-3 md:p-2 shadow-md border hover:border-primary/50 w-[130px] h-[130px] md:w-[140px] md:h-[140px] mx-auto transform hover:scale-105 cursor-pointer">
                      <CardContent className="p-0 flex flex-col items-center justify-center gap-2 md:gap-1.5">
                        <subject.icon className="w-8 h-8 md:w-9 md:h-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-sm md:text-[13.5px] font-medium text-foreground group-hover:text-primary transition-colors truncate w-full px-1.5">
                          {subject.name}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <CarouselPrevious className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
              <CarouselNext className="static transform-none w-11 h-11 bg-card hover:bg-primary/10 text-primary border-primary/60 hover:border-primary shadow-md hover:shadow-lg transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Get An Expert Tutor Section */}
      <section className={`w-full bg-secondary ${sectionPadding}`}>
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${containerPadding}`}
        >
          <div className="flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out">
            <Image
              src={hireTutorImage}
              alt="Hiring a tutor illustration"
              width={600}
              height={600}
              className="rounded-xl object-contain"
              data-ai-hint="teacher student"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Get An Expert Tutor in Bangalore
            </h2>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Finding the right tutor is easy and straightforward with
              Tutorzila. Follow these steps to connect with qualified educators
              ready to help you succeed.
            </p>
            <div className="space-y-5 mt-4">
              {howItWorksSteps.map((step, index) => (
                <Card
                  key={index}
                  className="group bg-card p-5 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-white p-3.5 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center lg:justify-start mt-6">
              <Dialog
                open={isPostRequirementModalOpen}
                onOpenChange={setIsPostRequirementModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => handleOpenRequirementModal()}
                  >
                    <PlusCircle className="mr-2.5 h-5 w-5" /> Request A Tutor
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[625px] p-0 bg-card rounded-xl overflow-hidden"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <PostRequirementModal
                    onSuccess={() => setIsPostRequirementModalOpen(false)}
                    initialSubject={initialSubjectForModal}
                     onTriggerSignIn={handleTriggerSignIn}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`w-full bg-background ${sectionPadding}`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Why Choose Tutorzila in Bangalore</h2>
            <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
              We provide a reliable, affordable, and efficient way to connect with the best home and online tutors across the city.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {whyChooseUsBenefits.map((benefit, index) => (
              <Card key={index} className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-xs text-foreground/70 mt-2">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
    </div>
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen} 
        />
      )}
    </>
  );
}
