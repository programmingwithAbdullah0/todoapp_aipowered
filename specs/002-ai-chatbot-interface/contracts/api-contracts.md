# API Contracts: AI Chatbot Interface

**Feature**: AI Chatbot Interface
**Date**: 2026-01-13
**Status**: Draft

## Overview

This document defines the API contracts for the AI Chatbot Interface, specifying the endpoints, request/response formats, authentication, and error handling patterns.

## Base URL

All endpoints are relative to the existing application base URL.

## Authentication

All chat endpoints require JWT authentication using the existing token format:
- Header: `Authorization: Bearer {jwt_token}`
- Token validation follows existing application patterns
- User ID in token must match the {user_id} in the endpoint path

## Endpoints

### POST /api/{user_id}/chat

Initiates or continues a conversation with the AI assistant.

#### Request

**Path Parameters**:
- `user_id` (string, required): The ID of the user making the request. Must match the authenticated user's ID.

**Headers**:
- `Authorization` (string, required): Bearer token for authentication
- `Content-Type` (string, required): `application/json`

**Body** (application/json):
```json
{
  "message": "Hello, how can you help me?",
  "conversation_id": 123
}
```

**Body Properties**:
- `message` (string, required): The message content from the user
  - Minimum length: 1 character
  - Maximum length: 10,000 characters
- `conversation_id` (integer, optional): ID of an existing conversation to continue
  - If omitted, a new conversation will be created

#### Response

**Success Response (200 OK)**:
```json
{
  "conversation_id": 123,
  "response": "Hello! I'm your todo assistant. I can help you manage your tasks through natural conversation.",
  "timestamp": "2026-01-13T10:30:00.123Z"
}
```

**Response Properties**:
- `conversation_id` (integer): The ID of the conversation (newly created or existing)
- `response` (string): The AI assistant's response to the user's message
- `timestamp` (string): ISO 8601 formatted timestamp of when the response was generated

#### Error Responses

**401 Unauthorized**:
- Occurs when JWT token is invalid, expired, or user_id doesn't match token
- Body:
```json
{
  "detail": "Unauthorized"
}
```

**404 Not Found**:
- Occurs when conversation_id is provided but the conversation doesn't exist or doesn't belong to the user
- Body:
```json
{
  "detail": "Conversation not found"
}
```

**429 Too Many Requests**:
- Occurs when user exceeds rate limit (more than 10 messages per minute)
- Body:
```json
{
  "detail": "Too many requests"
}
```

**500 Internal Server Error**:
- Occurs when the AI service is unavailable or generates an error
- Body:
```json
{
  "detail": "Sorry, I'm having trouble thinking right now. Please try again.",
  "timestamp": "2026-01-13T10:30:00.123Z"
}
```

### GET /api/{user_id}/conversations/{conversation_id}

Retrieves the history of messages for a specific conversation.

#### Request

**Path Parameters**:
- `user_id` (string, required): The ID of the user making the request
- `conversation_id` (integer, required): The ID of the conversation to retrieve

**Headers**:
- `Authorization` (string, required): Bearer token for authentication

#### Response

**Success Response (200 OK)**:
```json
{
  "conversation_id": 123,
  "messages": [
    {
      "id": 456,
      "role": "user",
      "content": "Hello, how can you help me?",
      "timestamp": "2026-01-13T10:25:00.123Z"
    },
    {
      "id": 457,
      "role": "assistant",
      "content": "Hello! I'm your todo assistant...",
      "timestamp": "2026-01-13T10:25:02.456Z"
    }
  ],
  "total_count": 2
}
```

**Response Properties**:
- `conversation_id` (integer): The ID of the conversation
- `messages` (array): Array of message objects in chronological order
- `total_count` (integer): Total number of messages in the conversation

**Message Object Properties**:
- `id` (integer): Unique identifier for the message
- `role` (string): Either "user" or "assistant"
- `content` (string): The message content
- `timestamp` (string): ISO 8601 formatted timestamp

#### Error Responses

**401 Unauthorized**: Same as above
**404 Not Found**: Same as above (conversation not found)

### GET /api/{user_id}/conversations

Retrieves a list of user's conversations.

#### Request

**Path Parameters**:
- `user_id` (string, required): The ID of the user making the request

**Headers**:
- `Authorization` (string, required): Bearer token for authentication

**Query Parameters**:
- `limit` (integer, optional): Number of conversations to return (default: 20, max: 100)
- `offset` (integer, optional): Number of conversations to skip (for pagination)

#### Response

**Success Response (200 OK)**:
```json
{
  "conversations": [
    {
      "id": 123,
      "created_at": "2026-01-13T10:25:00.123Z",
      "updated_at": "2026-01-13T10:30:00.456Z",
      "last_message_preview": "Can you help me with my tasks?"
    }
  ],
  "total_count": 1
}
```

**Response Properties**:
- `conversations` (array): Array of conversation objects
- `total_count` (integer): Total number of conversations for the user

**Conversation Object Properties**:
- `id` (integer): Unique identifier for the conversation
- `created_at` (string): ISO 8601 formatted timestamp of creation
- `updated_at` (string): ISO 8601 formatted timestamp of last update
- `last_message_preview` (string): Preview of the last message in the conversation

## Common Error Handling

### Rate Limiting
- Applied at 10 requests per minute per user
- Implemented using in-memory sliding window counter
- Returns 429 status with appropriate error message

### AI Service Errors
- When Gemini API is unavailable or returns an error
- Returns 500 status with user-friendly message
- Logs technical details for debugging

### Validation Errors
- Invalid input parameters return 422 status with details
- Malformed JSON returns 400 status

## Headers

All responses include:
- `Content-Type: application/json`
- Standard CORS headers (following existing application patterns)
- Cache-control headers as appropriate

## Request/Response Examples

### Starting a New Conversation

**Request**:
```
POST /api/user_abc123/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Hello, what can you do?"
}
```

**Response**:
```
Status: 200 OK
Content-Type: application/json

{
  "conversation_id": 456,
  "response": "Hello! I'm your todo assistant. I can help you manage your tasks through natural conversation. You can ask me about your tasks, add new ones, or get suggestions.",
  "timestamp": "2026-01-13T10:30:00.123Z"
}
```

### Continuing an Existing Conversation

**Request**:
```
POST /api/user_abc123/chat
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Tell me about my tasks",
  "conversation_id": 456
}
```

**Response**:
```
Status: 200 OK
Content-Type: application/json

{
  "conversation_id": 456,
  "response": "I don't have access to your specific tasks, but I can help you manage them. You can tell me what tasks you need to do, and I can help you organize them.",
  "timestamp": "2026-01-13T10:31:00.456Z"
}
```