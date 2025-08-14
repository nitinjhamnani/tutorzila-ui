
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
    question: "How does Tutorzila work for parents?",
    answer:
      "Parents can sign up for free and post their tuition requirements, specifying details like subject, grade, and schedule. We then match and assign a qualified tutor to you. You can then schedule a demo with the assigned tutor to see if they are a good fit.",
  },
  {
    question: "What are the fees for parents?",
    answer:
      "Posting a requirement is free. To start classes with a tutor, you must pay the first month's fee in advance to Tutorzila. This fee is calculated dynamically based on the number of classes, hours, grade level, and subject. Please note, this advance payment is non-refundable.",
  },
  {
    question: "How do payments work after the first month?",
    answer:
      "After the first month, you are responsible for paying the tuition fees directly to the tutor based on your mutual agreement. Tutorzila is not involved in transactions from the second month onwards.",
  },
  {
    question: "What are the requirements to become a tutor?",
    answer:
      "Tutors need to sign up and complete their profile. There is a one-time, non-refundable registration fee of ₹199 for profile verification and platform access. This fee does not guarantee tuition assignments.",
  },
  {
    question: "How do tutors get paid?",
    answer:
      "Tutorzila collects the first month's fee from the parent. We retain a 50% commission from this first month's fee. The tutor's remaining 50% share is disbursed to their registered bank account at the end of a successful first month of tuition.",
  },
  {
    question: "Who is responsible for fee collection after the first month?",
    answer:
      "From the second month onwards, the tutor is solely responsible for collecting fees directly from the parent. Tutorzila is not liable for any fee disputes or collection issues after the initial month.",
  },
  {
    question: "Is the first month's fee refundable for parents?",
    answer:
      "No, the first month's fee, paid in advance to Tutorzila, is strictly non-refundable once paid. This policy helps secure the tutor's commitment and covers our platform services.",
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
