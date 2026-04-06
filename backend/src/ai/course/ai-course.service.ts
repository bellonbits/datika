import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBaseService } from '../ai-base.service';
import { GenerateCourseDto } from '../dto/ai.dto';

const COURSE_SYSTEM_PROMPT = `
You are an expert curriculum designer and educational consultant.
Your goal is to generate high-quality course metadata based on a simple prompt.

STRICT RULES:
- The title should be catchy yet professional.
- The description should highlight key learning outcomes and target audience.
- Categorize the course accurately within tech/business domains (e.g., "Computer Science", "Data Science", "Digital Marketing", "Business").
- Provide 5-7 relevant tags.
- Assign a skill level: "BEGINNER", "INTERMEDIATE", or "ADVANCED".
- Return ONLY valid JSON matching the exact schema provided.

OUTPUT SCHEMA:
{
  "title": "string",
  "description": "string (2-3 paragraphs)",
  "category": "string (e.g. Data Science)",
  "level": "BEGINNER|INTERMEDIATE|ADVANCED",
  "tags": ["string"],
  "sections": [
    {
      "title": "string",
      "lessons": [
        { "title": "string", "type": "VIDEO|TEXT" }
      ]
    }
  ]
}
`;

@Injectable()
export class AiCourseService extends AiBaseService {
  constructor(protected readonly config: ConfigService) {
    super(config);
  }

  async generateMetadata(dto: GenerateCourseDto) {
    const userPrompt = `
Generate course metadata AND a curriculum blueprint (at least 3-4 sections with 3-5 lessons each) for the following idea:
Prompt: ${dto.prompt}
${dto.duration ? `Course Duration Goal: ${dto.duration}` : ''}
${dto.amount ? `Intended Price: ${dto.amount} KES` : ''}
${dto.context ? `Additional Context: ${dto.context}` : ''}

Ensure the curriculum is logically structured, the description is engaging, and the content is appropriate for the target duration and price.
    `;

    return this.callWithJson<{
      title: string;
      description: string;
      category: string;
      level: string;
      tags: string[];
      sections: {
        title: string;
        lessons: { title: string; type: string }[];
      }[];
    }>(
      COURSE_SYSTEM_PROMPT,
      userPrompt,
      this.contentModel,
      0.7,
    );
  }
}
