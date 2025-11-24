
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "How will I get student assignments through Tutorzila?",
    answer:
      "Student matches are based on your subject expertise, teaching experience, grades you handle, location (for home tuition), and time availability. We only share student leads that align well with your profile.",
  },
  {
    question: "What qualifications does Tutorzila look for?",
    answer:
      "We collaborate with tutors who hold strong academic backgrounds such as B.Ed, M.Ed, graduate and postgraduate degrees, early childhood training, or proven experience in home tutoring and online tutoring.",
  },
  {
    question: "How many students will I teach?",
    answer:
      "Tutorzila focuses on one-on-one personalised tutoring. You are assigned students individually, and additional students are offered only if you request more classes.",
  },
  {
    question: "How are tutor payments processed?",
    answer:
      "Tutors are paid monthly through bank transfer after submitting class records and receiving parent confirmation. Payment timelines and expectations are clearly explained during onboarding.",
  },
  {
    question: "Can I choose which assignments to take?",
    answer:
      "Yes. You can accept assignments that match your comfort, schedule, and subject preference. You are never forced to take sessions that don’t suit your profile.",
  },
  {
    question: "What happens if a parent requests changes or adjustments?",
    answer:
      "Tutorzila handles all coordination with parents, including schedule changes or replacement requests. This allows tutors to stay focused on teaching without administrative stress.",
  },
];

export default function FAQPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-2 text-md text-muted-foreground">
          Find answers to common questions about Tutorzila.
        </p>
      </div>

      <div className="space-y-8">
        {faqItems.map((item, index) => (
          <section key={index} className="p-6 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{animationDelay: `${index * 100}ms`}}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-foreground">{item.question}</h2>
                <div className="text-sm text-foreground/80 leading-relaxed space-y-3">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
