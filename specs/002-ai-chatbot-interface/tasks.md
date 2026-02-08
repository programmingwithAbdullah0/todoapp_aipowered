# Tasks: AI Chatbot Interface

**Feature**: AI Chatbot Interface
**Date**: 2026-01-13
**Status**: Draft

## Overview

Implementation of a conversational AI chatbot interface that allows users to interact with a friendly assistant through natural language. The chatbot appears as a floating button in the bottom-left corner that expands into a chat panel. The system integrates Google's Gemini AI through the OpenAI Agents SDK, with conversation history persisted in PostgreSQL. The implementation follows architecture-first principles with clear separation between UI, API, and AI layers.

## Implementation Strategy

This implementation follows an MVP-first approach, delivering value incrementally. The core functionality (User Story 1 and 2) will be implemented first, followed by enhanced features (User Stories 3-5). Each user story is designed to be independently testable and deliver value.

## Dependencies

User stories dependencies:
- US1 (Access Chat Interface) → Foundation for all other stories
- US2 (Send/Receive Messages) → Depends on US1, foundation for US3
- US3 (Maintain Context) → Depends on US2
- US4 (Persist History) → Depends on US2
- US5 (Secure Authentication) → Implemented in parallel with other stories as a foundational requirement

## Parallel Execution Opportunities

- Backend (models, services, API) and Frontend (components) can be developed in parallel
- Authentication implementation can run parallel to UI development
- Database setup can run parallel to other development

---

## Phase 1: Setup & Environment

- [X] T001 Set up development environment with required dependencies for chatbot feature
- [X] T002 Install Python packages: google-generativeai, openai, sqlmodel, fastapi
- [X] T003 Configure environment variables for GEMINI_API_KEY in backend
- [X] T004 Install frontend dependencies: framer-motion for animations
- [X] T005 Update Tailwind CSS config with slide-up animation for chat window

---

## Phase 2: Foundational Components

- [X] T006 [P] Create SQLModel models for Conversation and Message entities in backend/src/models/conversation.py
- [X] T007 [P] Create rate limiting middleware in backend/src/middleware/rate_limit.py
- [X] T008 [P] Create custom Gemini provider wrapper in backend/src/agents/gemini_provider.py
- [X] T009 [P] Create AI agent factory with Gemini integration in backend/src/agents/agent_factory.py
- [X] T010 [P] Create chat API client in frontend/src/lib/chatApi.ts

---

## Phase 3: User Story 1 - Access Chat Interface (Priority: P1)

**Goal**: A logged-in user can access the chat interface by clicking a floating button in the bottom-left corner.

**Independent Test Criteria**: User can click the floating chat button and see it expand properly, providing access to the AI assistant interface.

**Tasks**:

- [X] T011 [P] [US1] Create ChatWidget component with floating button in frontend/src/components/chat/ChatWidget.tsx
- [X] T012 [P] [US1] Create ChatWindow component with expandable panel in frontend/src/components/chat/ChatWindow.tsx
- [X] T013 [P] [US1] Implement smooth slide-up animation for chat window expansion
- [X] T014 [P] [US1] Add minimize/close functionality to return to floating button
- [X] T015 [US1] Integrate ChatWidget into main application layout
- [X] T016 [US1] Test chat window opening and closing functionality

---

## Phase 4: User Story 2 - Send Messages and Receive AI Responses (Priority: P1)

**Goal**: User can send messages to the AI assistant and receive relevant responses within 3 seconds.

**Independent Test Criteria**: User can type messages and receive AI responses, enabling the conversational aspect of the assistant.

**Tasks**:

- [X] T017 [P] [US2] Create ChatInput component with message input field in frontend/src/components/chat/ChatInput.tsx
- [X] T018 [P] [US2] Create ChatMessage component to display messages in frontend/src/components/chat/ChatMessage.tsx
- [X] T019 [P] [US2] Create TypingIndicator component for AI response loading in frontend/src/components/chat/TypingIndicator.tsx
- [X] T020 [P] [US2] Implement optimistic UI for message display in frontend
- [X] T021 [US2] Create chat API endpoint POST /api/{user_id}/chat in backend/src/api/chat_router.py
- [X] T022 [US2] Implement message sending and AI response logic in backend
- [X] T023 [US2] Test end-to-end messaging flow with AI responses

---

## Phase 5: User Story 3 - Maintain Conversation Context (Priority: P2)

**Goal**: The AI remembers previous exchanges within the same conversation and can reference them in subsequent responses.

**Independent Test Criteria**: Multi-turn conversation where the AI recalls previous information, creating a more intelligent conversational experience.

**Tasks**:

- [X] T024 [P] [US3] Create chat service to manage conversation history in backend/src/services/chat_service.py
- [X] T025 [P] [US3] Implement conversation context retrieval for AI agent
- [X] T026 [US3] Update AI agent to maintain conversation history in context
- [X] T027 [US3] Test multi-turn conversations with context preservation
- [X] T028 [US3] Verify AI can reference previous information in conversations

---

## Phase 6: User Story 4 - Persist Conversation History (Priority: P2)

**Goal**: Conversation history persists across user sessions and can be retrieved when returning to a conversation.

**Independent Test Criteria**: User can send messages, close the chat, reopen it, and see the history restored.

**Tasks**:

- [X] T029 [P] [US4] Implement conversation creation and retrieval in backend/src/services/chat_service.py
- [X] T030 [P] [US4] Implement message saving to database in backend/src/services/chat_service.py
- [X] T031 [P] [US4] Create GET /api/{user_id}/conversations/{conversation_id} endpoint in backend/src/api/chat_router.py
- [X] T032 [US4] Load conversation history in frontend when chat window opens
- [X] T033 [US4] Test conversation history persistence across sessions
- [X] T034 [US4] Implement "Load more" functionality for older messages

---

## Phase 7: User Story 5 - Secure Authentication and Isolation (Priority: P1)

**Goal**: Ensure conversations are private and secure, accessible only to the owning user.

**Independent Test Criteria**: JWT authentication works properly and users can't access other users' conversations.

**Tasks**:

- [X] T035 [P] [US5] Verify JWT authentication in chat endpoint validates user_id matches token
- [X] T036 [P] [US5] Implement user_id validation to ensure conversation isolation
- [X] T037 [US5] Add proper error handling for unauthorized access attempts
- [X] T038 [US5] Test authentication flow with valid and invalid tokens
- [X] T039 [US5] Verify rate limiting is applied per user_id

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T040 Add error handling for Gemini API unavailability with user-friendly messages
- [X] T041 Implement keyboard shortcut (Alt+C/Cmd+C) to open chat
- [X] T042 Add focus trap when chat is open with Escape key to close
- [X] T043 Implement proper ARIA labels for screen reader accessibility
- [X] T044 Ensure WCAG AA color contrast compliance for chat UI
- [X] T045 Test responsive behavior on mobile devices (screen < 768px)
- [X] T046 Handle empty message prevention and proper validation
- [X] T047 Test performance: UI render < 100ms, AI response < 3s, DB queries < 100ms
- [X] T048 Conduct manual testing checklist for all acceptance criteria
- [X] T049 Update documentation with chatbot usage instructions

---

## MVP Scope (Minimal Viable Product)

The MVP includes User Stories 1 and 2, providing the core functionality:
- T001-T016 (Chat interface access)
- T017-T023 (Sending messages and receiving AI responses)

This delivers immediate value by providing the foundational chat experience.