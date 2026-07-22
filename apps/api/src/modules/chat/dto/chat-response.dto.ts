import { ChatMessage, TripRequest } from '@webtravel/shared-types';

export interface SendMessageResponseDto {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  tripRequest?: TripRequest | null;
}

export interface ChatSessionResponseDto {
  id: string;
  status: string;
  messages: ChatMessage[];
  tripRequest?: TripRequest | null;
  createdAt: Date;
  updatedAt: Date;
}
