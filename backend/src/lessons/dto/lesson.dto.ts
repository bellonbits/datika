import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to SQL' })
  @IsString()
  title: string;

  @ApiProperty({ enum: LessonType, example: LessonType.VIDEO })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPreview?: boolean = false;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  aiNotesId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  quizId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  assignmentId?: string;
}

export class UpdateLessonDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: LessonType })
  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;
}
