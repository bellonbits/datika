import {
  IsString, IsOptional, IsNumber, IsArray, IsEnum,
  IsUrl, Min, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'SQL for Data Analysis' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn SQL from basics to advanced analytics queries' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 4999 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: ['sql', 'data analysis', 'postgresql'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  thumbnail?: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ enum: CourseStatus })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  thumbnail?: string;
}

export class CreateSectionDto {
  @ApiProperty({ example: 'Introduction to SQL' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;
}
