import MatchForm from '@/components/features/matching/match-form';
import { Lightbulb } from 'lucide-react';

export default function MatchPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section className="text-center">
        <Lightbulb className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Intelligent Tutor Matching</h1>
        <p className="text-muted-foreground">
          Let our AI help you find the perfect tutor based on your specific needs and learning style.
        </p>
      </section>
      
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        <MatchForm />
      </div>
    </div>
  );
}
