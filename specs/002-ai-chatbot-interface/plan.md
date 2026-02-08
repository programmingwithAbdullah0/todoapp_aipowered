# Implementation Plan: AI Chatbot Interface

**Branch**: `002-ai-chatbot-interface` | **Date**: 2026-01-13 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a conversational AI chatbot interface that allows users to interact with a friendly assistant through natural language. The chatbot appears as a floating button in the bottom-left corner that expands into a chat panel. The system integrates Google's Gemini AI through the OpenAI Agents SDK, with conversation history persisted in PostgreSQL. The implementation follows architecture-first principles with clear separation between UI, API, and AI layers.

## Technical Context

**Language/Version**: TypeScript (frontend), Python 3.11 (backend)
**Primary Dependencies**: Next.js 16+, FastAPI, OpenAI Agents SDK, google-generativeai, SQLModel, Tailwind CSS
**Storage**: PostgreSQL (Neon database) with new conversations and messages tables
**Testing**: Manual testing checklist based on spec requirements
**Target Platform**: Web application (desktop and mobile browsers)
**Project Type**: Web (extends existing Next.js + FastAPI application)
**Performance Goals**: < 100ms UI render, < 3s first AI response, < 2s subsequent responses, < 100ms DB queries, 60fps animations
**Constraints**: < 50KB gzipped chat component bundle, JWT authentication reuse, WCAG AA compliance, 10 requests/minute rate limiting
**Scale/Scope**: Individual user conversations, persistent across sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Architecture-First: Chatbot is additional interface, preserves existing functionality
- ✅ Security-First: JWT authentication reuse, API key in backend only, rate limiting
- ✅ Code Quality: TypeScript for frontend, Python type hints for backend
- ✅ Performance: <100ms render, <3s AI response, 60fps animations
- ✅ Accessibility: Keyboard shortcuts, focus trap, ARIA labels, WCAG AA
- ✅ Technology Stack: Next.js, FastAPI, OpenAI Agents SDK, Gemini API
- ✅ Data Model: PostgreSQL with conversations/messages tables as specified
- ✅ API Design: RESTful /api/{user_id}/chat with JWT auth as specified

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-chatbot-interface/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── conversation.py    # New: Conversation and Message models
│   ├── services/
│   │   └── chat_service.py    # New: Chat business logic
│   ├── agents/
│   │   └── agent_factory.py   # New: AI agent creation with Gemini
│   ├── api/
│   │   └── chat_router.py     # New: /api/{user_id}/chat endpoint
│   └── middleware/
│       └── rate_limit.py      # New: Rate limiting implementation
└── tests/
    └── integration/
        └── test_chat_api.py   # New: Chat API tests

frontend/
├── src/
│   ├── components/
│   │   └── chat/
│   │       ├── ChatWidget.tsx       # Main floating component
│   │       ├── ChatWindow.tsx       # Expanded chat panel
│   │       ├── ChatMessage.tsx      # Single message bubble
│   │       ├── ChatInput.tsx        # Message input field
│   │       └── TypingIndicator.tsx  # AI thinking animation
│   └── lib/
│       └── chatApi.ts               # Chat API client
└── tests/
    └── unit/
        └── test_chat_components.ts  # Chat component tests
```

**Structure Decision**: Selected Option 2: Web application with separate backend and frontend directories to maintain clear separation between UI, API, and AI layers as required by architecture-first principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Third-party AI service | Gemini API needed for conversational AI | Building own LLM would be prohibitively complex and expensive |
| Additional database tables | Persistent conversation storage required | In-memory storage would lose data on server restart |
| Rate limiting middleware | Prevent abuse and API quota exhaustion | No rate limiting would risk exceeding API limits |

## Phase 0: Research

### Research Tasks

1. **OpenAI Agents SDK Integration**: Research how to integrate OpenAI Agents SDK with Google's Gemini API
2. **Gemini API Setup**: Understand how to configure and use gemini-1.5-flash model
3. **Custom LLM Provider**: Investigate patterns for connecting Agents SDK to non-OpenAI LLMs
4. **Context7 MCP Tools**: Learn how to use resolve-library-id and query-docs for documentation
5. **Animation Performance**: Best practices for smooth 60fps animations in React
6. **JWT Authentication**: Verify existing JWT token compatibility with new chat endpoint
7. **Rate Limiting Strategies**: In-memory vs database vs Redis for rate limiting
8. **Accessibility Patterns**: Best practices for chat UI accessibility

### Expected Outcomes

- Working prototype of OpenAI Agents SDK with Gemini API
- Understanding of custom LLM provider implementation
- Verified JWT authentication approach
- Selected rate limiting strategy
- Accessibility implementation patterns

## Phase 1: Design & Contracts

### Data Model Design

- **Conversation entity**: id, user_id (foreign key to users), created_at, updated_at
- **Message entity**: id, conversation_id (foreign key to conversations), user_id, role (user/assistant), content, created_at
- **Indexes**: conversation_id and user_id for efficient querying
- **Validation**: Role field restricted to 'user'/'assistant', content not empty

### API Contract Design

**Endpoint**: `POST /api/{user_id}/chat`
**Request**: `{ message: string, conversation_id?: number }`
**Response**: `{ conversation_id: number, response: string, timestamp: string }`
**Auth**: JWT Bearer token
**Errors**: 401 (unauthorized), 404 (conversation not found), 429 (rate limited), 500 (AI error)

### Quickstart Guide Elements

- Environment setup (GEMINI_API_KEY)
- Database migration steps
- Frontend component integration
- Testing procedures
- Common troubleshooting

## Phase 2: Implementation Preparation

- Task breakdown for database schema, backend API, frontend components
- Integration testing approach
- Performance benchmarking plan
- Accessibility testing checklist