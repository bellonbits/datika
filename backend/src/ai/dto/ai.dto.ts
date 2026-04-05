import { IsString, IsOptional, IsNumber, IsEnum, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateNotesDto {
  @ApiProperty({ example: 'Exploratory Data Analysis with Python' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ example: 'Data Science' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' })
  @IsOptional()
  level?: 'beginner' | 'intermediate' | 'advanced';

  @ApiPropertyOptional({ example: 'Focus on pandas and matplotlib' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  additionalInstructions?: string;
}

export class GenerateQuizDto {
  @ApiProperty({ example: 'SQL JOINs and Aggregations' })
  @IsString()
  topic: string;

  @ApiProperty({ example: 'Full lesson content or summary here...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsOptional()
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  @ApiPropertyOptional({ example: 10, description: 'Number of questions (5–20)' })
  @IsNumber()
  @Min(5)
  @Max(20)
  @IsOptional()
  questionCount?: number;

  @ApiPropertyOptional({ example: 1800, description: 'Time limit in seconds' })
  @IsNumber()
  @IsOptional()
  timeLimitSeconds?: number;
}

export class GenerateAssignmentDto {
  @ApiProperty({ example: 'Data Cleaning and EDA on Retail Dataset' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsOptional()
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  @ApiPropertyOptional({ example: 'E-commerce sales data from Nairobi' })
  @IsString()
  @IsOptional()
  context?: string;
}

export class GradeSubmissionDto {
  @ApiProperty({ example: 'Write a SQL query to find top 5 customers by revenue' })
  @IsString()
  taskDescription: string;

  @ApiProperty({ example: 'SELECT customer_id, SUM(amount) FROM orders GROUP BY 1 LIMIT 5' })
  @IsString()
  submission: string;

  @ApiProperty({ enum: ['sql', 'python', 'written'] })
  @IsEnum(['sql', 'python', 'written'])
  submissionType: 'sql' | 'python' | 'written';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  expectedOutput?: string;

  @ApiPropertyOptional()
  @IsOptional()
  rubric?: Record<string, number>;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  submissionId?: string;
}

export class ChatMessageDto {
  @ApiProperty({ example: 'How does GROUP BY differ from PARTITION BY in SQL?' })
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional({ example: 'Module: SQL Window Functions' })
  @IsString()
  @IsOptional()
  courseContext?: string;
}
