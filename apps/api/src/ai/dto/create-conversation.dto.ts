import { IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
