import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBaseService } from '../ai-base.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateQuizDto } from '../dto/ai.dto';
import { v4 as uuidv4 } from 'uuid';

const QUIZ_SYSTEM_PROMPT = `
You are an assessment designer for a data science learning platform.
Generate high-quality multiple-choice questions (MCQs) from lesson content.

STRICT RULES:
- No trivial questions — require comprehension or application
- Plausible distractors that reflect real misconceptions
- Single unambiguous correct answer per question
- At least 40% of questions should involve code interpretation
- No "all of the above" or "none of the above" options
- Formal academic language, no emojis
- Return ONLY valid JSON

OUTPUT SCHEMA:
{
  "topic": "string",
  "difficulty": "beginner|intermediate|advanced",
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": {"A": "string", "B": "string", "C": "string", "D": "string"},
      "correctAnswer": "A|B|C|D",
      "explanation": "string",
      "bloomsLevel": "remember|understand|apply|analyze|evaluate|create",
      "tags": ["string"]
    }
  ]
}
`;

@Injectable()
export class QuizService extends AiBaseService {
  constructor(
    protected readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super(config);
  }

  async generateQuiz(dto: GenerateQuizDto, userId: string) {
    const count = Math.min(Math.max(dto.questionCount ?? 10, 5), 20);
    const userPrompt = `
Generate ${count} multiple-choice questions based on the following content:

Topic: ${dto.topic}
Difficulty: ${dto.difficulty ?? 'intermediate'}
Content/Context:
${dto.content}

Requirements:
- Distribute Bloom's levels: include at least 1 apply, 1 analyze, 1 evaluate question
- For any code questions, include realistic Python or SQL snippets
- Explanations must reference WHY wrong answers are incorrect
    `;

    const result = await this.callWithJson<{
      topic: string;
      difficulty: string;
      questions: Array<{
        id?: string;
        question: string;
        options: Record<string, string>;
        correctAnswer: string;
        explanation: string;
        bloomsLevel: string;
        tags: string[];
      }>;
    }>(QUIZ_SYSTEM_PROMPT, userPrompt, this.contentModel, 0.7);

    // Assign UUIDs to questions
    result.questions = result.questions.map((q) => ({ ...q, id: uuidv4() }));

    // Persist
    const saved = await this.prisma.quiz.create({
      data: {
        title: `Quiz: ${dto.topic}`,
        topic: dto.topic,
        difficulty: dto.difficulty ?? 'intermediate',
        timeLimit: dto.timeLimitSeconds,
        content: result,
      },
    });

    return { quizId: saved.id, ...result };
  }

  async findById(id: string) {
    return this.prisma.quiz.findUniqueOrThrow({ where: { id } });
  }
}
