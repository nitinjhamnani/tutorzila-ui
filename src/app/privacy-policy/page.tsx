
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <Card className="bg-card border rounded-lg shadow-md">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
           <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </div>
          <CardDescription className="text-md text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">1. Introduction</h2>
            <p>
              Zilics Ventures Private Limited ("we", "our", or "us") operates the Tutorzila platform and is committed to protecting your privacy. This Privacy Policy explains
              how your personal information is collected, used, and disclosed by Zilics Ventures Private Limited. This policy applies to our website (Tutorzila) and its services and is compliant with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the Information Technology Act, 2000 of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you register, post a requirement, or communicate with us. This information may include:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li><b>Personal Information:</b> Name, email address, phone number, location (city, area).</li>
              <li><b>Tutor Specific Information:</b> Qualifications, experience, subjects, boards taught, bank account details for payment processing.</li>
              <li><b>Parent Specific Information:</b> Student's name, grade level, and specific tuition requirements.</li>
              <li><b>Financial Information:</b> We collect first-month fees from Parents and process payments to Tutors. We may use third-party payment gateways, and your payment information is handled securely by them. We do not store your full card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">3. How We Use Your Information</h2>
            <p>Your information is used for the following purposes:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>To create and manage your account on our Platform.</li>
              <li>To connect Parents with suitable Tutors based on requirements.</li>
              <li>To facilitate communication between users.</li>
              <li>To process payments, including the tutor registration fee and the first month's tuition fee.</li>
              <li>To improve our services, and for internal analytics and research.</li>
              <li>To send you transactional emails, service announcements, and promotional communications (from which you can opt-out).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">4. Information Sharing and Disclosure</h2>
            <p>
              We do not sell or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li><b>Tutors and Parents:</b> We share necessary information between Tutors and Parents to facilitate the tutoring engagement. For example, a Parent's requirement details are shared with potential Tutors.</li>
                <li><b>Service Providers:</b> We work with third-party service providers for payment processing and website hosting. These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                <li><b>Legal Requirements:</b> We may disclose your information if required by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">5. Data Security</h2>
            <p>
              We implement reasonable security practices and procedures including administrative, physical, and technical controls to protect your personal information from unauthorized access, use, or disclosure.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">6. Your Rights</h2>
             <p>You have the right to access, correct, or delete your personal information. You can update your profile information through your dashboard or by contacting us directly.
            </p>
          </section>
           
           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">7. Grievance Officer</h2>
             <p>In accordance with the Information Technology Act, 2000, and the rules made thereunder, the name and contact details of the Grievance Officer for Zilics Ventures Private Limited are provided below:
            </p>
             <p className="mt-2">
                 Name: [Grievance Officer Name]<br/>
                 Email: zilicsventures@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">8. Changes to Our Privacy Policy</h2>
            <p>
             We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
