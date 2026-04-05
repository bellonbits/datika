import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiBaseService } from '../ai-base.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatMessageDto } from '../dto/ai.dto';

const CHAT_SYSTEM_PROMPT = `
You are Datika AI Tutor, an expert assistant for a data science and data analysis learning platform.

ROLE:
- Help students understand data science concepts, SQL, Python, pandas, NumPy, and ML
- Explain errors in student code clearly
- Suggest improvements to analytical approaches
- Answer questions about course content

CONSTRAINTS:
- Stay within the domain of data science, data analysis, statistics, and programming
- Do not answer questions unrelated to the course domain
- Use formal but approachable language
- Provide working code examples when relevant
- Cite course concepts when applicable

RESPONSE FORMAT:
- Clear, structured answers
- Code blocks with proper syntax highlighting markers
- Step-by-step explanations where needed
`;

@Injectable()
export class ChatService extends AiBaseService {
  constructor(
    protected readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super(config);
  }

  async sendMessage(dto: ChatMessageDto, userId: string): Promise<{
    sessionId: string;
    response: string;
    tokensUsed: number;
  }> {
    // Get or create session
    let session = dto.sessionId
      ? await this.prisma.chatSession.findUnique({
          where: { id: dto.sessionId },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
        })
      : null;

    if (!session) {
      session = await this.prisma.chatSession.create({
        data: {
          userId,
          courseId: dto.courseId,
          title: dto.message.slice(0, 60),
          messages: { create: [] },
        },
        include: { messages: true },
      });
    }

    // Build message history
    const history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
    ];

    if (dto.courseId && dto.courseContext) {
      history.push({
        role: 'system',
        content: `Current course context:\n${dto.courseContext}`,
      });
    }

    for (const msg of session.messages) {
      history.push({ role: msg.role as 'user' | 'assistant', content: msg.content });
    }
    history.push({ role: 'user', content: dto.message });

    // Call Groq
    const completion = await this.groq.chat.completions.create({
      model: this.gradingModel,
      messages: history,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantMessage = completion.choices[0]?.message?.content ?? '';
    const tokensUsed = completion.usage?.total_tokens ?? 0;

    // Persist both messages
    await this.prisma.chatMessage.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: dto.message },
        { sessionId: session.id, role: 'assistant', content: assistantMessage, tokens: tokensUsed },
      ],
    });

    return { sessionId: session.id, response: assistantMessage, tokensUsed };
  }

  async getSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, title: true, courseId: true, createdAt: true, updatedAt: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { content: true } },
      },
    });
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) throw new NotFoundException('Chat session not found');
    if (session.userId !== userId) throw new NotFoundException('Chat session not found');
    return session;
  }
}
