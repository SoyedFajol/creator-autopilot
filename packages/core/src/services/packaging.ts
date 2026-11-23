import { z } from 'zod';
import { Brand, ThumbnailConcept, TitleOption } from '../types/index.js';
import { AIService } from './ai.js';

export const PackagingResponseSchema = z.object({
  titles: z.array(
    z.object({
      title: z.string(),
      hookAngle: z.string(),
      score: z.number().min(0).max(100),
    })
  ).length(5),
  thumbnailConcepts: z.array(
    z.object({
      id: z.string(),
      headlineText: z.string(), // Must be 4 words or fewer
      focalObject: z.string(),
      visualLayout: z.enum(['split', 'centered', 'badge_highlight', 'comparison']),
      stockKeywordQuery: z.string().optional(),
    })
  ).length(2),
});

export class PackagingService {
  constructor(private ai: AIService) {}

  async generatePackaging(
    topic: string,
    pillar: string,
    brand: Brand,
    pastSuccessfulTitles: string[] = []
  ): Promise<{ titles: TitleOption[]; thumbnailConcepts: ThumbnailConcept[]; chosenTitle: string }> {
    const prompt = `You are a world-class YouTube packaging expert. Generate packaging for a video on the topic: "${topic}".
Brand: ${brand.name}
Niche: ${brand.niche}
Content Pillar: ${pillar}
Brand Promise: "${brand.profile.promise}"

RULES:
1. Write exactly 5 title options that make high-curiosity, honest promises delivered in the video.
2. Provide exactly 2 thumbnail concepts.
3. CRITICAL: Every thumbnail headlineText MUST BE 4 WORDS OR FEWER. No exceptions.
4. Thumbnail focalObject must be a physical object, device, document, or icon—NEVER human faces, logos, or copyrighted characters.
5. Thumbnail concepts must have strong contrast and readability at small thumbnail size.
${pastSuccessfulTitles.length > 0 ? `Past high-performing titles: ${pastSuccessfulTitles.slice(0, 3).join(', ')}` : ''}`;

    const systemInstruction = `You generate structured YouTube titles and thumbnail concepts for faceless educational channels.`;

    try {
      const res = await this.ai.generateStructured(prompt, PackagingResponseSchema, systemInstruction);

      // Validate & enforce 4 words rule strictly
      const sanitizedThumbnails = res.thumbnailConcepts.map((concept, index) => {
        const words = concept.headlineText.split(/\s+/).filter(Boolean);
        const headlineText = words.length > 4 ? words.slice(0, 4).join(' ') : concept.headlineText;
        return {
          ...concept,
          id: `thumb-concept-${index + 1}`,
          headlineText,
        };
      });

      // Pick top-scoring title
      const sortedTitles = [...res.titles].sort((a, b) => b.score - a.score);
      const chosenTitle = sortedTitles[0].title;

      return {
        titles: sortedTitles,
        thumbnailConcepts: sanitizedThumbnails,
        chosenTitle,
      };
    } catch {
      // Fallback deterministic packaging if offline
      const fallbackTitle = `${brand.name}: The Real Truth About ${topic}`;
      return {
        titles: [
          { title: fallbackTitle, hookAngle: 'Direct Curiosity', score: 85 },
          { title: `${topic} Explained: What You Need to Know`, hookAngle: 'Clarity', score: 80 },
          { title: `Stop Making This Mistake With ${topic}`, hookAngle: 'Loss Aversion', score: 78 },
          { title: `${topic}: Free vs Paid Breakdown`, hookAngle: 'Comparison', score: 75 },
          { title: `Is ${topic} Really Worth It in 2026?`, hookAngle: 'Verdict', score: 72 },
        ],
        thumbnailConcepts: [
          {
            id: 'thumb-concept-1',
            headlineText: 'WORTH IT?',
            focalObject: 'Comparison Checklist Document',
            visualLayout: 'badge_highlight',
            stockKeywordQuery: 'software dashboard review',
          },
          {
            id: 'thumb-concept-2',
            headlineText: 'WATCH FIRST',
            focalObject: 'Warning Icon and Document',
            visualLayout: 'split',
            stockKeywordQuery: 'technology hardware close up',
          },
        ],
        chosenTitle: fallbackTitle,
      };
    }
  }
}
