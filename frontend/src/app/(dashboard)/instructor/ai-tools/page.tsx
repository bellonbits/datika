'use client';

import { useState } from 'react';
import {
  Card, Tabs, Form, Input, Select, Button, Slider, Alert, Typography,
  Space, Divider, Tag, Spin,
} from 'antd';
import {
  RobotOutlined, FileTextOutlined, QuestionCircleOutlined,
  CheckCircleOutlined, CopyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiApi } from '@/lib/api/ai.api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

type NotesResult = {
  title?: string;
  abstract?: string;
  keywords?: string[];
  sections?: Array<{
    heading?: string;
    content?: string;
    subsections?: Array<{ heading?: string; content?: string }>;
  }>;
  conclusion?: string;
  references?: Array<{ citation?: string }>;
};

type QuizResult = {
  topic?: string;
  questions?: Array<{
    id?: string;
    question?: string;
    options?: Record<string, string>;
    correctAnswer?: string;
    explanation?: string;
    bloomsLevel?: string;
  }>;
};

export default function AiToolsPage() {
  const [notesForm] = Form.useForm();
  const [quizForm] = Form.useForm();
  const [notesResult, setNotesResult] = useState<NotesResult | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateNotes = async (values: Record<string, unknown>) => {
    setLoadingNotes(true);
    setError(null);
    try {
      const res = await aiApi.generateNotes(values as { topic: string; level?: string; context?: string });
      setNotesResult((res as { data: NotesResult })?.data ?? res as NotesResult);
    } catch {
      setError('Failed to generate notes. Please try again.');
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerateQuiz = async (values: Record<string, unknown>) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const res = await aiApi.generateQuiz(values as { topic: string; content: string; questionCount?: number });
      setQuizResult((res as { data: QuizResult })?.data ?? res as QuizResult);
    } catch {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabItems = [
    {
      key: 'notes',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Academic Notes
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="border-gray-100 shadow-sm">
            <Title level={5} className="mb-4">Generate Academic Notes</Title>
            <Form form={notesForm} layout="vertical" onFinish={handleGenerateNotes}>
              <Form.Item name="topic" label="Topic" rules={[{ required: true, message: 'Enter a topic' }]}>
                <Input placeholder="e.g., Exploratory Data Analysis with Python" size="large" />
              </Form.Item>
              <Form.Item name="subject" label="Subject Area">
                <Input placeholder="e.g., Data Science" defaultValue="Data Science" />
              </Form.Item>
              <Form.Item name="level" label="Difficulty Level" initialValue="intermediate">
                <Select size="large">
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">Intermediate</Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="context" label="Additional Context (optional)">
                <TextArea rows={3} placeholder="e.g., Focus on pandas, include Kenya data examples..." />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loadingNotes}
                icon={<RobotOutlined />}
              >
                {loadingNotes ? 'Generating (this may take 20–40s)...' : 'Generate Notes'}
              </Button>
            </Form>
          </Card>

          {/* Result */}
          <Card className="border-gray-100 shadow-sm overflow-auto max-h-screen">
            {loadingNotes ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Spin size="large" />
                <Text className="text-gray-500">AI is writing your academic notes...</Text>
              </div>
            ) : notesResult ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Title level={5} className="mb-0 text-green-600 flex items-center gap-2">
                    <CheckCircleOutlined /> Notes Generated
                  </Title>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(JSON.stringify(notesResult, null, 2))}
                  >
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                </div>
                <div className="prose-academic">
                  <Title level={4}>{notesResult.title}</Title>
                  {notesResult.abstract && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                      <Text strong>Abstract: </Text>
                      <Paragraph className="mt-1 mb-0 text-gray-600">{notesResult.abstract}</Paragraph>
                    </div>
                  )}
                  {notesResult.keywords && (
                    <Space wrap className="mb-4">
                      {notesResult.keywords.map((k: string) => <Tag key={k} color="blue">{k}</Tag>)}
                    </Space>
                  )}
                  {notesResult.sections?.map((section) => (
                    <div key={section.heading} className="mb-6">
                      <Title level={5}>{section.heading}</Title>
                      <Paragraph className="text-gray-700">{section.content}</Paragraph>
                      {section.subsections?.map((sub) => (
                        <div key={sub.heading} className="ml-4 mb-3">
                          <Text strong>{sub.heading}</Text>
                          <Paragraph className="text-gray-600 mt-1">{sub.content}</Paragraph>
                        </div>
                      ))}
                    </div>
                  ))}
                  {notesResult.conclusion && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Text strong>Conclusion:</Text>
                      <Paragraph className="mt-1 mb-0">{notesResult.conclusion}</Paragraph>
                    </div>
                  )}
                  {notesResult.references && notesResult.references.length > 0 && (
                    <div className="mt-4">
                      <Divider />
                      <Text strong>References</Text>
                      <ol className="mt-2 text-sm text-gray-600 space-y-1">
                        {notesResult.references.map((ref, i) => (
                          <li key={i}>{ref.citation}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FileTextOutlined className="text-5xl mb-4" />
                <Text className="text-gray-400">Generated notes will appear here</Text>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'quiz',
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          Quiz Generator
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-100 shadow-sm">
            <Title level={5} className="mb-4">Generate Quiz Questions</Title>
            <Form form={quizForm} layout="vertical" onFinish={handleGenerateQuiz}>
              <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
                <Input placeholder="e.g., SQL JOIN operations" size="large" />
              </Form.Item>
              <Form.Item name="content" label="Lesson Content" rules={[{ required: true, message: 'Paste lesson content' }]}>
                <TextArea rows={5} placeholder="Paste the lesson content or summary to generate questions from..." />
              </Form.Item>
              <Form.Item name="difficulty" label="Difficulty" initialValue="intermediate">
                <Select size="large">
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">Intermediate</Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="questionCount" label="Number of Questions" initialValue={10}>
                <Slider min={5} max={20} marks={{ 5: '5', 10: '10', 15: '15', 20: '20' }} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loadingQuiz}
                icon={<RobotOutlined />}
              >
                {loadingQuiz ? 'Generating...' : 'Generate Quiz'}
              </Button>
            </Form>
          </Card>

          <Card className="border-gray-100 shadow-sm overflow-auto max-h-screen">
            {loadingQuiz ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Spin size="large" />
                <Text className="text-gray-500">AI is creating your quiz...</Text>
              </div>
            ) : quizResult ? (
              <div>
                <Title level={5} className="text-green-600 flex items-center gap-2 mb-4">
                  <CheckCircleOutlined /> {quizResult.questions?.length} Questions Generated
                </Title>
                {quizResult.questions?.map((q, i) => (
                  <Card key={q.id ?? i} size="small" className="mb-3 border-gray-100">
                    <Text strong className="text-sm">Q{i + 1}. {q.question}</Text>
                    <div className="mt-2 space-y-1">
                      {q.options && Object.entries(q.options).map(([k, v]) => (
                        <div
                          key={k}
                          className={`text-sm px-2 py-1 rounded ${k === q.correctAnswer ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600'}`}
                        >
                          {k}. {v}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-700">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                    <Tag color="purple" className="mt-2 text-xs">{q.bloomsLevel}</Tag>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <QuestionCircleOutlined className="text-5xl mb-4" />
                <Text className="text-gray-400">Generated questions will appear here</Text>
              </div>
            )}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <RobotOutlined className="text-purple-600 text-xl" />
          </div>
          <div>
            <Title level={3} className="mb-0">AI Content Studio</Title>
            <Text className="text-gray-500">Generate academic notes, quizzes, and assignments</Text>
          </div>
        </div>
      </motion.div>

      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" closable onClose={() => setError(null)} />
      )}

      <Tabs items={tabItems} size="large" />
    </div>
  );
}
