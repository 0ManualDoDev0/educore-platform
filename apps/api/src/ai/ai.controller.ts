import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('conversations')
  create(@Body() dto: CreateConversationDto, @CurrentUser() user: any) {
    return this.aiService.createConversation(user.id, dto);
  }

  @Get('conversations')
  findAll(@CurrentUser() user: any) {
    return this.aiService.getConversations(user.id);
  }

  @Get('conversations/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.aiService.getConversation(id, user.id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @CurrentUser() user: any) {
    return this.aiService.sendMessage(id, user.id, dto);
  }

  @Delete('conversations/:id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.aiService.deleteConversation(id, user.id);
  }
}
