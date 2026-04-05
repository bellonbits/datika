import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBaseService } from '../ai-base.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GradeSubmissionDto } from '../dto/ai.dto';

const GRADING_SYSTEM_PROMPT = `
You are an expert evaluator for a data science learning platform.
Assess student submissions objectively, constructively, and precisely.

GRADING STANDARDS:
- SQL: Correctness 40%, Efficiency 25%, Readability 20%, Edge cases 15%
- Python: Correctness 40%, Code quality 25%, Efficiency 20%, Documentation 15%
- Written: Accuracy 40%, Depth 30%, Structure 20%, Evidence 10%

GRADE SCALE:
- 90-100: A (Pass)
- 75-89: B (Pass)
- 60-74: C (Pass)
- 45-59: D (Fail)
- 0-44: F (Fail)

TONE: Formal, constructive, specific. Never dismissive. Reference exact lines/statements.

OUTPUT SCHEMA (strict JSON):
{
  "score": number,
  "grade": "A|B|C|D|F",
  "passed": boolean,
  "evaluation": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"],
    "detailedFeedback": "string (200-400 words)"
  },
  "rubricBreakdown": [
    {"criterion": "string", "maxScore": number, "earnedScore": number, "comment": "string"}
  ],
  "codeReview": {
    "correctness": number,
    "efficiency": number,
    "readability": number,
    "comments": ["string"]
  },
  "recommendedResources": ["string"]
}
`;

@Injectable()
export class GradingService extends AiBaseService {
  constructor(
    protected readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super(config);
  }

  async gradeSubmission(dto: GradeSubmissionDto) {
    const userPrompt = `
Evaluate the following student submission:

Assignment/Task: ${dto.taskDescription}
Submission Type: ${dto.submissionType}
Expected Output: ${dto.expectedOutput ?? 'Not specified'}

STUDENT SUBMISSION:
\`\`\`${dto.submissionType === 'sql' ? 'sql' : dto.submissionType === 'python' ? 'python' : 'text'}
${dto.submission}
\`\`\`

${dto.rubric ? `RUBRIC:\n${JSON.stringify(dto.rubric, null, 2)}` : ''}

Provide a thorough, fair evaluation following the grading standards.
    `;

    const result = await this.callWithJson<{
      score: number;
      grade: string;
      passed: boolean;
      evaluation: {
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
        detailedFeedback: string;
      };
      rubricBreakdown: Array<{
        criterion: string;
        maxScore: number;
        earnedScore: number;
        comment: string;
      }>;
      codeReview: {
        correctness: number;
        efficiency: number;
        readability: number;
        comments: string[];
      };
      recommendedResources: string[];
    }>(GRADING_SYSTEM_PROMPT, userPrompt, this.gradingModel, 0.3);

    // Update submission record if provided
    if (dto.submissionId) {
      await this.prisma.submission.update({
        where: { id: dto.submissionId },
        data: {
          score: result.score,
          grade: result.grade,
          feedback: result,
          status: 'GRADED',
          gradedAt: new Date(),
        },
      });
    }

    return result;
  }
}
