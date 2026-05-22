import { IsString, IsNumber } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsNumber()
  order: number;
}
