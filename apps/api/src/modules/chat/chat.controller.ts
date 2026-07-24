import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  async createSession(@Headers('authorization') authHeader?: string) {
    const userId = this.chatService.extractUserId(authHeader);
    return this.chatService.createChatSession(userId);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    return this.chatService.getChatSession(id);
  }

  @Post('sessions/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = this.chatService.extractUserId(authHeader);
    return this.chatService.sendMessage(id, sendMessageDto.content, userId);
  }
}
