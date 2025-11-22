
"use client";

import { FileText, GraduationCap, Ban, ShieldAlert, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TutorTermsPage() {
  const sections = [
    {
      icon: GraduationCap,
      title: "For Tutors",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">3.1. Registration Fee</h3>
            <p>
              To join Tutorzila as a tutor, you are required to pay a one-time, non-refundable registration fee of
              ₹199. This fee covers the cost of profile verification and platform access. Payment of this fee
              does not guarantee placement or a minimum number of tuition.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">3.2. First Month’s Fee & Commission</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Tutorzila shall collect the entire first month’s tuition fee from the Parent in advance.</li>
              <li>The fee amount communicated to the Parent shall be considered the total payable tuition
              fee. Tutorzila’s internal facilitation charge will be applied to this amount as per its policy.
              The remaining amount, referred to as the Tutor’s payable fee, will form the basis of the
              Tutor’s payout.</li>
              <li>For the first month, 50% of the Tutor’s payable fee will be released to the Tutor at the
              end of the month, subject to successful completion of scheduled classes.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">3.3. From Second Month Onwards</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>From the second month onward, Parents shall continue to make the tuition fee payment
              in advance to Tutorzila.</li>
              <li>Tutorzila shall disburse the Tutor’s payable fee (i.e., the tuition fee amount after
              deduction of the internal facilitation charge) at the end of each monthly cycle, based on
              successful class completion.</li>
              <li>Tutors are strictly prohibited from collecting tuition fees directly from Parents. All financial
              transactions must be processed only through Tutorzila.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">3.4. Tutor Engagement Status</h3>
            <p>
             Tutors associated with Tutorzila are not employees of Zilics Ventures Private Limited.
             They operate as independent, self-employed service providers, responsible for their own taxes,
             legal compliance, and professional conduct.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">3.5. One-on-One Teaching Requirement</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Tutorzila offers personalized one-on-one tutoring to students.</li>
              <li>Tutors must conduct all classes individually (1:1) and are not permitted to convert
              Tutorial-referred students into group classes, batches, or combined sessions with any
              other learner.</li>
              <li>Any attempt to add extra students, merge sessions, or turn the class into a group without
              written approval from Tutorzila will be treated as a serious violation and may result in
              account suspension, termination, and withholding of pending payouts.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      icon: Ban,
      title: "No Bypass Rule",
      content: (
        <>
            <p>
              Parents and Tutors must not bypass Tutorzila for direct payment or independent class
              arrangements.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Any attempt to bypass the platform will lead to immediate suspension or termination of
              the account.</li>
              <li>Tutorzila reserves the right to withhold pending payments in such cases.</li>
            </ul>
        </>
      ),
    },
    {
        icon: ShieldAlert,
        title: "Limitation of Liability",
        content: (
            <>
            <p>
              Tutorzila is a facilitator platform. We are not responsible for the conduct, behaviour, or
              teaching quality of Tutors or Parents.
            </p>
             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>No background verification is conducted by Tutorzila; Parents must ensure their
                presence during offline classes for safety.</li>
                <li>Any disputes unrelated to academics—such as behavioural issues or personal
                disagreements—must be resolved directly between the Parent and Tutor. Tutorzila holds
                no responsibility in such matters.</li>
            </ul>
            </>
        )
    },
    {
        icon: Landmark,
        title: "Governing Law & Jurisdiction",
        content: (
            <p>
              These Terms are governed by the laws of India. You agree to submit to the exclusive jurisdiction
              of the courts located in Delhi.
            </p>
        )
    }
  ];

  return (
    <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
            <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
                <CardHeader className="p-0 flex flex-row items-center justify-between gap-3">
                    <div className="flex-grow min-w-0">
                        <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <FileText className="w-5 h-5 mr-2.5" />
                        Tutor Terms & Conditions
                        </CardTitle>
                        <CardDescription className="text-sm text-foreground/70 mt-1">
                        Please read these terms carefully before using our platform.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-6">
                {sections.map((section, index) => (
                <section key={index} className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                        <section.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2 text-foreground">{section.title}</h2>
                        <div className="text-sm text-foreground/80 leading-relaxed space-y-3">
                        {section.content}
                        </div>
                    </div>
                    </div>
                </section>
                ))}
            </div>
        </div>
    </main>
  );
}
