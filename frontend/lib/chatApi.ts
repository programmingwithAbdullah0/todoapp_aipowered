import apiClient from './api';

export interface ChatRequest {
  message: string;
  conversation_id?: number;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  timestamp: string;
}

export interface Message {
  id: number | string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationHistoryResponse {
  conversation_id: number;
  messages: Message[];
  total_count: number;
}

/**
 * Send a message to the chat API and receive a response
 */
export async function sendMessage(
  message: string,
  history: Message[],
  conversationId?: number
): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/chat', {
    message,
    conversation_id: conversationId,
    history: history.map(msg => ({ role: msg.role, content: msg.content }))
  });
  return response.data;
}

/**
 * Get conversation history
 */
export async function getConversationHistory(
  userId: string,
  conversationId: number
): Promise<ConversationHistoryResponse> {
  const response = await apiClient.get<ConversationHistoryResponse>(
    `/${userId}/conversations/${conversationId}`
  );
  return response.data;
}

/**
 * Get list of user's conversations
 */
export async function getUserConversations(
  userId: string,
  limit?: number,
  offset?: number
): Promise<{
  conversations: Array<{
    id: number;
    created_at: string;
    updated_at: string;
    last_message_preview: string;
  }>;
  total_count: number;
}> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const queryString = params.toString();
  const url = queryString ?
    `/${userId}/conversations?${queryString}` :
    `/${userId}/conversations`;

  const response = await apiClient.get(url);
  return response.data;
}