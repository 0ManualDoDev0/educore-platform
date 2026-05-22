import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsEnum(ContentType)
  contentType?: ContentType;
}
