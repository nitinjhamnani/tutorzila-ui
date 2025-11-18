
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
      "Posting a requirement is free. To start classes with a tutor, you must pay the first month's fee in advance to Tutorzila. This fee is calculated dynamically based on the number of classes, hours, grade level, and subject. Please note, this advance payment is strictly non-refundable and non-cancellable.",
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
      "No, the first month's fee, paid in advance to Tutorzila, is strictly non-refundable and non-cancellable once paid. This policy helps secure the tutor's commitment and covers our platform services.",
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
