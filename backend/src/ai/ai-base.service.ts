import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

export interface ImageUrlPart {
  type: 'image_url';
  image_url: { url: string };
}

export interface TextPart {
  type: 'text';
  text: string;
}

export type MessageContent = string | Array<TextPart | ImageUrlPart>;

@Injectable()
export class AiBaseService {
  protected readonly groq: Groq;
  protected readonly contentModel: string;
  protected readonly gradingModel: string;
  protected readonly logger = new Logger(AiBaseService.name);

  constructor(protected readonly config: ConfigService) {
    this.groq = new Groq({
      apiKey: config.get<string>('GROQ_API_KEY'),
    });
    this.contentModel = config.get<string>(
      'GROQ_MODEL_CONTENT',
      'meta-llama/llama-4-scout-17b-16e-instruct',
    );
    this.gradingModel = config.get<string>(
      'GROQ_MODEL_GRADING',
      'meta-llama/llama-4-scout-17b-16e-instruct',
    );
  }

  /**
   * Call Groq and parse the response as JSON.
   * Wraps the user prompt to enforce JSON output since Groq's
   * llama-4-scout supports vision + JSON natively.
   */
  protected async callWithJson<T>(
    systemPrompt: string,
    userPrompt: MessageContent,
    model: string,
    temperature = 0.7,
  ): Promise<T> {
    try {
      const userContent: MessageContent =
        typeof userPrompt === 'string'
          ? `${userPrompt}\n\nRespond with valid JSON only. No markdown, no explanation outside the JSON object.`
          : [
              ...userPrompt,
              {
                type: 'text',
                text: 'Respond with valid JSON only. No markdown, no explanation outside the JSON object.',
              },
            ];

      const response = await this.groq.chat.completions.create({
        model,
        temperature,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent as string },
        ],
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) throw new InternalServerErrorException('Empty AI response');
      return JSON.parse(raw) as T;
    } catch (error) {
      this.logger.error(`Groq call failed: ${(error as Error).message}`);
      throw new InternalServerErrorException('AI service temporarily unavailable');
    }
  }

  /**
   * Call Groq with an image URL (multimodal).
   * llama-4-scout-17b-16e-instruct supports image inputs natively.
   */
  protected async callWithImage<T>(
    systemPrompt: string,
    textPrompt: string,
    imageUrl: string,
    model: string,
    temperature = 0.5,
  ): Promise<T> {
    return this.callWithJson<T>(
      systemPrompt,
      [
        { type: 'text', text: textPrompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
      model,
      temperature,
    );
  }

  /**
   * Streaming chat — yields tokens one by one.
   */
  protected async *callStream(
    systemPrompt: string,
    userPrompt: string,
    model: string,
  ): AsyncGenerator<string> {
    const stream = await this.groq.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) yield token;
    }
  }
}
