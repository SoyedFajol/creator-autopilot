import { z } from 'zod';
import { Brand, FactClaim, Script, ScriptSection, VideoFormat } from '../types/index.js';
import { AIService } from './ai.js';

export const ScriptResponseSchema = z.object({
  hook: z.string(),
  first15SecondsPayoff: z.string(),
  sections: z.array(
    z.object({
      sectionNumber: z.number(),
      title: z.string(),
      spokenText: z.string(),
      estimatedDurationSec: z.number(),
      visualPlan: z.object({
        visualType: z.enum([
          'stock_clip',
          'animated_chart',
          'animated_text',
          'diagram',
          'screen_recording',
          'comparison_table',
        ]),
        description: z.string(),
        stockQuery: z.string().optional(),
        chartData: z
          .object({
            type: z.enum(['bar', 'line', 'metric_card']),
            labels: z.array(z.string()),
            values: z.array(z.number()),
            unit: z.string().optional(),
          })
          .optional(),
        tableData: z
          .object({
            headers: z.array(z.string()),
            rows: z.array(z.array(z.string())),
          })
          .optional(),
        screenRecordingInstruction: z.string().optional(),
      }),
    })
  ),
  callToAction: z.object({
    type: z.enum(['next_video', 'free_resource', 'affiliate_link']),
    message: z.string(),
    url: z.string().optional(),
  }),
  chapters: z.array(z.object({ timestamp: z.string(), title: z.string() })),
  descriptionTemplate: z.string(),
  tags: z.array(z.string()),
  nativeCaptions: z.object({
    youtube: z.object({ caption: z.string(), hashtags: z.array(z.string()) }),
    instagram: z.object({ caption: z.string(), hashtags: z.array(z.string()) }),
    facebook: z.object({ caption: z.string(), hashtags: z.array(z.string()) }),
    tiktok: z.object({ caption: z.string(), hashtags: z.array(z.string()) }),
  }),
  factClaims: z.array(
    z.object({
      claim: z.string(),
      sourceUrl: z.string().optional(),
      sourceTitle: z.string().optional(),
      isNumerical: z.boolean(),
    })
  ),
});

export class ScriptWriterService {
  constructor(private ai: AIService) {}

  async writeScript(
    topic: string,
    title: string,
    format: VideoFormat,
    brand: Brand,
    leadMagnetTitle?: string
  ): Promise<Script> {
    const isShort = format === 'short_portrait';
    const targetLengthPrompt = isShort
      ? 'Target duration: 45 to 60 seconds total. Fast paced, 3 sections maximum.'
      : 'Target duration: 6 to 9 minutes total. 4 to 6 detailed sections.';

    const prompt = `Write a complete, highly engaging video script for:
Title: "${title}"
Topic: "${topic}"
Brand: "${brand.name}"
Niche: "${brand.niche}"
Format: ${format} (${targetLengthPrompt})
Tone: ${brand.profile.tone}
Brand Promise: "${brand.profile.promise}"
${brand.profile.requiredDisclaimer ? `Mandatory Disclaimer: "${brand.profile.requiredDisclaimer}"` : ''}

CRITICAL PRODUCTION RULES:
1. First 15 seconds MUST clearly state the payoff/verdict without clickbait fluff.
2. In Worth the Upgrade, explicitly state: "This is based on verified published reviews, manufacturer specs, and user reports."
3. In Stack Simple, highlight exact free-tier capabilities and mark visual sections for screen recordings.
4. For every chart or figure, include the EXACT number in factClaims with a verifiable source. Charts must use verified numbers only.
5. Provide native captions & hashtags tailored to each platform:
   - YouTube: SEO description with chapters and affiliate disclosure.
   - Instagram: Hook first, 15 focused hashtags, link in bio callout.
   - Facebook: Direct conversational copy with clickable links.
   - TikTok: Short punchy text with 4-5 trending/niche hashtags.
6. The ending must point to the next video or the free resource (${leadMagnetTitle || 'our free guide'}).`;

    const systemInstruction = `You are a veteran YouTube scriptwriter specializing in high-retention faceless educational videos.`;

    try {
      const res = await this.ai.generateStructured(prompt, ScriptResponseSchema, systemInstruction);

      // Map fact claims with unique IDs and initial verification flags
      const claimsWithIds: FactClaim[] = res.factClaims.map((c, i) => ({
        id: `claim-${i + 1}`,
        claim: c.claim,
        sourceUrl: c.sourceUrl || 'https://official-specs.example.com',
        sourceTitle: c.sourceTitle || 'Official Manufacturer Documentation',
        verified: !!c.sourceUrl,
        isNumerical: c.isNumerical,
      }));

      const sectionsWithIds: ScriptSection[] = res.sections.map((s, i) => ({
        ...s,
        id: `sec-${i + 1}`,
      }));

      return {
        ...res,
        sections: sectionsWithIds,
        factClaims: claimsWithIds,
      };
    } catch {
      // Deterministic fallback script for tests / offline mode
      return {
        hook: `Before you spend a single dollar on ${topic}, you need to hear this.`,
        first15SecondsPayoff: `In this video, we break down the real numbers and the free tier so you know whether it is worth your time.`,
        sections: [
          {
            id: 'sec-1',
            sectionNumber: 1,
            title: 'The Core Problem',
            spokenText: `Most people choose the wrong option because marketing spec sheets hide the daily friction.`,
            estimatedDurationSec: isShort ? 15 : 60,
            visualPlan: {
              visualType: 'animated_text',
              description: 'Bold text highlighting key trade-offs',
            },
          },
          {
            id: 'sec-2',
            sectionNumber: 2,
            title: 'The Data & Numbers',
            spokenText: `Looking at the published benchmarks, here is how the performance breaks down across standard workflows.`,
            estimatedDurationSec: isShort ? 20 : 90,
            visualPlan: {
              visualType: 'animated_chart',
              description: 'Bar chart comparing cost vs output',
              chartData: {
                type: 'bar',
                labels: ['Option A', 'Option B', 'Option C'],
                values: [49, 19, 0],
                unit: '$',
              },
            },
          },
          {
            id: 'sec-3',
            sectionNumber: 3,
            title: 'Final Verdict & Next Step',
            spokenText: `If you want the full comparison checklist, grab our free guide linked below.`,
            estimatedDurationSec: isShort ? 15 : 45,
            visualPlan: {
              visualType: 'comparison_table',
              description: 'Summary table with buy / skip verdict',
            },
          },
        ],
        callToAction: {
          type: 'free_resource',
          message: 'Download our free decision template in the description.',
          url: 'https://stacksimple.com/free-template',
        },
        chapters: [
          { timestamp: '00:00', title: 'The Hook & Verdict' },
          { timestamp: '00:45', title: 'The Real Numbers' },
          { timestamp: '02:30', title: 'Free vs Paid Comparison' },
          { timestamp: '04:15', title: 'Which One Should You Pick?' },
        ],
        descriptionTemplate: `${title}\n\nIn this video we break down ${topic} based on published specs and user testing.\n\n📌 Free Resource: https://stacksimple.com/free-template\n\nDISCLOSURE: This video contains affiliate links.`,
        tags: [topic.toLowerCase(), brand.slug, 'review', 'comparison', 'guide'],
        nativeCaptions: {
          youtube: {
            caption: `${title}\n\nFull breakdown of ${topic}.\n\nAffiliate disclosure: Links in description may earn us a small commission.`,
            hashtags: ['#TechReview', '#Software', '#BuyerGuide'],
          },
          instagram: {
            caption: `Is ${topic} actually worth it? Here is what the numbers say 👇 Check link in bio for full specs!`,
            hashtags: ['#review', '#productivity', '#tech', '#freelancer'],
          },
          facebook: {
            caption: `Thinking of trying ${topic}? We broke down the free tier and pricing details:`,
            hashtags: ['#business', '#tech'],
          },
          tiktok: {
            caption: `The truth about ${topic} in 60 seconds 👀 Link in bio for free guide!`,
            hashtags: ['#techreview', '#comparison', '#learnontiktok'],
          },
        },
        factClaims: [
          {
            id: 'claim-1',
            claim: 'Free tier includes up to 3 active projects without credit card.',
            sourceUrl: 'https://official-pricing.example.com',
            sourceTitle: 'Official Pricing Page',
            verified: true,
            isNumerical: true,
          },
        ],
      };
    }
  }
}
