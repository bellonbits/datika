import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBaseService } from '../ai-base.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateNotesDto } from '../dto/ai.dto';

const NOTES_SYSTEM_PROMPT = `
You are a senior academic content writer specializing in data science and data analysis.
Generate structured, publication-quality lecture notes for a university-level professional platform.

STRICT RULES:
- Formal academic English only
- No emojis, slang, or informal language
- Code samples must be syntactically correct and runnable
- APA 7th edition references only — do NOT include fake URLs or DOIs
- Minimum 5 references from real domain authors (Wickham, VanderPlas, McKinney, etc.)
- Return ONLY valid JSON matching the exact schema provided

OUTPUT SCHEMA:
{
  "title": "string",
  "subject": "string",
  "level": "beginner|intermediate|advanced",
  "abstract": "string (150-250 words)",
  "sections": [
    {
      "heading": "string",
      "content": "string",
      "subsections": [
        {
          "heading": "string",
          "content": "string",
          "definitions": ["string"],
          "examples": ["string"],
          "codeBlocks": [{"language": "python|sql|r", "code": "string", "explanation": "string"}]
        }
      ]
    }
  ],
  "caseStudy": {
    "title": "string",
    "context": "string",
    "problem": "string",
    "solution": "string",
    "outcome": "string"
  },
  "conclusion": "string",
  "references": [{"citation": "APA citation string", "note": "brief annotation"}],
  "keywords": ["string"]
}
`;

@Injectable()
export class NotesService extends AiBaseService {
  constructor(
    protected readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super(config);
  }

  async generateNotes(dto: GenerateNotesDto, userId: string) {
    const userPrompt = `
Generate comprehensive academic lecture notes on the following topic:

Topic: ${dto.topic}
Subject Area: ${dto.subject ?? 'Data Science'}
Level: ${dto.level ?? 'intermediate'}
Context/Focus: ${dto.context ?? 'General overview'}
${dto.additionalInstructions ? `Additional requirements: ${dto.additionalInstructions}` : ''}

Ensure the notes include:
1. A thorough Introduction with learning objectives
2. Theoretical Background with precise definitions
3. Practical techniques with working code examples (Python or SQL)
4. A real-world case study relevant to East Africa or global data practice
5. A solid Conclusion summarizing key takeaways
6. At least 6 APA-formatted references from recognized data science literature
    `;

    const notes = await this.callWithJson<Record<string, unknown>>(
      NOTES_SYSTEM_PROMPT,
      userPrompt,
      this.contentModel,
      0.6,
    );

    // Persist generated notes
    const saved = await this.prisma.aiNotes.create({
      data: {
        title: String(notes.title ?? dto.topic),
        subject: String(notes.subject ?? dto.subject ?? 'Data Science'),
        level: String(notes.level ?? dto.level ?? 'intermediate'),
        abstract: String(notes.abstract ?? ''),
        content: notes as object,
        keywords: Array.isArray(notes.keywords) ? (notes.keywords as string[]) : [],
        generatedBy: userId,
      },
    });

    return { notesId: saved.id, ...notes };
  }

  async findById(id: string) {
    return this.prisma.aiNotes.findUniqueOrThrow({ where: { id } });
  }

  async findByInstructor(userId: string) {
    return this.prisma.aiNotes.findMany({
      where: { generatedBy: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, subject: true, level: true,
        keywords: true, createdAt: true,
      },
    });
  }
}
