import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SenderRole, TripRequest } from '@prisma/client';

interface ExtractedIntent {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  clientEmail?: string;
  hasIntent: boolean;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  extractUserId(authHeader?: string): string | undefined {
    if (!authHeader?.startsWith('Bearer ')) {
      return undefined;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(
        authHeader.slice('Bearer '.length),
      );
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  async createChatSession(userId?: string) {
    return this.prisma.chatSession.create({
      data: {
        status: 'OPEN',
        userId: userId || null,
        messages: {
          create: {
            sender: SenderRole.ASSISTANT,
            content:
              '¡Hola! Soy tu asistente de viajes. ¿A dónde te gustaría viajar?',
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getMySessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: {
        tripRequest: {
          select: {
            id: true,
            destination: true,
            status: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getChatSession(sessionId: string, userId?: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        tripRequest: true,
      },
    });

    if (!session || (session.userId && session.userId !== userId)) {
      throw new NotFoundException(
        `Chat session with ID ${sessionId} not found`,
      );
    }

    return session;
  }

  async sendMessage(sessionId: string, userMessage: string, userId?: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        tripRequest: true,
      },
    });

    if (!session || (session.userId && session.userId !== userId)) {
      throw new NotFoundException(
        `Chat session with ID ${sessionId} not found`,
      );
    }

    const extractedIntent = this.extractIntent(userMessage);

    return this.prisma.$transaction(async (tx) => {
      if (userId && !session.userId) {
        await tx.chatSession.update({
          where: { id: sessionId },
          data: { userId },
        });
      }

      const savedUserMessage = await tx.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          sender: SenderRole.USER,
          content: userMessage,
        },
      });

      let tripRequest = session.tripRequest;

      if (extractedIntent.hasIntent) {
        if (!tripRequest) {
          tripRequest = await tx.tripRequest.create({
            data: {
              chatSessionId: sessionId,
              status: 'PENDING',
              destination: extractedIntent.destination,
              startDate: extractedIntent.startDate,
              endDate: extractedIntent.endDate,
              budgetMin: extractedIntent.budgetMin,
              budgetMax: extractedIntent.budgetMax,
              clientEmail: extractedIntent.clientEmail,
            },
          });
        } else {
          tripRequest = await tx.tripRequest.update({
            where: { id: tripRequest.id },
            data: {
              destination:
                extractedIntent.destination || tripRequest.destination,
              startDate: extractedIntent.startDate || tripRequest.startDate,
              endDate: extractedIntent.endDate || tripRequest.endDate,
              budgetMin: extractedIntent.budgetMin || tripRequest.budgetMin,
              budgetMax: extractedIntent.budgetMax || tripRequest.budgetMax,
              clientEmail:
                extractedIntent.clientEmail || tripRequest.clientEmail,
            },
          });
        }
      }

      const assistantResponse = this.generateAssistantResponse(
        extractedIntent,
        tripRequest,
      );

      const savedAssistantMessage = await tx.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          sender: SenderRole.ASSISTANT,
          content: assistantResponse,
        },
      });

      return {
        userMessage: savedUserMessage,
        assistantMessage: savedAssistantMessage,
        tripRequest,
      };
    });
  }

  private extractIntent(message: string): ExtractedIntent {
    const intent: ExtractedIntent = { hasIntent: false };

    const destinationPatterns = [
      /(?:viajar a|ir a|visitar|conocer|destino)\s+([a-záéíóúñ\s]+?)(?:\.|,|$|\s+(?:del|en|desde|con|por))/i,
      /^([a-záéíóúñ\s]+?)(?:\s+(?:del|en|desde|con|por|parece))/i,
    ];

    for (const pattern of destinationPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        const destination = match[1].trim();
        if (destination.length > 2 && destination.length < 50) {
          intent.destination =
            destination.charAt(0).toUpperCase() + destination.slice(1);
          intent.hasIntent = true;
          break;
        }
      }
    }

    const datePattern =
      /(\d{1,2})[\s/-](?:de\s+)?(\w+)(?:[\s/-](?:de\s+)?(\d{2,4}))?/gi;
    const months: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };

    const dateMatches = Array.from(message.matchAll(datePattern));
    if (dateMatches.length >= 1 && dateMatches[0]) {
      const firstDate = dateMatches[0];
      const day = parseInt(firstDate[1] || '1');
      const monthStr = (firstDate[2] || '').toLowerCase();
      const year = firstDate[3] ? parseInt(firstDate[3]) : 2026;

      if (months[monthStr] !== undefined) {
        intent.startDate = new Date(year, months[monthStr], day);
        intent.hasIntent = true;

        if (dateMatches.length >= 2 && dateMatches[1]) {
          const secondDate = dateMatches[1];
          const day2 = parseInt(secondDate[1] || '1');
          const monthStr2 = (secondDate[2] || '').toLowerCase();
          const year2 = secondDate[3] ? parseInt(secondDate[3]) : year;

          if (months[monthStr2] !== undefined) {
            intent.endDate = new Date(year2, months[monthStr2], day2);
          }
        }
      }
    }

    const budgetPattern = /(\d+)[\s]*(?:€|euros?|dólares?|\$|usd)/i;
    const budgetMatches = Array.from(
      message.matchAll(new RegExp(budgetPattern, 'gi')),
    );

    if (budgetMatches.length > 0) {
      const amounts = budgetMatches
        .map((m) => parseInt(m[1] || '0'))
        .filter((a) => a > 0);
      if (amounts.length === 1 && amounts[0]) {
        intent.budgetMax = amounts[0];
        intent.budgetMin = Math.floor(amounts[0] * 0.7);
      } else if (amounts.length >= 2) {
        intent.budgetMin = Math.min(...amounts);
        intent.budgetMax = Math.max(...amounts);
      }
      intent.hasIntent = true;
    }

    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = message.match(emailPattern);
    if (emailMatch) {
      intent.clientEmail = emailMatch[0];
    }

    return intent;
  }

  private generateAssistantResponse(
    intent: ExtractedIntent,
    tripRequest: TripRequest | null,
  ): string {
    const responses: string[] = [];

    if (intent.destination) {
      responses.push(`¡**${intent.destination}** es un destino fantástico!`);
    }

    if (intent.startDate && intent.endDate) {
      const days = Math.ceil(
        (intent.endDate.getTime() - intent.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      responses.push(
        `He anotado tu viaje del **${intent.startDate.toLocaleDateString('es-ES')}** al **${intent.endDate.toLocaleDateString('es-ES')}** (${days} días).`,
      );
    } else if (intent.startDate) {
      responses.push(
        `Perfecto, he registrado tu fecha de inicio: **${intent.startDate.toLocaleDateString('es-ES')}**.`,
      );
    }

    if (intent.budgetMin && intent.budgetMax) {
      responses.push(
        `Tu presupuesto estimado es entre **${intent.budgetMin}€** y **${intent.budgetMax}€**.`,
      );
    }

    if (!tripRequest) {
      if (intent.hasIntent) {
        responses.push(
          'He creado tu solicitud de viaje. ¿Hay algo más que quieras contarme sobre tus preferencias?',
        );
      }
    } else {
      const missing: string[] = [];
      if (!tripRequest.destination && !intent.destination)
        missing.push('destino');
      if (!tripRequest.startDate && !intent.startDate)
        missing.push('fecha de inicio');
      if (!tripRequest.budgetMax && !intent.budgetMax)
        missing.push('presupuesto');
      if (!tripRequest.clientEmail && !intent.clientEmail)
        missing.push('email');

      if (missing.length > 0) {
        const missingList = missing.map((item) => `- ${item}`).join('\n');
        responses.push(
          `Para completar tu solicitud, me falta:\n${missingList}\n\n¿Puedes proporcionármelo?`,
        );
      } else {
        responses.push(
          '¡Excelente! Tengo toda la información necesaria. Nuestro equipo revisará tu solicitud y te preparará propuestas de itinerarios personalizados pronto.',
        );
      }
    }

    if (responses.length === 0) {
      return 'Entiendo. ¿Puedes darme más detalles sobre tu viaje? Por ejemplo: destino, fechas o presupuesto aproximado.';
    }

    return responses.join(' ');
  }
}
