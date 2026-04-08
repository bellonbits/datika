import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? 'meta-llama/llama-4-scout-17b-16e-instruct';

/**
 * Generate structured markdown notes for a lesson.
 */
export async function generateLessonNotes(
  lessonTitle: string,
  courseTitle: string,
  courseLevel: string,
): Promise<string> {
  try {
    const chat = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      max_tokens: 1200,
      messages: [
        {
          role: 'system',
          content: `You are an expert educational content writer. Write concise, well-structured lesson notes in Markdown.
Include: a brief intro, 3-5 key concepts with explanations, a practical example or code snippet if relevant, and 3 key takeaways.
Tailor the depth to the course level. Keep it under 600 words.`,
        },
        {
          role: 'user',
          content: `Course: "${courseTitle}" (${courseLevel} level)\nLesson: "${lessonTitle}"\n\nWrite the lesson notes.`,
        },
      ],
    });
    return chat.choices[0]?.message?.content ?? '';
  } catch (e) {
    console.error('[lesson-ai] notes generation failed:', lessonTitle, e);
    return `# ${lessonTitle}\n\nContent coming soon.`;
  }
}
