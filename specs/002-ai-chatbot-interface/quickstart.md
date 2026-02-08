# Quickstart Guide: AI Chatbot Interface

**Feature**: AI Chatbot Interface
**Date**: 2026-01-13
**Status**: Draft

## Overview

This guide provides instructions for setting up, configuring, and running the AI Chatbot Interface feature. Follow these steps to get the chatbot running in your development environment.

## Prerequisites

- Python 3.11+ (for backend)
- Node.js 18+ (for frontend)
- PostgreSQL database (with existing todo app tables)
- Google AI Studio account for Gemini API key
- Existing todo application with JWT authentication

## Setup Steps

### 1. Environment Configuration

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install required Python packages:
   ```bash
   pip install google-generativeai openai sqlmodel fastapi
   ```

3. Set up environment variables in `.env`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://user:password@localhost/dbname
   BETTER_AUTH_SECRET=your_existing_secret
   ```

4. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Database Setup

1. Run the migration to create new tables:
   ```bash
   python -m backend.migrations.add_chat_tables
   ```

2. Verify the tables were created:
   - `conversations` table with fields: id, user_id, created_at, updated_at
   - `messages` table with fields: id, conversation_id, user_id, role, content, created_at

### 3. Backend Implementation

1. Create the required files:
   - `backend/src/models/conversation.py` - Data models
   - `backend/src/agents/agent_factory.py` - AI agent with Gemini provider
   - `backend/src/api/chat_router.py` - Chat API endpoints
   - `backend/src/middleware/rate_limit.py` - Rate limiting

2. Register the chat router in your main FastAPI application:
   ```python
   from backend.src.api.chat_router import router as chat_router
   app.include_router(chat_router)
   ```

### 4. Frontend Implementation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install required packages:
   ```bash
   npm install framer-motion
   ```

3. Create the chat components:
   - `src/components/chat/ChatWidget.tsx` - Floating chat button
   - `src/components/chat/ChatWindow.tsx` - Main chat interface
   - `src/components/chat/ChatMessage.tsx` - Individual message display
   - `src/components/chat/ChatInput.tsx` - Message input field
   - `src/components/chat/TypingIndicator.tsx` - AI thinking indicator

4. Add the ChatWidget to your main layout component

5. Update Tailwind CSS config with animation:
   ```javascript
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         animation: {
           'slide-up': 'slideUp 0.3s ease-in-out',
         },
         keyframes: {
           slideUp: {
             '0%': { transform: 'translateY(100%)', opacity: '0' },
             '100%': { transform: 'translateY(0)', opacity: '1' },
           },
         },
       },
     },
   }
   ```

### 5. API Integration

1. Create the chat API client:
   - `src/lib/chatApi.ts` - Functions for sending messages and retrieving history

2. Implement the API endpoints in the backend with:
   - JWT authentication validation
   - Conversation creation/retrieval
   - Message saving to database
   - AI response generation
   - Rate limiting

### 6. Testing

#### Unit Tests
1. Test the AI agent creation and response generation
2. Test the database models and operations
3. Test the API endpoints with mock data

#### Integration Tests
1. Test the full flow: user message → AI response → database save
2. Test JWT authentication with valid and invalid tokens
3. Test rate limiting functionality
4. Test conversation history loading

#### Manual Testing
1. Click the floating chat button - it should slide up smoothly
2. Send a message like "Hello" - AI should respond within 3 seconds
3. Send multiple messages - conversation context should be maintained
4. Close and reopen chat - history should load
5. Test rate limiting by sending 11 messages quickly
6. Test with expired JWT - should redirect to login
7. Test on mobile devices - chat should expand full screen

## Configuration Options

### Performance Settings
- Adjust animation duration in CSS (default: 300ms)
- Modify rate limiting threshold (default: 10 messages/minute)
- Change message history limit (default: 50 messages)

### AI Settings
- Change Gemini model (default: gemini-1.5-flash)
- Adjust temperature/settings in agent configuration
- Modify system prompt instructions

## Troubleshooting

### Common Issues

#### API Key Issues
- **Problem**: "Invalid API key" error
- **Solution**: Verify GEMINI_API_KEY is set correctly in environment variables

#### Authentication Issues
- **Problem**: 401 Unauthorized errors
- **Solution**: Ensure JWT token is being sent correctly in Authorization header

#### Database Issues
- **Problem**: Table not found errors
- **Solution**: Run the migration script to create required tables

#### Rate Limiting Issues
- **Problem**: Getting 429 errors too frequently
- **Solution**: Check rate limiting configuration and adjust as needed

#### Frontend Animation Issues
- **Problem**: Chat window not animating properly
- **Solution**: Verify Tailwind CSS configuration and class names

### Debugging Tips

1. Check backend logs for detailed error messages
2. Use browser developer tools to inspect network requests
3. Verify environment variables are loaded correctly
4. Test API endpoints directly using curl or Postman
5. Check database connectivity and table structures

## Deployment

### Environment Variables
Ensure the following are set in your production environment:
- `GEMINI_API_KEY`
- `DATABASE_URL`
- Existing authentication secrets

### Database Migration
Run the migration script on your production database before deploying.

### Frontend Build
The chat components will be bundled with the existing application during the normal build process.

## Next Steps

1. Complete the full implementation following the tasks.md
2. Add error monitoring and logging
3. Implement analytics for chat usage
4. Add more sophisticated AI capabilities in Phase 2