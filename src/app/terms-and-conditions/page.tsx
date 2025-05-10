
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg">
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
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">1. Introduction</h2>
            <p>
              Welcome to Tutorzila! These terms and conditions outline the rules and regulations for the use of
              Tutorzila&apos;s Website, located at [Your Website URL].
            </p>
            <p className="mt-2">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use
              Tutorzila if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, Tutorzila and/or its licensors own all the
              intellectual property rights and materials contained in this Website. You are granted limited license
              only for purposes of viewing the material contained on this Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Publishing any Website material in any other media.</li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
              <li>Publicly performing and/or showing any Website material.</li>
              <li>Using this Website in any way that is or may be damaging to this Website.</li>
              <li>Using this Website in any way that impacts user access to this Website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">4. User Content</h2>
            <p>
              In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text,
              images or other material you choose to display on this Website. By displaying Your Content, you grant
              Tutorzila a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt,
              publish, translate and distribute it in any and all media.
            </p>
            <p className="mt-2">
              Your Content must be your own and must not be invading any third-party’s rights. Tutorzila reserves
              the right to remove any of Your Content from this Website at any time without notice.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">5. Limitation of Liability</h2>
            <p>
              In no event shall Tutorzila, nor any of its officers, directors and employees, be held liable for
              anything arising out of or in any way connected with your use of this Website whether such liability
              is under contract. Tutorzila, including its officers, directors and employees shall not be held
              liable for any indirect, consequential or special liability arising out of or in any way related to
              your use of this Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary/90">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of [Your State/Country],
              and you submit to the non-exclusive jurisdiction of the state and federal courts located in
              [Your City/State] for the resolution of any disputes.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            This is a placeholder document. Please replace this with your actual Terms and Conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
