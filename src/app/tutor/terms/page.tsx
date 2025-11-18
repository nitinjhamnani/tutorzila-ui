
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
            <h3 className="font-semibold text-foreground">Registration Fee</h3>
            <p>
              To join Tutorzila as a tutor, you are required to pay a one-time, non-refundable registration fee of
              ₹199. This fee covers the cost of profile verification and platform access. Payment of this fee
              does not guarantee placement or a minimum number of tuitions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">First Month’s Fee & Commission</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Tutorzila (Zilics Ventures Private Limited) shall collect the entire first month’s tuition fee
              from the Parent in advance.</li>
              <li>The fee amount communicated to the Parent shall be considered the total payable tuition
              fee. Tutorzila’s internal facilitation charge shall be applied to this amount as per its
              standard policy. The remaining amount, referred to as the Tutor’s payable fee, will form
              the basis of the Tutor’s payout.</li>
              <li>For the first month, 50% of the Tutor’s payable fee will be released to the Tutor’s
              registered bank account at the end of the month, subject to the successful completion of
              scheduled classes.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">From Second Month Onwards</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>From the second month onwards, Parents shall continue to make the tuition fee payment
              in advance to Tutorzila as per the agreed rate.</li>
              <li>Tutorzila shall disburse the Tutor’s payable fee (i.e., the tuition fee amount after
              deduction of Tutorzila’s internal facilitation charge) to the Tutor at the end of each
              monthly cycle, contingent upon successful completion of the agreed classes.</li>
              <li>Tutors are strictly prohibited from collecting tuition fees directly from Parents under any
              circumstances. All financial transactions between Parents and Tutors must be processed
              exclusively through Tutorzila’s official payment channels.</li>
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
              Parents and Tutors are strictly prohibited from bypassing Tutorzila for direct payments or class
              arrangements.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Any attempt to bypass Tutorzila’s system will result in immediate suspension/termination
              of the account.</li>
              <li>Tutorzila reserves the right to withhold any pending payments in such cases.</li>
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
              Tutorzila (Zilics Ventures Private Limited) is only a facilitator platform.
            </p>
             <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>We are not responsible for the conduct, quality of teaching, or actions of Tutors or
                Parents.</li>
                <li>We do not conduct background checks on Tutors. Parents must ensure their presence at
                home during offline tuition sessions.</li>
                <li>Tutorzila provides only a service of connecting Parents and Tutors and handling fee
                collection/disbursement.</li>
                <li>Any disputes unrelated to academics (e.g., behavior, safety, or personal matters) must
                be resolved directly between Parent and Tutor. Tutorzila has no role in such disputes.</li>
            </ul>
            </>
        )
    },
    {
        icon: Landmark,
        title: "Governing Law & Jurisdiction",
        content: (
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of India. You
              agree to submit to the exclusive jurisdiction of the courts located in Delhi for resolution of
              disputes.
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
