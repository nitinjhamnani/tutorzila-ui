
"use client";

import { FileText, Users, Ban, ShieldAlert, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParentTermsPage() {
  const sections = [
    {
      icon: Users,
      title: "For Parents",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">1. Posting Requirements</h3>
            <p>
              Parents may post tuition requirements on the Platform. Fees are calculated based on grade,
              subjects, hours, and mode (online/offline).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">2. Payments</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>All payments from Parents must be made in advance to Tutorzila for each monthly cycle.</li>
              <li>Payments to Tutors are processed at the end of the monthly cycle upon verification of class completion.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">3. Refund Policy</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Refunds will be calculated based on the number of classes completed by the Tutor. The value of completed classes will be paid to the Tutor.</li>
              <li>From the remaining balance, 20% will be deducted as a service charge.</li>
              <li>Approved refunds will be processed within 15 working days.</li>
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
            <li>Any attempt to bypass the platform will lead to immediate suspension or termination of the account.</li>
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
            teaching quality of Tutors.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>No background verification is conducted by Tutorzila; Parents must ensure their presence during offline classes for safety.</li>
            <li>Any disputes unrelated to academics—such as behavioural issues or personal disagreements—must be resolved directly between the Parent and Tutor. Tutorzila holds no responsibility in such matters.</li>
          </ul>
        </>
      ),
    },
    {
      icon: Landmark,
      title: "Governing Law & Jurisdiction",
      content: (
        <p>
          These Terms are governed by the laws of India. You agree to submit to the exclusive jurisdiction
          of the courts located in Delhi.
        </p>
      ),
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
                Parent Terms & Conditions
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
