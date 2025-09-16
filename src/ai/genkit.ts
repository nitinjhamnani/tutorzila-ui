
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitx} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI(),
    genkitx(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
