
import { Building, Users, BookOpen, Star, CheckCircle, Award, Target } from 'lucide-react';

export default function AboutUsPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";

  const sections = [
    {
      title: "What We Do",
      icon: Building,
      points: [
        "Provide personalised home tuition and online tuition",
        "Offer tutors for all subjects and grade levels",
        "Begin with a short counselling call to understand your child’s learning needs",
        "Arrange demo classes so you can choose confidently",
        "Support parents from enquiry to class onboarding",
      ],
    },
    {
      title: "Our Tutors",
      icon: Users,
      points: [
        "B.Ed, M.Ed, and teaching certifications",
        "Graduates and postgraduates in Science, Commerce, Mathematics, English, and Humanities",
        "Early Childhood Educators trained in phonics, pre-primary teaching, and foundational learning",
        "Subject specialists with hands-on classroom experience",
        "Experienced home tutors and online tutors who teach one student at a time for better results",
      ],
      outro: "Every tutor is selected for their experience, teaching clarity, patience, communication skills, and ability to personalise lessons."
    },
    {
      title: "Who We Support",
      icon: Target,
      points: [
        "Preschool and early learners",
        "Primary and middle school students",
        "Learners who need concept clarity and structured academic support",
        "Students seeking regular home tuition in Bengaluru",
        "Students needing online tuition across India and overseas",
      ],
    },
  ];

  const whyChooseUsPoints = [
      "Fully personalised one-on-one classes",
      "Tutors with strong qualifications and proven teaching experience",
      "Smooth and easy onboarding",
      "Flexible home & online schedules",
      "Continued parent support",
  ];

  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
        <h1 className="text-4xl font-bold text-primary tracking-tight">About Us</h1>
        <p className="mt-4 max-w-3xl mx-auto text-md text-muted-foreground">
          Tutorzila connects parents with highly qualified, experienced one-on-one home tutors and online tutors for all academic needs. Our focus is simple: personalised learning that matches your child’s pace, style, and goals.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((section, index) => (
          <section key={index} className="p-6 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{ animationDelay: `${index * 100}ms`}}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                <section.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
                <ul className="space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {section.outro && <p className="mt-4 text-sm text-foreground/80 italic">{section.outro}</p>}
              </div>
            </div>
          </section>
        ))}

        <section className="p-6 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{ animationDelay: `${sections.length * 100}ms`}}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3 text-foreground">Why Parents Choose Tutorzila</h2>
                 <ul className="space-y-2">
                  {whyChooseUsPoints.map((point, i) => (
                    <li key={i} className="flex items-start text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-foreground/80 italic font-semibold">At Tutorzila, our mission is to make learning simple, enjoyable, and tailored—with the best qualified tutors for your child.</p>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}
