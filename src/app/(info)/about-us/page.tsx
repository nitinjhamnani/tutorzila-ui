import {
  Users,
  CheckCircle,
  Award,
  Target,
  GraduationCap,
  Sparkles,
  PhoneCall,
  UserCheck,
  BookOpen,
  Star,
  School,
  ClipboardList,
} from 'lucide-react';
import Image from 'next/image';
import bannerImage from '@/assets/images/banner-9.png';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AboutUsPage() {
  const containerPadding = 'container mx-auto px-6 sm:px-8 md:px-10 lg:px-12';

  const whatWeDoPoints = [
    {
      title: 'Personalised Tuition',
      description: 'Provide personalised home tuition and online tuition.',
      icon: GraduationCap,
    },
    {
      title: 'All Subjects & Levels',
      description: 'Offer tutors for all subjects and grade levels.',
      icon: BookOpen,
    },
    {
      title: 'Needs Analysis',
      description:
        'Begin with a short counselling call to understand your child’s learning needs.',
      icon: PhoneCall,
    },
    {
      title: 'Demo Classes',
      description: 'Arrange demo classes so you can choose confidently.',
      icon: Sparkles,
    },
    {
      title: 'Full Support',
      description: 'Support parents from enquiry to class onboarding.',
      icon: UserCheck,
    },
  ];

  const whoWeSupportPoints = [
    {
      title: 'Preschool & Early Learners',
      icon: Sparkles,
    },
    {
      title: 'Primary & Middle School',
      icon: School,
    },
    {
      title: 'Academic Support Seekers',
      icon: BookOpen,
    },
    {
      title: 'Local Home Tuition',
      icon: Users,
    },
    {
      title: 'Global Online Tuition',
      icon: ClipboardList,
    },
  ];

  const whyChooseUsPoints = [
    'Fully personalised one-on-one classes',
    'Tutors with strong qualifications and proven teaching experience',
    'Smooth and easy onboarding',
    'Flexible home & online schedules',
    'Continued parent support',
  ];

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className={`w-full ${containerPadding} py-12 md:py-20`}>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left-10 duration-700 ease-out">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              About Tutorzila
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-lg">
              Tutorzila connects parents with highly qualified, experienced
              one-on-one home tutors and online tutors for all academic needs.
              Our focus is simple: personalised learning that matches your
              child’s pace, style, and goals.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center animate-in fade-in zoom-in-90 duration-700 ease-out">
            <Image
              src={bannerImage}
              alt="About Us Illustration"
              width={500}
              height={500}
              className="rounded-xl object-contain"
              data-ai-hint="education learning teamwork"
            />
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className={`w-full bg-background ${containerPadding} py-12 md:py-16`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
            What We Do
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-foreground/80 md:text-lg">
            We provide a complete, end-to-end service to ensure your child gets the best learning experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {whatWeDoPoints.map((item, index) => (
            <Card
              key={index}
              className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                  {item.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Who We Support Section - REDESIGNED */}
      <section className={`w-full bg-secondary ${containerPadding} py-12 md:py-16`}>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Who We Support</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {whoWeSupportPoints.map((item, index) => (
            <Card
                key={index}
                className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]"
            >
                <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                    {item.title}
                </h3>
                </div>
            </Card>
            ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`w-full bg-background py-12 md:py-20`}>
        <div className={`${containerPadding}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">
              Why Parents Choose Tutorzila
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-foreground/80 md:text-lg">
              We're dedicated to making learning simple, enjoyable, and
              perfectly tailored for your child.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {whyChooseUsPoints.map((point, index) => (
              <Card
                key={index}
                className="group bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border hover:border-primary/50 transform hover:scale-[1.05]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors shadow-sm mb-4">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                    {point}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
