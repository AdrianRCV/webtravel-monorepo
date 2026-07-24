import type { 
  TripRequest, 
  TripStatus, 
  Itinerary, 
  ItineraryDay, 
  ItineraryActivity,
  ChatMessage,
  ChatSession,
  User,
} from '@webtravel/shared-types';

const isServer = typeof window === 'undefined';

const API_URL = isServer 
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { accessToken?: string },
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers['Authorization'] = `Bearer ${options.accessToken}`;
  }

  const { accessToken, ...fetchOptions } = options || {};

  try {
    const response = await fetch(url, {
      headers: {
        ...headers,
        ...(fetchOptions.headers as Record<string, string>),
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al consumir ${endpoint}:`, error);
    throw error;
  }
}

export type ItineraryWithDays = Itinerary & {
  days: (ItineraryDay & {
    activities: ItineraryActivity[];
  })[];
};

export type TripRequestDetail = TripRequest & {
  chatSession: ChatSession & {
    messages: ChatMessage[];
    user: User;
  };
  itineraries: ItineraryWithDays[];
};

export async function getTripRequests(accessToken?: string): Promise<TripRequest[]> {
  return fetchAPI<TripRequest[]>('/trip-requests', { accessToken });
}

export async function getUsersCount(accessToken?: string): Promise<number> {
  const { count } = await fetchAPI<{ count: number }>('/users/count', { accessToken });
  return count;
}

export async function getTripRequestById(id: string, accessToken?: string): Promise<TripRequestDetail> {
  return fetchAPI<TripRequestDetail>(`/trip-requests/${id}`, { accessToken });
}

export async function updateTripRequestStatus(
  id: string,
  status: TripStatus,
  accessToken?: string,
): Promise<TripRequest> {
  return fetchAPI<TripRequest>(`/trip-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    accessToken,
  });
}

export async function getItinerariesByTripRequest(
  tripRequestId: string,
  accessToken?: string,
): Promise<ItineraryWithDays[]> {
  return fetchAPI<ItineraryWithDays[]>(`/itineraries/trip-request/${tripRequestId}/all`, { accessToken });
}

export async function getActiveItinerary(
  tripRequestId: string,
  accessToken?: string,
): Promise<ItineraryWithDays | null> {
  try {
    return await fetchAPI<ItineraryWithDays>(`/itineraries/trip-request/${tripRequestId}`, { accessToken });
  } catch (error) {
    return null;
  }
}

export async function updateItineraryStatus(
  id: string,
  isActive: boolean,
  accessToken?: string,
): Promise<Itinerary> {
  return fetchAPI<Itinerary>(`/itineraries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
    accessToken,
  });
}

export interface CreateItineraryPayload {
  tripRequestId: string;
  title: string;
  totalEstimatedPrice?: number;
  notes?: string;
  createdByAdminId?: string;
  days: {
    dayNumber: number;
    description?: string;
    activities: {
      type: 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'REST' | 'EVENT';
      title: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      estimatedPrice?: number;
      bookingLink?: string;
      bookingLinkText?: string;
      company?: string;
      address?: string;
      referenceNumber?: string;
    }[];
  }[];
}

export async function createItinerary(
  payload: CreateItineraryPayload,
  accessToken?: string,
): Promise<ItineraryWithDays> {
  return fetchAPI<ItineraryWithDays>('/itineraries', {
    method: 'POST',
    body: JSON.stringify(payload),
    accessToken,
  });
}

export async function updateItinerary(
  id: string,
  payload: Omit<CreateItineraryPayload, 'tripRequestId' | 'createdByAdminId'>,
  accessToken?: string,
): Promise<ItineraryWithDays> {
  return fetchAPI<ItineraryWithDays>(`/itineraries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    accessToken,
  });
}

export async function getItineraryById(id: string, accessToken?: string): Promise<ItineraryWithDays> {
  return fetchAPI<ItineraryWithDays>(`/itineraries/${id}`, { accessToken });
}

export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessage[];
  tripRequest?: TripRequest | null;
};

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  tripRequest?: TripRequest | null;
}

export async function createChatSession(accessToken?: string): Promise<ChatSessionWithMessages> {
  return fetchAPI<ChatSessionWithMessages>('/chat/sessions', {
    method: 'POST',
    accessToken,
  });
}

export async function getChatSession(sessionId: string, accessToken?: string): Promise<ChatSessionWithMessages> {
  return fetchAPI<ChatSessionWithMessages>(`/chat/sessions/${sessionId}`, { accessToken });
}

export async function sendChatMessage(
  sessionId: string,
  content: string,
  accessToken?: string,
): Promise<SendMessageResponse> {
  return fetchAPI<SendMessageResponse>(`/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    accessToken,
  });
}

export interface ChatSessionSummary {
  id: string;
  updatedAt: string;
  tripRequest: {
    id: string;
    destination: string | null;
    status: TripStatus;
  } | null;
  messages: ChatMessage[];
}

export async function getMyChatSessions(accessToken: string): Promise<ChatSessionSummary[]> {
  return fetchAPI<ChatSessionSummary[]>('/chat/sessions', { accessToken });
}
