import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser, CurrentUserData } from '../auth/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  async listMySessions(@CurrentUser() user: CurrentUserData) {
    return this.chatService.getMySessions(user.id);
  }

  @Public()
  @Post('sessions')
  async createSession(@Headers('authorization') authHeader?: string) {
    const userId = this.chatService.extractUserId(authHeader);
    return this.chatService.createChatSession(userId);
  }

  @Public()
  @Get('sessions/:id')
  async getSession(
    @Param('id') id: string,
    @Headers('authorization') authHeader?: string,
  ) {
    const userId = this.chatService.extractUserId(authHeader);
    return this.chatService.getChatSession(id, userId);
  }

  @Public()
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
