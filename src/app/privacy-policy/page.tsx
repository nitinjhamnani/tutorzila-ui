
import { ShieldAlert, Info, Lock, Users, FileText, UserSquare, Scale, MessageCircleQuestion } from "lucide-react";

export default function PrivacyPolicyPage() {
  const containerPadding = "container mx-auto px-6 sm:px-8 md:px-10 lg:px-12";
  
  const sections = [
    {
      icon: Info,
      title: "1. Introduction",
      content: (
        <p>
          Zilics Ventures Private Limited ("we", "our", or "us") operates the Tutorzila platform and is committed to protecting your privacy. This Privacy Policy explains
          how your personal information is collected, used, and disclosed by Zilics Ventures Private Limited. This policy applies to our website (Tutorzila) and its services and is compliant with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the Information Technology Act, 2000 of India.
        </p>
      ),
    },
    {
      icon: UserSquare,
      title: "2. Information We Collect",
      content: (
        <>
          <p>We collect information that you provide directly to us when you register, post a requirement, or communicate with us. This information may include:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
            <li><b>Personal Information:</b> Name, email address, phone number, location (city, area).</li>
            <li><b>Tutor Specific Information:</b> Qualifications, experience, subjects, boards taught, bank account details for payment processing.</li>
            <li><b>Parent Specific Information:</b> Student's name, grade level, and specific tuition requirements.</li>
            <li><b>Financial Information:</b> We collect fees from Parents and process payments to Tutors. We may use third-party payment gateways, and your payment information is handled securely by them. We do not store your full card details.</li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>Your information is used for the following purposes:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>To create and manage your account on our Platform.</li>
            <li>To connect Parents with suitable Tutors based on requirements.</li>
            <li>To facilitate communication between users.</li>
            <li>To process payments, including the tutor registration fee and the tuition fee.</li>
            <li>To improve our services, and for internal analytics and research.</li>
            <li>To send you transactional emails, service announcements, and promotional communications (from which you can opt-out).</li>
          </ul>
        </>
      ),
    },
    {
      icon: Users,
      title: "4. Information Sharing and Disclosure",
      content: (
        <>
          <p>We do not sell or rent your personal information. We may share your information with:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li><b>Tutors and Parents:</b> We share necessary information between Tutors and Parents to facilitate the tutoring engagement. For example, a Parent's requirement details are shared with potential Tutors.</li>
              <li><b>Service Providers:</b> We work with third-party service providers for payment processing and website hosting. These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
              <li><b>Legal Requirements:</b> We may disclose your information if required by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "5. Data Security",
      content: (
        <p>
          We implement reasonable security practices and procedures including administrative, physical, and technical controls to protect your personal information from unauthorized access, use, or disclosure.
        </p>
      ),
    },
    {
      icon: UserSquare,
      title: "6. Your Rights",
      content: (
        <p>
          You have the right to access, correct, or delete your personal information. You can update your profile information through your dashboard or by contacting us directly.
        </p>
      ),
    },
    {
      icon: MessageCircleQuestion,
      title: "7. Grievance Officer",
      content: (
        <>
          <p>In accordance with the Information Technology Act, 2000, and the rules made thereunder, the name and contact details of the Grievance Officer for Zilics Ventures Private Limited are provided below:</p>
          <p className="mt-2">
              Name: Annu Jhamnani<br/>
              Email: zilicsventures@gmail.com
          </p>
        </>
      ),
    },
    {
      icon: FileText,
      title: "8. Changes to Our Privacy Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </p>
      ),
    }
  ];

  return (
    <div className={`${containerPadding} max-w-4xl py-12`}>
      <div className="text-center mb-12 animate-in fade-in duration-500 ease-out">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-md text-muted-foreground">
          Last updated: November 8, 2025
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
