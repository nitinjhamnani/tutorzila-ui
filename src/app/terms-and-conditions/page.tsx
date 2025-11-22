
import { FileText, Briefcase, GraduationCap, Users, Ban, ShieldAlert, Landmark, UserCheck } from "lucide-react";

export default function TermsAndConditionsPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  
  const sections = [
    {
      icon: FileText,
      title: "1. Introduction & Acceptance of Terms",
      content: (
        <p>
          Welcome to Tutorzila! These Terms and Conditions govern your use of the Tutorzila website and
          services ("Platform"), which is owned and operated by Zilics Ventures Private Limited. By
          registering an account or using our Platform, you agree to be bound by these Terms and our
          Privacy Policy. If you do not agree, you must not use our services. These Terms constitute a
          legally binding agreement between you and Zilics Ventures Private Limited.
        </p>
      ),
    },
    {
      icon: Briefcase,
      title: "2. Description of Service",
      content: (
        <p>
          Tutorzila is a platform that connects Parents seeking tutoring services with Tutors who provide
          these services. We facilitate the posting of tuition requirements, assignment of tutors, and the
          collection/disbursement of tuition fees.
        </p>
      ),
    },
    {
      icon: GraduationCap,
      title: "3. For Tutors",
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
      icon: Users,
      title: "4. For Parents",
      content: (
         <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-foreground">4.1. Posting Requirements</h3>
                <p>
                Parents may post tuition requirements on the Platform. Fees are calculated based on grade,
                subjects, hours, and mode (online/offline).
                </p>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">4.2. Payments</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>All payments from Parents must be made in advance to Tutorzila.</li>
                <li>Payments to Tutors are processed at the end of the monthly cycle upon verification of
                class completion.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">4.3. Refund Policy</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                    <li>Refunds will be calculated based on the number of classes completed by the Tutor.
                    The value of completed classes will be paid to the Tutor.</li>
                    <li>From the remaining balance, 20% will be deducted as a service charge.</li>
                    <li>Approved refunds will be processed within 15 working days.</li>
                </ul>
            </div>
        </div>
      ),
    },
    {
      icon: Ban,
      title: "5. No Bypass Rule",
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
        title: "6. Limitation of Liability",
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
        title: "7. Governing Law & Jurisdiction",
        content: (
            <p>
              These Terms are governed by the laws of India. You agree to submit to the exclusive jurisdiction
              of the courts located in Delhi.
            </p>
        )
    },
    {
        icon: FileText,
        title: "8. Changes to Terms",
        content: (
             <p>
             Tutorzila reserves the right to update or modify these Terms at any time. Continued use of the
             Platform after updates constitutes acceptance of the revised Terms.
            </p>
        )
    }
  ];

  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Terms and Conditions</h1>
        <p className="mt-2 text-md text-muted-foreground">
            Last updated: November 22, 2025
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={index} className="p-6 bg-card border rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out" style={{animationDelay: `${index * 100}ms`}}>
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
  );
}
