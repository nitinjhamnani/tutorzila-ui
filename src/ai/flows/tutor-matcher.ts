
'use server';

/**
 * @fileOverview Matches students with suitable tutors based on subject, grade level, and learning preferences.
 *
 * - intelligentTutorMatching - A function that handles the tutor matching process.
 * - IntelligentTutorMatchingInput - The input type for the intelligentTutorMatching function.
 * - IntelligentTutorMatchingOutput - The return type for the intelligentTutorMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTutorMatchingInputSchema = z.object({
  subject: z.string().describe('The subject for which the student needs a tutor.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  learningPreferences: z
    .string()
    .describe('The learning preferences of the student, e.g., visual, auditory, kinesthetic.'),
});
export type IntelligentTutorMatchingInput = z.infer<typeof IntelligentTutorMatchingInputSchema>;

const TutorProfileSchema = z.object({
  name: z.string().describe('The name of the tutor.'),
  expertise: z.string().describe('The area of expertise of the tutor.'),
  rating: z.number().describe('The rating of the tutor.'),
  hourlyRate: z.string().describe('The hourly rate of the tutor as a string.'),
  isRateNegotiable: z.boolean().describe('Whether the hourly rate is negotiable.'),
});

const IntelligentTutorMatchingOutputSchema = z.array(TutorProfileSchema).describe('A list of tutor profiles matching the student criteria.');
export type IntelligentTutorMatchingOutput = z.infer<typeof IntelligentTutorMatchingOutputSchema>;

// This function now directly implements the logic instead of using a complex flow.
// This is more efficient and avoids the issues causing the ListOperations polling.
export async function intelligentTutorMatching(input: IntelligentTutorMatchingInput): Promise<IntelligentTutorMatchingOutput> {
  console.log("Finding tutors with input:", input);
  // This is a placeholder implementation.
  // In a real application, this would query a database or external API
  // to find tutors matching the input criteria.
  return [
    {
      name: 'Jane Doe',
      expertise: input.subject,
      rating: 4.5,
      hourlyRate: "30",
      isRateNegotiable: true,
    },
    {
      name: 'John Smith',
      expertise: input.subject,
      rating: 4.0,
      hourlyRate: "25",
      isRateNegotiable: false,
    },
  ];
}

// The tool definition is kept for potential future use or for clarity on the function's purpose,
// but it is not directly invoked in the simplified flow.
const findTutorsTool = ai.defineTool({
  name: 'findTutors',
  description: 'Finds tutors based on subject, grade level, and learning preferences.',
  inputSchema: IntelligentTutorMatchingInputSchema,
  outputSchema: IntelligentTutorMatchingOutputSchema,
}, async (input) => {
  return await intelligentTutorMatching(input);
});
