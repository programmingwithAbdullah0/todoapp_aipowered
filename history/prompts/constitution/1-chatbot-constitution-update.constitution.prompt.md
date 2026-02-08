---
id: 1
title: "Chatbot Constitution Update"
stage: "constitution"
date_iso: "2026-01-13"
surface: "agent"
model: "Claude Sonnet 4.5"
feature: "none"
branch: "feature/homepage-refactor-and-theme"
user: "user"
command: "sp.constitution"
labels: ["constitution", "chatbot", "ai", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
---

# Prompt Text
```
Create principles for adding an AI chatbot interface to the existing Phase II Todo Web Application, focused on:

ARCHITECTURE PRINCIPLES:
- Chatbot is an ADDITIONAL interface, not a replacement - Phase II web UI stays functional
- Stateless chat backend - all conversation history stored in PostgreSQL database
- Clear separation: ChatKit UI (frontend) ↔ Chat API (backend) ↔ OpenAI Agents SDK
- Use Gemini API (not OpenAI API) for the AI agent
- RESTful chat endpoint follows same auth pattern as existing API

CODE QUALITY STANDARDS:
- Type safety: TypeScript for chatbot components, Python type hints for chat endpoint
- Reuse existing authentication - JWT tokens work for chat endpoint too
- Component isolation - chatbot is self-contained, doesn't interfere with existing UI
- Error handling for AI failures, API timeouts, network issues
- Graceful degradation - if chatbot fails, users can still use web UI

CHATBOT UI REQUIREMENTS:
- Floating chat window in bottom-left corner with smooth animation
- Minimized by default - click to expand
- Responsive design - works on desktop and mobile
- Clear visual distinction from main app UI
- Accessible keyboard navigation and screen reader support
- Loading indicators during AI response generation

USER EXPERIENCE CONSISTENCY:
- Chat window doesn't block main app functionality
- Smooth open/close animations (slide up from bottom-left)
- Message bubbles clearly distinguish user vs assistant
- Typing indicators while AI is thinking
- Error messages displayed inline in chat
- Auto-scroll to newest messages

PERFORMANCE REQUIREMENTS:
- Chat window renders in < 100ms
- AI responses stream or show within 3 seconds
- Smooth 60fps animations on open/close
- Chat history loads incrementally (pagination)
- No performance impact on Phase II features

SECURITY REQUIREMENTS:
- Same JWT authentication as Phase II
- Gemini API key stored in backend environment variables only
- Never expose API keys to frontend
- Validate user_id from JWT matches chat request
- Sanitize user messages before sending to AI
- Rate limiting on chat endpoint (10 requests per minute per user)

DEVELOPMENT CONSTRAINTS:
- 100% Spec-Driven Development with Claude Code
- Use Context7 MCP server to access OpenAI Agents SDK documentation
- Claude Code must use MCP tools: resolve-library-id, query-docs
- Implement with Gemini API (Google AI Studio free tier)
- Reuse Phase II database connection and models
- No breaking changes to Phase II code

TECHNOLOGY STACK (Phase III Part 1):
- Frontend: Existing Next.js 16+ app + new ChatKit component
- Backend: Existing FastAPI + new chat route
- AI: OpenAI Agents SDK with Gemini as LLM provider
- Database: Existing Neon PostgreSQL + new tables (conversations, messages)
- Auth: Existing Better Auth JWT validation

FEATURE SCOPE (Part 1 - Chatbot Foundation):
MUST HAVE:
- Floating chat window UI component (bottom-left, animated)
- POST /api/{user_id}/chat endpoint
- OpenAI Agents SDK integrated with Gemini API
- Conversation persistence in database
- Basic agent that can respond to greetings and simple queries
- User authentication via existing JWT tokens
- Error handling and loading states

MUST NOT HAVE (Coming in Part 2):
- MCP server for task tools
- Actual task management via chat (add, update, delete tasks)
- Advanced agent capabilities
- Multi-turn complex conversations
- Task-specific natural language understanding

DATA MODEL REQUIREMENTS:
New tables needed:
- conversations: (id, user_id, created_at, updated_at)
- messages: (id, conversation_id, user_id, role ['user'|'assistant'], content, created_at)

Existing tables unchanged:
- users (Better Auth)
- tasks (from Phase II)

API DESIGN PRINCIPLES:
Chat endpoint:
- POST /api/{user_id}/chat
- Request: {conversation_id?: number, message: string}
- Response: {conversation_id: number, response: string, timestamp: string}
- Requires Authorization: Bearer <jwt_token>
- Returns 401 if unauthorized, 429 if rate limited

DEPLOYMENT STANDARDS:
- Frontend: Add chatbot component to existing Vercel deployment
- Backend: Add chat route to existing FastAPI deployment
- Environment variable: GEMINI_API_KEY (backend only)
- No new deployment infrastructure needed
- Health check includes chat endpoint status

GEMINI API INTEGRATION:
- Use Google AI Studio for free Gemini API access
- Model: gemini-1.5-flash (fastest, free tier)
- API key from: https://aistudio.google.com/apikey
- Rate limits: 15 requests per minute (free tier)
- Fallback error message if API fails

OPENAI AGENTS SDK WITH GEMINI:
- Use OpenAI Agents SDK framework
- Replace OpenAI LLM with Gemini via custom provider
- Agent instructions: "You are a helpful assistant for a todo app"
- For Part 1: Agent has NO tools (just conversation)
- Streaming responses preferred for better UX

CONTEXT7 MCP SERVER USAGE:
Claude Code must use Context7 MCP server to:
1. resolve-library-id for "openai-agents-sdk" or "openai swarm"
2. query-docs to understand agent initialization, message handling
3. query-docs to learn how to swap OpenAI for Gemini
4. Implement based on official documentation patterns

SUCCESS CRITERIA:
Part 1 is complete when:
- Chat window appears in bottom-left with smooth animation
- Users can click to open/minimize chat
- Users can type messages and receive AI responses
- Gemini API successfully integrated with Agents SDK
- Conversations saved to database (stateless backend)
- JWT authentication works for chat endpoint
- No bugs in existing Phase II features
- Chat works on desktop and mobile
- Error handling graceful (API failures, network issues)

FORBIDDEN PRACTICES:
- Hardcoding Gemini API key in frontend code
- Breaking existing Phase II authentication flow
- Chat window blocking main UI functionality
- Storing conversation state in backend memory (must use DB)
- Using OpenAI API instead of Gemini (costs money)
- Manual coding (must use Claude Code + specs)
- Ignoring Context7 MCP documentation

TESTING REQUIREMENTS:
Manual testing checklist:
- Chat window opens/closes smoothly
- Send message → Receive AI response
- Multiple messages in same conversation persist
- New conversation starts correctly
- JWT expiration handled (redirect to login)
- Gemini API error shows friendly message
- Rate limiting prevents spam
- Mobile responsive chat window

ANIMATION SPECIFICATIONS:
Chat window animations:
- Closed state: 60px × 60px circle button, bottom-left (20px margin)
- Open state: 400px × 600px chat panel, bottom-left (20px margin)
- Transition: 300ms ease-in-out
- Shadow: elevation for floating effect
- Icon: chat bubble when closed, X when open
- Hover effect: slight scale (1.05)

ACCESSIBILITY REQUIREMENTS:
- Keyboard shortcut to open chat (Alt+C or Cmd+C)
- Focus trap inside chat when open
- Escape key to close
- Screen reader announcements for new messages
- ARIA labels on all interactive elements
- Sufficient color contrast (WCAG AA)

PERFORMANCE BUDGET:
- Chat component bundle: < 50KB gzipped
- Animation frame rate: 60fps minimum
- First message response: < 3 seconds
- Subsequent messages: < 2 seconds
- Database query for history: < 100ms
```

# Response Text
Updated the project constitution at `.specify/memory/constitution.md` with specific principles for the AI chatbot interface. The new constitution includes:

- Architecture-First principle emphasizing the chatbot as an additional interface that preserves existing functionality
- Code Quality Standards focusing on TypeScript, Python type hints, and proper error handling
- Test-First approach with TDD enforcement
- User Experience Consistency covering UI requirements and accessibility
- Performance Requirements specifying response times and animation standards
- Security-First Approach with JWT authentication and API key protection

Additional sections cover:
- Development Constraints requiring Spec-Driven Development and MCP tools
- Technology Stack Standards for Next.js, FastAPI, OpenAI Agents SDK with Gemini
- Data Model Requirements for conversations and messages tables
- API Design Principles for the chat endpoint
- Accessibility and UI Requirements including keyboard navigation and responsive design
- Governance rules for constitutional compliance

The constitution now serves as the authoritative guide for implementing the AI chatbot interface while maintaining compatibility with the existing Phase II Todo Web Application.