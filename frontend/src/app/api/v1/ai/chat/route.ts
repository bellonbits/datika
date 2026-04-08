import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { prisma } from '@/lib/db/prisma';
import { getAuthUser, unauthorized, ok, err } from '@/lib/db/auth';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL_CONTENT ?? 'meta-llama/llama-4-scout-17b-16e-instruct';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const { message, sessionId, courseContext } = await req.json();
    if (!message?.trim()) return err('Message is required');

    // Get or create session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: auth.sub,
          title: message.slice(0, 60),
        },
      });
    }

    // Load recent history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: `You are Datika AI Tutor, an expert data science and machine learning tutor. You help students learn Python, SQL, Machine Learning, and Data Science concepts. Be concise, practical, and use examples. ${courseContext ? `Current course context: ${courseContext}` : ''}`,
      },
      ...history.map((m) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';

    // Save both messages
    await prisma.chatMessage.createMany({
      data: [
        { sessionId: session.id, role: 'user', content: message },
        { sessionId: session.id, role: 'assistant', content: reply, tokens: completion.usage?.completion_tokens },
      ],
    });

    // Update session timestamp
    await prisma.chatSession.update({ where: { id: session.id }, data: { updatedAt: new Date() } });

    return ok({ reply, sessionId: session.id });
  } catch (e) {
    console.error('[ai/chat]', e);
    return err('AI response failed', 500);
  }
}
