<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: Architecture-First, Technology Stack Standards, Data Model Requirements, API Design Principles
Added sections: MCP Server Architecture, Agent Integration with MCP
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/sp.constitution.md ✅ updated
Follow-up TODOs: None
-->

# Todo App Chatbot Constitution
<!-- AI Chatbot interface for Phase II Todo Web Application with MCP Server Integration -->

## Core Principles

### Architecture-First (NON-NEGOTIABLE)
<!-- Chatbot is an ADDITIONAL interface, not a replacement - Phase II web UI stays functional; Stateless chat backend - all conversation history stored in PostgreSQL database; Clear separation: ChatKit UI (frontend) ↔ Chat API (backend) ↔ OpenAI Agents SDK; Use Gemini API (not OpenAI API) for the AI agent; RESTful chat endpoint follows same auth pattern as existing API -->
<!-- MCP Server integration: Official MCP Python SDK implementation; MCP Server exposes 5 task management tools; OpenAI Agents connects to MCP Server (not direct function tools); Existing TaskService remains unchanged - tools wrap it -->
Chatbot implementation must follow architecture-first principles: The chatbot is an additional interface that preserves existing Phase II functionality; backend must be stateless with all conversation history persisted to PostgreSQL; Clear separation of concerns between UI, API, and AI layers; Gemini API must be used instead of OpenAI API for cost control; Chat endpoints must follow the same authentication patterns as existing API; No breaking changes to existing architecture; MCP Server implemented with Official MCP Python SDK; MCP Server exposes exactly 5 task management tools following MCP protocol; OpenAI Agents SDK connects to MCP Server instead of using direct function tools; Existing TaskService remains unchanged with MCP tools wrapping it; MCP Server runs as separate process alongside FastAPI application.

### Code Quality Standards
<!-- Type safety: TypeScript for chatbot components, Python type hints for chat endpoint; Reuse existing authentication - JWT tokens work for chat endpoint too; Component isolation - chatbot is self-contained, doesn't interfere with existing UI; Error handling for AI failures, API timeouts, network issues; Graceful degradation - if chatbot fails, users can still use web UI -->
All code must maintain high quality standards: Use TypeScript for frontend chatbot components and Python type hints for backend endpoints; Reuse existing JWT authentication system for chat endpoints; Ensure component isolation so chatbot doesn't interfere with existing UI; Implement comprehensive error handling for AI failures, API timeouts, and network issues; Maintain graceful degradation so web UI remains functional if chatbot fails; All code must be well-documented and maintainable; MCP Server uses Pydantic schemas for type safety; MCP tools have proper error handling with MCP-compliant responses; Agent instructions are clear and specific for task operations; Follow Official MCP SDK patterns from documentation.

### Test-First (NON-NEGOTIABLE)
<!-- All chatbot features must be tested before implementation -->
<!-- MCP Server testing: MCP Server starts without errors; Agent connects to MCP Server successfully; Natural language task commands work end-to-end -->
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced for all chatbot features; Both unit and integration tests required for AI interactions and database operations; Manual testing checklist must cover all specified requirements; MCP Server must start without errors; Agent must connect to MCP Server successfully; Natural language task commands must work end-to-end; "Add task buy milk" → Task created in database; "Show my tasks" → List displayed in chat; "Complete task 5" → Status updated; "Delete task 3" → Task removed; "Update task 2 to urgent" → Title changed; Tasks created via chat appear in web UI (bidirectional sync).

### User Experience Consistency
<!-- Chat window doesn't block main app functionality; Smooth open/close animations (slide up from bottom-left); Message bubbles clearly distinguish user vs assistant; Typing indicators while AI is thinking; Error messages displayed inline in chat; Auto-scroll to newest messages -->
All user interactions must maintain consistent experience: Chat window must not block main app functionality; Smooth animations for open/close actions from bottom-left; Clear visual distinction between user and assistant messages; Typing indicators during AI processing; Inline error display; Auto-scroll to latest messages; Responsive design works on desktop and mobile; Accessible keyboard navigation and screen reader support; Natural language commands work: "Add a task to buy milk"; Clear confirmations appear: "✓ Added task: Buy milk (ID: 5)"; Task details shown after operations; Ambiguity handled: "Which task do you want to update?"; Existing ChatWindow UI remains unchanged; No ChatKit UI changes - keep existing custom chat interface.

### Performance Requirements
<!-- Chat window renders in < 100ms; AI responses stream or show within 3 seconds; Smooth 60fps animations on open/close; Chat history loads incrementally (pagination); No performance impact on Phase II features -->
Performance standards must be maintained: Chat window renders in under 100ms; AI responses appear within 3 seconds; 60fps animations for all interactions; Incremental chat history loading; Zero performance impact on existing Phase II features; Chat component bundle size under 50KB gzipped; Database queries complete in under 100ms; Animation frames maintain 60fps minimum; MCP tool execution under 200ms; Agent response with MCP tools under 3 seconds; MCP Server startup under 2 seconds; No impact on existing web UI or chat UI performance.

### Security-First Approach
<!-- Same JWT authentication as Phase II; Gemini API key stored in backend environment variables only; Never expose API keys to frontend; Validate user_id from JWT matches chat request; Sanitize user messages before sending to AI; Rate limiting on chat endpoint (10 requests per minute per user) -->
Security must be prioritized: Use existing JWT authentication system; Store Gemini API key only in backend environment variables; Never expose API keys to frontend; Validate JWT user_id matches chat request; Sanitize all user messages before AI processing; Implement rate limiting (10 requests per minute per user); Validate user_id from JWT matches chat request; Sanitize user messages before sending to AI; Follow same auth pattern as existing API; MCP Server validates user_id from agent context; Users can only manage their own tasks; MCP Server accessible only to backend (not exposed publicly); JWT validation happens before agent processes message.

## Development Constraints
<!-- 100% Spec-Driven Development with Claude Code; Use Context7 MCP server to access OpenAI Agents SDK documentation; Claude Code must use MCP tools: resolve-library-id, query-docs; Implement with Gemini API (Google AI Studio free tier); Reuse Phase II database connection and models; No breaking changes to Phase II code -->
<!-- MCP Server development: Use Claude Code's MCP Builder Skill to scaffold MCP Server; Use Official MCP Python SDK; MCP Server in backend/mcp_server/ folder; 5 MCP tools matching hackathon spec -->

Development must follow strict constraints: 100% Spec-Driven Development using Claude Code; Use Context7 MCP server for OpenAI Agents SDK documentation via resolve-library-id and query-docs tools; Implement with Gemini API from Google AI Studio free tier; Reuse existing Phase II database connections and models; No breaking changes to Phase II codebase; All changes must be documented and tested; Claude Code must use MCP tools as required; Use Claude Code's MCP Builder Skill to scaffold MCP Server; Use Official MCP Python SDK from modelcontextprotocol/python-sdk; MCP Server must be in backend/mcp_server/ folder; MCP Server exposes exactly 5 tools following hackathon specification: add_task, list_tasks, update_task, delete_task, complete_task; MCP Server runs as separate process alongside FastAPI; NO changes to existing TaskService business logic; NO changes to existing ChatWindow UI components; NO breaking changes to Phase II web UI.

## Technology Stack Standards
<!-- Frontend: Existing Next.js 16+ app + new ChatKit component; Backend: Existing FastAPI + new chat route; AI: OpenAI Agents SDK with Gemini as LLM provider; Database: Existing Neon PostgreSQL + new tables (conversations, messages); Auth: Existing Better Auth JWT validation -->
<!-- MCP Integration: MCP Server uses Official MCP Python SDK; Agent connects to MCP Server; TaskService wrapped by MCP tools -->

Technology stack requirements: Frontend extends existing Next.js 16+ application with new ChatKit component; Backend extends existing FastAPI with new chat routes; AI functionality uses OpenAI Agents SDK with Gemini as LLM provider; Database extends existing Neon PostgreSQL with new conversations and messages tables; Authentication reuses existing Better Auth JWT validation system; Use Google AI Studio for free Gemini API access with gemini-1.5-flash model; MCP Server uses Official MCP Python SDK from modelcontextprotocol/python-sdk; AI Agent connects to MCP Server via MCP protocol; Existing TaskService methods wrapped by MCP tools; MCP Server runs separately from main FastAPI application; Agent instructions updated to explain task capabilities; Natural language understanding for task operations; Confirmation messages after each operation.

## Data Model Requirements
<!-- New tables needed: conversations: (id, user_id, created_at, updated_at); messages: (id, conversation_id, user_id, role ['user'|'assistant'], content, created_at); Existing tables unchanged: users (Better Auth), tasks (from Phase II) -->
<!-- MCP tools interact with existing TaskService which manages task data -->

Data model specifications: New conversations table with (id, user_id, created_at, updated_at); New messages table with (id, conversation_id, user_id, role ['user'|'assistant'], content, created_at); Existing users and tasks tables remain unchanged; All new tables must follow existing naming and structure conventions; Conversation persistence in database ensures stateless backend; Source of truth for conversation history is PostgreSQL; MCP tools interact with existing TaskService which manages task data; Bidirectional sync: tasks created via chat appear in web UI, tasks created via web UI appear in chat queries; No schema changes needed for Phase III completion; State maintained in Neon PostgreSQL database.

## API Design Principles
<!-- Chat endpoint: POST /api/{user_id}/chat; Request: {conversation_id?: number, message: string}; Response: {conversation_id: number, response: string, timestamp: string}; Requires Authorization: Bearer <jwt_token>; Returns 401 if unauthorized, 429 if rate limited -->
<!-- MCP Server API: Exposes tools via MCP protocol; Agent connects via MCP client; Tools validate inputs before calling TaskService -->

API design standards: Endpoint at POST /api/{user_id}/chat; Request body includes optional conversation_id and required message; Response includes conversation_id, response text, and timestamp; Authorization via Bearer JWT token; Proper error responses (401 for unauthorized, 429 for rate limiting); Consistent with existing API patterns; RESTful design principles; Clear API contracts with inputs, outputs, and error handling; MCP Server exposes tools via MCP protocol following official SDK patterns; Agent connects to MCP Server via MCP client session; MCP tools validate inputs before calling TaskService methods; MCP tools return structured MCP-compliant responses; MCP tools include user_id validation from context; MCP tools handle database errors with proper MCP error codes.

## MCP Server Architecture
<!-- Official MCP Python SDK implementation; 5 task management tools; MCP Server separate from FastAPI -->

MCP Server must follow these architectural guidelines: Implemented using Official MCP Python SDK from modelcontextprotocol/python-sdk; Exposes exactly 5 task management tools following MCP protocol: add_task, list_tasks, update_task, delete_task, complete_task; MCP Server runs as separate process alongside FastAPI application; MCP tools are thin wrappers around existing TaskService methods; Each MCP tool maps to ONE TaskService method; MCP Server located in backend/mcp_server/ folder; MCP tools validate inputs before calling TaskService; MCP tools return structured MCP-compliant responses; MCP tools include user_id validation from context; MCP tools handle database errors with proper MCP error codes; MCP Server accessible only to backend (not exposed publicly); MCP Server startup under 2 seconds; MCP tool execution under 200ms.

## Agent Integration with MCP
<!-- Agent connects to MCP Server; Uses MCP tools instead of direct functions; Updated instructions -->

Agent integration requirements: OpenAI Agents SDK connects to MCP Server via MCP protocol; Agent uses MCP tools instead of direct function tools; Existing agent initialization updated to connect to MCP Server; Agent instructions updated to explain task capabilities; Natural language understanding for task operations; Confirmation messages after each operation; Bidirectional sync: tasks created via chat appear in web UI; Tasks created via web UI appear in chat queries; Agent maintains conversation history management; Agent handles tool calls via MCP protocol; Agent follows same authentication as existing API; Agent validates user_id from context.

## Accessibility and UI Requirements
<!-- Keyboard shortcut to open chat (Alt+C or Cmd+C); Focus trap inside chat when open; Escape key to close; Screen reader announcements for new messages; ARIA labels on all interactive elements; Sufficient color contrast (WCAG AA); Floating chat window in bottom-left corner with smooth animation; Minimized by default - click to expand; Responsive design - works on desktop and mobile; Clear visual distinction from main app UI; Loading indicators during AI response generation -->
Accessibility and UI standards: Keyboard shortcut (Alt+C/Cmd+C) to open chat; Focus trap when chat is open; Escape key closes chat; Screen reader announcements for new messages; ARIA labels on all interactive elements; WCAG AA color contrast compliance; Floating chat window in bottom-left with smooth animation; Minimized by default, click to expand; Fully responsive on desktop and mobile; Clear visual distinction from main UI; Loading indicators during AI responses; Smooth open/close animations (300ms ease-in-out transition); Closed state: 60px × 60px circle button, bottom-left (20px margin); Open state: 400px × 600px chat panel; Existing ChatWindow UI components remain unchanged; Natural language commands work seamlessly; Clear feedback for all operations.

## Governance
<!-- Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->
<!-- MCP Server governance: Follows hackathon's exact MCP implementation requirements -->

All development must comply with this constitution: All PRs and reviews must verify constitutional compliance; Any deviations must be documented with justification; New features must align with stated principles; Use CLAUDE.md for runtime development guidance; Breaking changes to core principles require formal amendment process; All outputs strictly follow user intent; Prompt History Records (PHRs) created automatically for every user prompt; Architectural Decision Records (ADRs) suggested for significant decisions; All changes are small, testable, and reference code precisely; MCP Server follows hackathon's exact MCP implementation requirements; MCP Server uses Official MCP Python SDK as specified; MCP Server exposes exactly 5 tools as per hackathon specification; MCP Server integrates with existing TaskService without duplicating logic; MCP Server maintains security requirements for user validation; MCP Server operates within performance constraints specified.

**Version**: 1.1.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-18
<!-- Updated for MCP Server integration and Phase III completion -->