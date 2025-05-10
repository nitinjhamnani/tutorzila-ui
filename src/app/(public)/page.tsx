
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, NotebookPen, ArrowRight, Book, Atom, Code, Globe, Palette, Music, Calculator, Lightbulb, SquarePen, MessageSquareQuote, UserRoundCheck, Send, SearchCheck, Users, Award, Share2, PlusCircle, Briefcase, CalendarCheck, DollarSign, TrendingUp, UsersRound, FileText, Star, Mail, UserPlus, HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import bannerImage from '@/assets/images/banner-9.png'; 
import hireTutorImage from '@/assets/images/banner-8.png';
import becomeTutorImage from '@/assets/images/banner-11.png';


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

const becomeTutorBenefits = [
  {
    icon: Users,
    title: "Reach Students",
    description: "Connect with thousands of potential students actively looking for tutors like you.",
  },
  {
    icon: Briefcase, 
    title: "Flexible Schedule & Rates",
    description: "Set your own working hours and competitive rates that suit your expertise.",
  },
  {
    icon: CalendarCheck, 
    title: "Manage Easily",
    description: "Utilize our user-friendly platform to manage your profile, bookings, and communication.",
  },
];


const popularSubjects = [
  { name: "Mathematics", icon: Calculator, hoverColor: "hover:bg-blue-600" },
  { name: "Science", icon: Atom, hoverColor: "hover:bg-green-600" },
  { name: "English", icon: Book, hoverColor: "hover:bg-red-600" },
  { name: "Coding", icon: Code, hoverColor: "hover:bg-purple-600" },
  { name: "History", icon: Globe, hoverColor: "hover:bg-yellow-600" },
  { name: "Art", icon: Palette, hoverColor: "hover:bg-pink-600" },
  { name: "Music", icon: Music, hoverColor: "hover:bg-indigo-600" },
  { name: "Physics", icon: Lightbulb, hoverColor: "hover:bg-teal-600" },
  { name: "Chemistry", icon: Atom, hoverColor: "hover:bg-cyan-600" },
  { name: "Biology", icon: Atom, hoverColor: "hover:bg-lime-600" },
  { name: "Geography", icon: Globe, hoverColor: "hover:bg-orange-600" },
  { name: "Economics", icon: Calculator, hoverColor: "hover:bg-amber-600" },
];

const counterData = [
  { icon: UsersRound, count: "1,200+", label: "Expert Tutors", color: "text-primary" },
  { icon: Users, count: "5,000+", label: "Happy Parents", color: "text-green-500" },
  { icon: FileText, count: "10,000+", label: "Tuition Needs Met", color: "text-blue-500" },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "Parent",
    quote: "Finding a qualified math tutor for my son was so easy with Tutorzila. His grades have improved significantly!",
    avatarSeed: "sarahlparent",
    stars: 5,
  },
  {
    name: "John B.",
    role: "Tutor",
    quote: "Tutorzila has connected me with wonderful students. The platform is user-friendly and helps me manage my schedule effortlessly.",
    avatarSeed: "johnbtutor",
    stars: 5,
  },
  {
    name: "Maria K.",
    role: "Parent",
    quote: "The range of tutors available is fantastic. We found a perfect match for my daughter's chemistry lessons.",
    avatarSeed: "mariakparent",
    stars: 4,
  },
   {
    name: "David P.",
    role: "Tutor",
    quote: "I appreciate the flexibility Tutorzila offers. I can set my own rates and availability, which is perfect for my lifestyle.",
    avatarSeed: "davidptutor",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-secondary text-sm">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
            >
              Find Your Perfect Learning Match with Tutorzila
            </h2>
            <p
              className="mt-4 text-foreground/80 md:text-lg animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
              style={{ animationDelay: "0.2s" }}
            >
              Connecting parents with qualified and passionate tutors. Post your tuition needs or find students to teach.
            </p>
            <div
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/search-tuitions">
                  <Search className="mr-2 h-5 w-5" /> Search Tutors
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                <Link href="/dashboard/post-requirement"> 
                  <NotebookPen className="mr-2 h-5 w-5" /> Post Your Requirement
                </Link>
              </Button>
            </div>
          </div>
           <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out" style={{ animationDelay: "0.3s" }}>
            <Image
              src={bannerImage} 
              alt="Learning Illustration"
              width={500}
              height={500}
              className="rounded-lg object-contain" 
              priority
            />
          </div>
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 sm:text-4xl animate-in fade-in duration-500 ease-out">
            Explore Popular Subjects
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto"
          >
            <CarouselContent className="-ml-1 md:-ml-2 py-4">
              {popularSubjects.map((subject, index) => (
                <CarouselItem key={subject.name} className="pl-1 md:pl-2 basis-auto">
                  <Link href={`/search-tuitions?subject=${encodeURIComponent(subject.name)}`} >
                    <Card
                      className={`group rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0.5 cursor-pointer
                                  border-b-4 active:border-b-2 border-border/50
                                  bg-secondary text-primary hover:bg-primary/10 
                                  animate-in fade-in slide-in-from-bottom-5 duration-500`}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <CardContent className="flex flex-col items-center justify-center gap-1 p-3 sm:gap-2 sm:p-4 aspect-square w-[5rem] h-[5rem] sm:w-[5.5rem] sm:h-[5.5rem]">
                        <subject.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                        <p className="text-xs sm:text-xs font-semibold text-center leading-tight">{subject.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 sm:-left-6 md:-left-10 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-8 w-8 sm:h-9 sm:w-9" />
            <CarouselNext className="absolute -right-4 sm:-right-6 md:-right-10 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-8 w-8 sm:h-9 sm:w-9" />
          </Carousel>
           <div className="text-center mt-10 animate-in fade-in duration-500 ease-out" style={{ animationDelay: `${popularSubjects.length * 0.1 + 0.2}s` }}>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 group">
              <Link href="/search-tuitions">
                View All Subjects <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

       {/* Get An Expert Tutor Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out order-1 lg:order-none">
            <Image
              src={hireTutorImage} 
              alt="Hiring a tutor illustration"
              width={550}
              height={550}
              className="mx-auto rounded-lg object-contain"
            />
          </div>
          <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Get An Expert Tutor
            </h2>
            <p className="text-foreground/80 md:text-lg">
              Finding the right tutor is easy and straightforward with Tutorzila. Follow these steps to connect with qualified educators ready to help you succeed.
            </p>
            <div className="space-y-5 mt-6">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={step.title} 
                  className="flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              asChild 
              size="lg" 
              className="mt-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-500"
              style={{ animationDelay: `${howItWorksSteps.length * 0.15 + 0.1}s` }}
            >
              <Link href="/dashboard/post-requirement">
                <Send className="mr-2 h-5 w-5" /> Request A Tutor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Become A Tutor Section */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Become A Tutor with Tutorzila
            </h2>
            <p className="text-foreground/80 md:text-lg">
              Share your knowledge, inspire students, and earn on your own schedule. Join our community of passionate educators today.
            </p>
            <div className="space-y-5 mt-6">
              {becomeTutorBenefits.map((benefit, index) => (
                <div 
                  key={benefit.title} 
                  className="flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground/90">{benefit.title}</h3>
                    <p className="text-foreground/70">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              asChild 
              size="lg" 
              className="mt-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-500"
              style={{ animationDelay: `${becomeTutorBenefits.length * 0.15 + 0.1}s` }}
            >
              <Link href="/sign-up"> 
                <PlusCircle className="mr-2 h-5 w-5" /> Start Teaching Today
              </Link>
            </Button>
          </div>
          <div className="animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <Image
              src={becomeTutorImage} 
              alt="Tutor teaching online"
              width={550}
              height={550}
              className="mx-auto rounded-lg object-contain"
              data-ai-hint="teaching online teacher"
            />
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 sm:text-4xl animate-in fade-in duration-500 ease-out">
            Our Growing Community
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {counterData.map((item, index) => (
              <Card 
                key={item.label} 
                className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 animate-in fade-in zoom-in-95 duration-500 ease-out bg-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
                <p className={`text-4xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-muted-foreground mt-1">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 sm:text-4xl animate-in fade-in duration-500 ease-out">
            What Our Users Say
          </h2>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto"
          >
            <CarouselContent className="-ml-4 py-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                  <Card 
                    className="h-full flex flex-col p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-102 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out bg-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                      <Avatar className="w-14 h-14 border-2 border-primary/50">
                        <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/100`} alt={testimonial.name} data-ai-hint="person portrait"/>
                        <AvatarFallback className="bg-primary/20 text-primary">{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <blockquote className="text-foreground/80 italic border-l-4 border-primary pl-4 py-2">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <div className="flex">
                        {Array(testimonial.stars).fill(0).map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                        {Array(5 - testimonial.stars).fill(0).map((_, i) => (
                           <Star key={i+testimonial.stars} className="w-5 h-5 text-muted-foreground/50" />
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-3 sm:-left-4 md:-left-8 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-9 w-9 sm:h-10 sm:w-10" />
            <CarouselNext className="absolute -right-3 sm:-right-4 md:-right-8 top-1/2 -translate-y-1/2 bg-card hover:bg-accent text-primary hover:text-accent-foreground border-primary/30 shadow-md h-9 w-9 sm:h-10 sm:w-10" />
          </Carousel>
        </div>
      </section>

       {/* Subscription Section */}
      <section className="w-full py-8 md:py-12 bg-secondary">
        <div className="container px-4 md:px-6 text-center">
          <div 
            className="max-w-xl mx-auto p-6 md:p-8 bg-card rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-700 ease-out"
          >
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-3">
              Stay Updated!
            </h2>
            <p className="text-foreground/80 mb-6">
              Subscribe to our newsletter for the latest updates, tips, and offers from Tutorzila.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow py-3 px-4 shadow-sm focus:ring-primary/50"
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="lg" className="shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Unlock Potential Section (Placeholder for Image Section) */}
      <section className="w-full py-8 md:py-12 bg-background/50">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <Image
              src="https://picsum.photos/seed/unlock-potential/600/400"
              alt="Happy student learning"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-ai-hint="education learning"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-right-10 duration-700 ease-out">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl text-primary">Unlock Your Potential</h3>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Tutorzila is dedicated to fostering a supportive learning environment where students can thrive and tutors can make a difference.
            </p>
            <Button asChild className="w-fit shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Link href="/privacy-policy">Learn More About Us</Link> 
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-8 md:py-12 border-t bg-secondary">
        <div className="container px-4 md:px-6 text-center animate-in fade-in duration-700 ease-out">
          <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-foreground/80 md:text-lg max-w-2xl mx-auto">
            Whether you&apos;re looking for a tutor or want to share your expertise, Tutorzila is the place to connect and grow.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Link href="/sign-up">
                 <UserPlus className="mr-2 h-5 w-5" /> Sign Up Now
              </Link>
            </Button>
             <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
              <Link href="/search-tuitions">
                 <Search className="mr-2 h-5 w-5" /> Explore Tutors
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
