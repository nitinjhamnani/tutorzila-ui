
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "How do I sign up as a parent?",
    answer:
      "Click on the 'Sign Up' button in the header. Select the 'Parent' role during registration, fill in your details, and you're all set to find tutors.",
  },
  {
    question: "How do I sign up as a tutor?",
    answer:
      "Click on the 'Sign Up' button. Choose the 'Tutor' role, complete your profile with your expertise, qualifications, and availability to start connecting with students.",
  },
  {
    question: "How can I find a tutor?",
    answer:
      "Once logged in as a parent, you can either post your tuition requirement for tutors to find you, or you can browse tutor profiles using our search and filter options.",
  },
  {
    question: "How do I post a tuition requirement?",
    answer:
      "After signing up as a parent, navigate to your dashboard and click on 'Post Requirement'. Fill in the details about the subject, grade level, and preferred schedule.",
  },
  {
    question: "What are the charges for using Tutorzila?",
    answer:
      "Signing up and browsing on Tutorzila is free for both parents and tutors. Tutors set their own hourly rates, which are displayed on their profiles. We may introduce premium features in the future.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Currently, payment arrangements are made directly between the parent and the tutor. Tutorzila does not process payments at this stage.",
  },
  {
    question: "Can I teach multiple subjects?",
    answer:
      "Yes, as a tutor, you can list all the subjects you are proficient in teaching on your profile.",
  },
];

export default function FAQPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <Card className="bg-card border rounded-lg shadow-md">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription className="text-md text-muted-foreground mt-1">
            Find answers to common questions about Tutorzila.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 last:border-b-0 bg-background/50 rounded-md px-4 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left hover:no-underline text-base font-semibold text-foreground/90">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/80 leading-relaxed pt-2 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

    