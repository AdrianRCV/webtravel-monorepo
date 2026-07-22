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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
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

export async function getTripRequests(): Promise<TripRequest[]> {
  return fetchAPI<TripRequest[]>('/trip-requests');
}

export async function getTripRequestById(id: string): Promise<TripRequestDetail> {
  return fetchAPI<TripRequestDetail>(`/trip-requests/${id}`);
}

export async function updateTripRequestStatus(
  id: string,
  status: TripStatus
): Promise<TripRequest> {
  return fetchAPI<TripRequest>(`/trip-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getItinerariesByTripRequest(
  tripRequestId: string
): Promise<ItineraryWithDays[]> {
  return fetchAPI<ItineraryWithDays[]>(`/itineraries/trip-request/${tripRequestId}/all`);
}

export async function getActiveItinerary(
  tripRequestId: string
): Promise<ItineraryWithDays | null> {
  try {
    return await fetchAPI<ItineraryWithDays>(`/itineraries/trip-request/${tripRequestId}`);
  } catch (error) {
    return null;
  }
}

export async function updateItineraryStatus(
  id: string,
  isActive: boolean
): Promise<Itinerary> {
  return fetchAPI<Itinerary>(`/itineraries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
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

export async function createChatSession(): Promise<ChatSessionWithMessages> {
  return fetchAPI<ChatSessionWithMessages>('/chat/sessions', {
    method: 'POST',
  });
}

export async function getChatSession(sessionId: string): Promise<ChatSessionWithMessages> {
  return fetchAPI<ChatSessionWithMessages>(`/chat/sessions/${sessionId}`);
}

export async function sendChatMessage(
  sessionId: string,
  content: string
): Promise<SendMessageResponse> {
  return fetchAPI<SendMessageResponse>(`/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
