
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-6 sm:px-8 md:px-10 lg:px-12">
      <Card className="shadow-lg">
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
              Tutorzila (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains
              how your personal information is collected, used, and disclosed by Tutorzila.
            </p>
            <p className="mt-2">
              This Privacy Policy applies to our website, and its associated subdomains (collectively, our
              &quot;Service&quot;) alongside our application, Tutorzila. By accessing or using our Service, you signify
              that you have read, understood, and agree to our collection, storage, use, and disclosure of your
              personal information as described in this Privacy Policy and our Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">2. Information We Collect</h2>
            <p>We collect information from you when you visit our service, register, place an order, subscribe to
              our newsletter, respond to a survey or fill out a form.</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Name / Username</li>
              <li>Email Addresses</li>
              <li>Password</li>
              <li>User role (Parent/Tutor)</li>
              <li>Other information you provide voluntarily (e.g., profile details, tuition requirements)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">3. How We Use Your Information</h2>
            <p>Any of the information we collect from you may be used in one of the following ways:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>To personalize your experience (your information helps us to better respond to your individual
                needs).</li>
              <li>To improve our service (we continually strive to improve our service offerings based on the
                information and feedback we receive from you).</li>
              <li>To improve customer service (your information helps us to more effectively respond to your
                customer service requests and support needs).</li>
              <li>To process transactions.</li>
              <li>To administer a contest, promotion, survey or other site feature.</li>
              <li>To send periodic emails.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">4. How We Protect Your Information</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information when
              you place an order or enter, submit, or access your personal information. We offer the use of a
              secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL)
              technology and then encrypted into our Payment gateway providers database only to be accessible by
              those authorized with special access rights to such systems, and are required to keep the
              information confidential.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">5. Cookies</h2>
            <p>
              We use cookies to help us remember and process the items in your shopping cart, understand and save
              your preferences for future visits and compile aggregate data about site traffic and site interaction
              so that we can offer better site experiences and tools in the future.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">6. Changes to Our Privacy Policy</h2>
            <p>
             If we decide to change our privacy policy, we will post those changes on this page, and/or update the Privacy Policy modification date above.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            This is a placeholder document. Please replace this with your actual Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

