import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private anthropic: Anthropic;

  constructor(private prisma: PrismaService) {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async createConversation(userId: string, dto: CreateConversationDto) {
    return this.prisma.aiConversation.create({
      data: {
        userId,
        courseId: dto.courseId,
        title: dto.title || 'Nova conversa',
      },
    });
  }

  async getConversations(userId: string) {
    return this.prisma.aiConversation.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('Conversa não encontrada');
    return conversation;
  }

  async sendMessage(conversationId: string, userId: string, dto: SendMessageDto) {
    const conversation = await this.getConversation(conversationId, userId);

    await this.prisma.aiMessage.create({
      data: { conversationId, role: 'user', content: dto.content },
    });

    let systemPrompt = `Você é o EduTutor, um assistente educacional inteligente da plataforma EduCore.
Seu objetivo é ajudar alunos a aprender de forma eficaz.
Você pode:
- Responder dúvidas sobre o conteúdo do curso
- Explicar conceitos de forma clara e didática
- Criar exercícios e quizzes personalizados
- Resumir aulas e módulos
- Sugerir trilhas de aprendizagem
Seja sempre encorajador, claro e objetivo. Responda em português brasileiro.`;

    if (conversation.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: conversation.courseId },
        include: { modules: { include: { lessons: true } } },
      });

      if (course) {
        systemPrompt += `\n\nVocê está auxiliando no curso: "${course.title}".`;
        if (course.modules.length > 0) {
          const moduleList = course.modules
            .map((m) => `- ${m.title}: ${m.lessons.map((l) => l.title).join(', ')}`)
            .join('\n');
          systemPrompt += `\n\nConteúdo do curso:\n${moduleList}`;
        }
      }
    }

    const history = conversation.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
    history.push({ role: 'user', content: dto.content });

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: history,
    });

    const assistantContent =
      response.content[0].type === 'text' ? response.content[0].text : '';

    const assistantMessage = await this.prisma.aiMessage.create({
      data: { conversationId, role: 'assistant', content: assistantContent },
    });

    await this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return {
      message: assistantMessage,
      usage: response.usage,
    };
  }

  async deleteConversation(id: string, userId: string) {
    await this.getConversation(id, userId);
    return this.prisma.aiConversation.delete({ where: { id } });
  }
}
