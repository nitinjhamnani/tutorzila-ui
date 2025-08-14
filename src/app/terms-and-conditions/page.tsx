
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <Card className="bg-card border rounded-lg shadow-md">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
          </div>
          <CardDescription className="text-md text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">1. Introduction & Acceptance of Terms</h2>
            <p>
              Welcome to Tutorzila! These Terms and Conditions govern your use of the Tutorzila website and services ("Platform"), which is owned and operated by Zilics Ventures Private Limited. By registering an account or using our Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use our services. These terms constitute a legally binding agreement between you and Zilics Ventures Private Limited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">2. Description of Service</h2>
            <p>
              Tutorzila is a platform that connects Parents seeking tutoring services with Tutors who provide these services. We facilitate the posting of tuition requirements, the assignment of tutors, and the management of initial interactions, including the collection of the first month's fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">3. For Tutors</h2>
            <p className="font-semibold text-foreground">3.1. Registration Fee</p>
            <p>
              To join Tutorzila as a tutor, you are required to pay a one-time, non-refundable registration fee of ₹199. This fee covers the cost of profile verification and platform access. Payment of this fee does not guarantee placement or a minimum number of tuitions.
            </p>
            <p className="font-semibold text-foreground mt-4">3.2. First Month's Fee & Commission</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Zilics Ventures Private Limited (via Tutorzila) will collect the entire first month's tuition fee from the Parent in advance.</li>
              <li>Our platform commission is 50% of the first month's fee.</li>
              <li>Your share (50% of the first month's fee) will be disbursed to your registered bank account at the end of the first successful month of tuition.</li>
              <li>From the second month onwards, you are responsible for collecting tuition fees directly from the Parent. Zilics Ventures Private Limited holds no responsibility for fee collection or disputes after the first month.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">4. For Parents</h2>
            <p className="font-semibold text-foreground">4.1. Posting Requirements</p>
            <p>
              You may post your tuition requirements on the Platform. The fee for the tuition will be dynamically calculated based on the number of days, hours per month, grade level, subjects, and the mode of tuition (online/offline).
            </p>
            <p className="font-semibold text-foreground mt-4">4.2. First Month's Fee Payment</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>To confirm a tutor and start classes, you must pay the entire first month's tuition fee to Zilics Ventures Private Limited (via Tutorzila) in advance.</li>
              <li>This fee is strictly non-refundable once paid, irrespective of whether the tuition is completed or discontinued by either party.</li>
              <li>This policy is in place to secure the tutor's commitment and our platform services.</li>
            </ul>
            <p className="font-semibold text-foreground mt-4">4.3. Subsequent Payments</p>
            <p>
              From the second month onwards, you are required to pay the tuition fees directly to the tutor as per your mutual agreement. Zilics Ventures Private Limited is not involved in any transactions or disputes after the first month.
            </p>
          </section>
          
           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">5. Limitation of Liability</h2>
            <p>
              Zilics Ventures Private Limited provides a facilitator platform (Tutorzila). We are not responsible for the conduct, quality of teaching, or actions of any Tutor or Parent. We do not guarantee academic results. Any disputes arising after the first month of tuition, including but not limited to payments and scheduling, are to be resolved directly between the Parent and the Tutor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of India. You agree to submit to the exclusive jurisdiction of the courts located in Delhi for the resolution of any disputes.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">7. Changes to Terms</h2>
            <p>
             We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms and Conditions on this page. Your continued use of the Platform after such changes constitutes your acceptance of the new terms.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
