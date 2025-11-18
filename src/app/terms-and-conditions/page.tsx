
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
            Last updated: November 8, 2025
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">1. Introduction &amp; Acceptance of Terms</h2>
            <p>
              Welcome to Tutorzila! These Terms and Conditions govern your use of the Tutorzila website and
              services ("Platform"), which is owned and operated by Zilics Ventures Private Limited. By
              registering an account or using our Platform, you agree to be bound by these Terms and our
              Privacy Policy. If you do not agree, you must not use our services. These Terms constitute a
              legally binding agreement between you and Zilics Ventures Private Limited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">2. Description of Service</h2>
            <p>
              Tutorzila is a platform that connects Parents seeking tutoring services with Tutors who provide
              these services. We facilitate the posting of tuition requirements, assignment of tutors, and the
              collection/disbursement of tuition fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">3. For Tutors</h2>
            <p className="font-semibold text-foreground">3.1. Registration Fee</p>
            <p>
              To join Tutorzila as a tutor, you are required to pay a one-time, non-refundable registration fee of
              ₹199. This fee covers the cost of profile verification and platform access. Payment of this fee
              does not guarantee placement or a minimum number of tuition.
            </p>
            <p className="font-semibold text-foreground mt-4">3.2. First Month’s Fee &amp; Commission</p>
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
             <p className="font-semibold text-foreground mt-4">3.3. From Second Month Onwards</p>
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">4. For Parents</h2>
            <p className="font-semibold text-foreground">4.1. Posting Requirements</p>
            <p>
              Parents may post tuition requirements on the Platform. The tuition fee will be calculated based
              on grade level, subjects, hours, and mode of tuition (online/offline).
            </p>
            <p className="font-semibold text-foreground mt-4">4.2. Payments</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>All payments from Parents must be made in advance to Tutorzila.</li>
              <li>All payments to Tutors will be made at the end of each monthly cycle, after verification of
              class completion.</li>
            </ul>
             <p className="font-semibold text-foreground mt-4">4.3. Refund Policy</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>Refunds will be calculated based on the number of classes completed by the Tutor.</li>
                <li>The value of completed classes will be paid to the Tutor.</li>
                <li>From the remaining balance, 20% will be deducted as a service charge, and the rest
                refunded to the Parent.</li>
            </ul>
          </section>
          
           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">5. No Bypass Rule</h2>
             <p>
              Parents and Tutors are strictly prohibited from bypassing Tutorzila for direct payments or class
              arrangements.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Any attempt to bypass Tutorzila’s system will result in immediate suspension/termination
              of the account.</li>
              <li>Tutorzila reserves the right to withhold any pending payments in such cases.</li>
            </ul>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">6. Limitation of Liability</h2>
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">7. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of India. You
              agree to submit to the exclusive jurisdiction of the courts located in Delhi for resolution of
              disputes.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">8. Changes to Terms</h2>
            <p>
             We reserve the right to modify these Terms at any time. Updates will be posted on this page,
             and continued use of the Platform will constitute acceptance of the revised Terms.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
