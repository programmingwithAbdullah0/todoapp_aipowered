---
id: 2
title: "Create AI Chatbot Interface Plan"
stage: "plan"
date_iso: "2026-01-13"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "ai-chatbot-interface"
branch: "002-ai-chatbot-interface"
user: "user"
command: "sp.plan"
labels: ["plan", "ai", "chatbot", "todo-app"]
links:
  spec: "specs/002-ai-chatbot-interface/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/002-ai-chatbot-interface/plan.md"
  - "specs/002-ai-chatbot-interface/research.md"
  - "specs/002-ai-chatbot-interface/data-model.md"
  - "specs/002-ai-chatbot-interface/contracts/api-contracts.md"
  - "specs/002-ai-chatbot-interface/quickstart.md"
tests_yaml: []
---

# Prompt Text
```
TECHNOLOGY STACK FOR CHATBOT INTEGRATION:

Frontend Additions:
- New ChatKit component in existing Next.js app
- Tailwind CSS for chat styling and animations
- React hooks: useState, useEffect for chat state
- Framer Motion or CSS transitions for animations
- WebSocket or HTTP polling for real-time messages (start with HTTP)

Backend Additions:
- New FastAPI route: /api/{user_id}/chat
- OpenAI Agents SDK (Swarm or base Agents)
- google-generativeai Python library for Gemini API
- SQLModel for new conversation/message tables
- Existing JWT middleware for authentication

AI Stack:
- Google Gemini API (gemini-1.5-flash model)
- OpenAI Agents SDK as framework
- Custom LLM provider to connect Agents SDK → Gemini
- System prompt: "You are a helpful assistant for a todo application"

Database Schema Additions:
- conversations table: (id, user_id, created_at, updated_at)
- messages table: (id, conversation_id, user_id, role, content, created_at)
- Indexes on conversation_id and user_id for fast queries

ARCHITECTUR
│   │   ├── ChatWidget.tsx       # Main floating component
│   │   ├── ChatWindow.tsx       # Expanded chat panel
│   │   ├── ChatMessage.tsx      # Single message bubble
│   │   ├── ChatInput.tsx        # Message input field
│   │   └── TypingIndicator.tsx  # AI thinking animation
│   └── [existing components]
├── lib/
│   ├── chatApi.ts               # NEW: Chat API client
│   └── [existing API client]
└── app/
    └── [existing pages with ChatWidget added to layout]
```

ChatWidget component approach:
```typescript
// components/chat/ChatWidget.tsx
'use client'

import { useState } from 'react'
import ChatWindow from './ChatWindow'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button - bottom-left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 left-5 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
        aria-label="Open chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window - slides up from button */}
      {isOpen && (
        <div className="fixed bottom-24 left-5 w-[400px] h-[600px] bg-white rounded-lg shadow-2xl animate-slide-up z-50">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}
```

Animation approach (Tailwind config):
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

BACKEND IMPLEMENTATION:

New route structure:
```python
# backend/routes/chat.py  (NEW FILE)
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from agents import create_agent  # OpenAI Agents SDK
from db.database import get_db
from models.conversation import Conversation, Message
from middleware.auth_middleware import verify_jwt

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    timestamp: str

@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user = Depends(verify_jwt),
    db = Depends(get_db)
):
    # 1. Verify user_id matches JWT
    if current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # 2. Get or create conversation
    if request.conversation_id:
        conversation = db.query(Conversation).filter_by(
            id=request.conversation_id,
            user_id=user_id
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        db.commit()

    # 3. Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # 4. Get conversation history
    history = db.query(Message).filter_by(
        conversation_id=conversation.id
    ).order_by(Message.created_at).all()

    # 5. Build message array for agent
    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in history
    ]

    # 6. Run agent
    agent = create_agent()  # We'll define this
    response_text = agent.run(messages)

    # 7. Save assistant response
    assistant_msg = Message(
        conversation_id=conversation.id,
        user_id=user_id,
        role="assistant",
        content=response_text
    )
    db.add(assistant_msg)
    db.commit()

    # 8. Return response
    return ChatResponse(
        conversation_id=conversation.id,
        response=response_text,
        timestamp=assistant_msg.created_at.isoformat()
    )
```

OPENAI AGENTS SDK WITH GEMINI:

Agent creation using Context7 MCP documentation:
```python
# backend/agents/agent_factory.py (NEW FILE)
import google.generativeai as genai
from openai import OpenAI  # Agents SDK might use this interface
import os

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def create_agent():
    """
    Create an agent using OpenAI Agents SDK with Gemini backend.

    Implementation will use Context7 MCP server docs:
    1. Use resolve-library-id to find openai-agents-sdk
    2. Use query-docs to understand agent initialization
    3. Adapt pattern to use Gemini instead of OpenAI
    """

    # Option 1: If Agents SDK supports custom LLM providers
    agent = Agent(
        name="todo-assistant",
        model="gemini-1.5-flash",  # Custom provider
        instructions="""
        You are a helpful assistant for a todo application.
        Be friendly, concise, and helpful.
        For now, you can only have conversations - you cannot manage tasks yet.
        """,
        provider=GeminiProvider()  # Custom provider class
    )

    # Option 2: If using Swarm pattern
    # (Context7 docs will clarify which approach)

    return agent

class GeminiProvider:
    """Custom LLM provider that wraps Gemini API"""

    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate(self, messages):
        # Convert messages to Gemini format
        prompt = self._build_prompt(messages)
        response = self.model.generate_content(prompt)
        return response.text

    def _build_prompt(self, messages):
        # Format conversation history for Gemini
        parts = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            parts.append(f"{role}: {msg['content']}")
        return "\n".join(parts)
```

DATABASE MODELS:

New SQLModel models:
```python
# backend/models/conversation.py (NEW FILE)
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    user_id: str = Field(foreign_key="users.id")
    role: str = Field()  # 'user' or 'assistant'
    content: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")
```

GEMINI API SETUP:

Environment variables:
```bash
# backend/.env
GEMINI_API_KEY=your-gemini-api-key-from-ai-studio
DATABASE_URL=existing-neon-connection
BETTER_AUTH_SECRET=existing-secret
ALLOWED_ORIGINS=existing-origins
```

Getting Gemini API key:
1. Visit https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key to .env file
5. Free tier: 15 requests/minute, 1500 requests/day

FRONTEND API CLIENT:

Chat API integration:
```typescript
// lib/chatApi.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function sendMessage(
  userId: string,
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  const token = getJWTToken() // From existing auth

  const response = await fetch(`${API_URL}/api/${userId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId
    })
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    throw new Error('Failed to send message')
  }

  return response.json()
}

export async function getConversationHistory(
  userId: string,
  conversationId: number
): Promise<Message[]> {
  const token = getJWTToken()

  const response = await fetch(
    `${API_URL}/api/${userId}/conversations/${conversationId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  )

  return response.json()
}
```

CONTEXT7 MCP USAGE IN CLAUDE CODE:

When implementing, Claude Code should:

1. Resolve OpenAI Agents SDK library:
```
Use MCP tool: resolve-library-id
Input: "openai agents sdk" or "openai swarm"
Output: Library ID to use with query-docs
```

2. Query documentation:
```
Use MCP tool: query-docs
Input: Library ID + "how to create an agent"
Output: Code examples and patterns
```

3. Query for Gemini integration:
```
Use MCP tool: query-docs
Input: Library ID + "custom llm provider"
Output: How to replace OpenAI with custom LLM
```

4. Implement based on docs:
- Follow official patterns from Context7 docs
- Adapt OpenAI examples to use Gemini
- Test agent creation and message handling

DEPLOYMENT APPROACH:

No infrastructure changes:
- Frontend: Deploy to existing Vercel app
- Backend: Add chat route to existing FastAPI deployment
- Database: Add tables to existing Neon database
- Environment: Add GEMINI_API_KEY to backend env vars

Migration script:
```python
# backend/migrations/add_chat_tables.py
from sqlmodel import create_engine, SQLModel
from models.conversation import Conversation, Message

def run_migration():
    engine = create_engine(DATABASE_URL)
    SQLModel.metadata.create_all(engine, tables=[
        Conversation.__table__,
        Message.__table__
    ])
```

RATE LIMITING:

Simple in-memory rate limiter:
```python
# backend/middleware/rate_limit.py
from collections import defaultdict
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, max_requests=10, window_seconds=60):
        self.max_requests = max_requests
        self.window = timedelta(seconds=window_seconds)
        self.requests = defaultdict(list)

    def is_allowed(self, user_id: str) -> bool:
        now = datetime.utcnow()
        cutoff = now - self.window

        # Remove old requests
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if req_time > cutoff
        ]

        # Check limit
        if len(self.requests[user_id]) >= self.max_requests:
            return False

        # Add new request
        self.requests[user_id].append(now)
        return True

rate_limiter = RateLimiter()

# Use in route:
if not rate_limiter.is_allowed(user_id):
    raise HTTPException(status_code=429, detail="Too many requests")
```

ERROR HANDLING:

Backend error responses:
```python
try:
    response = agent.run(messages)
except Exception as e:
    logger.error(f"Agent error: {e}")
    return {
        "conversation_id": conversation.id,
        "response": "Sorry, I'm having trouble thinking right now. Please try again.",
        "timestamp": datetime.utcnow().isoformat()
    }
```

Frontend error handling:
```typescript
try {
  const response = await sendMessage(userId, message, conversationId)
  setMessages([...messages, response])
} catch (error) {
  showError("Failed to send message. Please try again.")
}
```

TESTING APPROACH:

Manual testing checklist:
1. Open chat → Window slides up smoothly
2. Send "Hello" → AI responds
3. Send multiple messages → Conversation flows
4. Close and reopen → History persists
5. Log out and back in → Conversation still there
6. Send 11 messages quickly → Rate limit triggered
7. Invalid JWT → Redirects to login
8. Mobile view → Chat expands full screen

DEVELOPMENT SEQUENCE:

Phase 1 - Database (Tasks 1-2):
1. Create Conversation and Message models
2. Run migration to create tables

Phase 2 - Backend Agent (Tasks 3-5):
3. Set up Gemini API key
4. Use Context7 MCP to learn Agents SDK
5. Create agent with Gemini provider
6. Test agent standalone

Phase 3 - Backend Route (Tasks 6-7):
7. Create chat route with JWT auth
8. Test endpoint with Postman/curl

Phase 4 - Frontend Component (Tasks 8-11):
9. Create ChatWidget component
10. Add animations and styling
11. Create ChatWindow with message display
12. Create ChatInput component

Phase 5 - Integration (Tasks 12-13):
13. Connect frontend to backend
14. Test end-to-end flow

Phase 6 - Polish (Task 14):
15. Add error handling
16. Add rate limiting
17. Test on mobile
18. Fix bugs

SUCCESS CRITERIA:

Part 1 complete when:
- Chat button visible bottom-left
```

# Response Text
Successfully created the implementation plan for the AI Chatbot Interface feature. The following artifacts were generated:

1. **Implementation Plan** (plan.md): Comprehensive plan outlining the technical approach, architecture decisions, and project structure for the AI chatbot interface

2. **Research Document** (research.md): Detailed research on integrating OpenAI Agents SDK with Google's Gemini API, authentication patterns, rate limiting strategies, and accessibility considerations

3. **Data Model** (data-model.md): Complete specification of the Conversation and Message entities with fields, relationships, constraints, and validation rules

4. **API Contracts** (contracts/api-contracts.md): Detailed API specifications for all chat endpoints including request/response formats, authentication, and error handling

5. **Quickstart Guide** (quickstart.md): Step-by-step instructions for setting up, configuring, and running the AI Chatbot Interface feature

The plan follows the architecture-first principle with clear separation between UI, API, and AI layers as required by the constitution. It incorporates all specified requirements including JWT authentication reuse, PostgreSQL persistence, Gemini AI integration, and accessibility standards. The implementation approach uses a custom LLM provider to connect the OpenAI Agents SDK with Google's Gemini API, satisfying the requirement to use Gemini instead of OpenAI for cost control.