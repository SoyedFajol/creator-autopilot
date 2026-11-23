import { z } from 'zod';

export interface AIService {
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
  generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemInstruction?: string
  ): Promise<T>;
}

export class GeminiAIService implements AIService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey?: string, model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model;
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      // Offline / fallback mock generator for development & tests
      return `[Mock AI Response for: ${prompt.slice(0, 40)}...]`;
    }

    const endpoint = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const body: Record<string, unknown> = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API returned an empty response');
    }

    return text;
  }

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemInstruction?: string
  ): Promise<T> {
    const formattedPrompt = `${prompt}

IMPORTANT: You must return ONLY valid, minified JSON conforming to the requested schema. Do not include markdown codeblocks or conversational text.`;

    const raw = await this.generateText(formattedPrompt, systemInstruction);
    let jsonStr = raw.trim();

    // Strip markdown code fences if included
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return schema.parse(parsed);
    } catch (e: any) {
      throw new Error(`AI response failed schema validation: ${e.message}\nRaw: ${jsonStr.slice(0, 200)}`);
    }
  }
}
