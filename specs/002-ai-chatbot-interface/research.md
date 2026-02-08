# Research: AI Chatbot Interface Implementation

**Feature**: AI Chatbot Interface
**Date**: 2026-01-13
**Status**: Completed

## Overview

Research conducted to support the implementation of the AI Chatbot Interface, focusing on integrating Google's Gemini AI with the OpenAI Agents SDK framework, authentication patterns, and performance considerations.

## Key Research Areas

### 1. OpenAI Agents SDK with Gemini Integration

**Decision**: Use a custom LLM provider wrapper to connect OpenAI Agents SDK to Google's Gemini API
**Rationale**: The OpenAI Agents SDK provides a robust framework for managing conversations and agent behavior, but requires a custom provider to work with non-OpenAI models like Gemini
**Implementation approach**:
- Create a `GeminiProvider` class that implements the required interface
- Use Google's `google-generativeai` Python library to interface with Gemini
- Wrap the provider in a compatible interface for the Agents SDK

**Alternatives considered**:
- Direct API calls to Gemini: Would lose the benefits of the Agents SDK's conversation management
- Using LangChain: Introduces additional complexity when the OpenAI Agents SDK already fits the use case
- OpenAI's native API: Contradicts the requirement to use Gemini for cost control

### 2. Gemini API Configuration

**Decision**: Use gemini-1.5-flash model via google-generativeai library
**Rationale**: The gemini-1.5-flash model offers the best balance of speed, cost, and capability for conversational AI
**Configuration details**:
- Model: gemini-1.5-flash (optimized for speed and multi-modal input)
- API key: Stored in environment variables, accessed via `os.getenv("GEMINI_API_KEY")`
- Rate limits: Free tier allows 15 requests/minute, 1500 requests/day

**Free tier limitations**:
- 15 requests per minute per API key
- 1500 requests per day per API key
- Sufficient for development and low-volume production

### 3. Custom LLM Provider Pattern

**Decision**: Implement a custom provider that translates between OpenAI Agents SDK and Gemini API
**Rationale**: This allows leveraging the Agents SDK's conversation management while using Gemini as the underlying LLM
**Implementation pattern**:
```python
class GeminiProvider:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate(self, messages):
        # Convert OpenAI-style messages to Gemini format
        # Call Gemini API
        # Return response in compatible format
```

**Key considerations**:
- Message format translation (OpenAI's role/content vs Gemini's parts)
- Error handling consistency
- Token usage tracking

### 4. JWT Authentication Integration

**Decision**: Reuse existing JWT authentication middleware
**Rationale**: Consistent with the constitution requirement to reuse existing authentication
**Verification completed**:
- Confirmed existing JWT tokens can be validated in the new chat endpoint
- Verified user_id extraction from JWT matches the {user_id} path parameter
- Confirmed no breaking changes to existing auth flow

### 5. Rate Limiting Strategy

**Decision**: In-memory rate limiting using collections.defaultdict
**Rationale**: Simple, effective solution that meets requirements without additional infrastructure
**Implementation details**:
- Track requests per user_id with timestamp-based window
- 10 requests per minute per user (as specified in requirements)
- Memory-efficient with automatic cleanup of expired entries

**Alternative considered**:
- Database-based: More complex and slower than needed for this use case
- Redis-based: Would require additional infrastructure for minimal benefit

### 6. Animation Performance Optimization

**Decision**: Use CSS animations with hardware acceleration for 60fps performance
**Rationale**: Achieves smooth animations while meeting performance requirements
**Techniques identified**:
- Use `transform` and `opacity` properties (avoid layout/paint triggers)
- `will-change` property for elements that will animate
- Optimize React re-renders with proper state management
- Use requestAnimationFrame for JavaScript-controlled animations

### 7. Accessibility Implementation

**Decision**: Follow WCAG 2.1 AA guidelines with specific chat UI patterns
**Rationale**: Required by constitution and essential for inclusive design
**Key patterns identified**:
- Keyboard navigation (Tab, Shift+Tab, Escape, Enter)
- ARIA roles and labels for screen readers
- Focus management when chat opens/closes
- Color contrast ratios (4.5:1 minimum for normal text)
- Semantic HTML structure

### 8. Database Schema Design

**Decision**: Two-table design with foreign key relationships
**Rationale**: Follows data model requirements and enables efficient querying
**Schema confirmed**:
- conversations table: id (PK), user_id (FK), created_at, updated_at
- messages table: id (PK), conversation_id (FK), user_id, role, content, created_at
- Proper indexing on foreign keys for performance

## Context7 MCP Usage

**Confirmed approach**: Use Context7 MCP tools during implementation phase:
1. `resolve-library-id` for "openai-agents-sdk" or "openai swarm"
2. `query-docs` to understand agent initialization and message handling
3. `query-docs` to learn how to implement custom LLM provider
4. Follow official documentation patterns from Context7

## Outstanding Issues

None - all research questions have been resolved and implementation path is clear.

## Next Steps

1. Implement database models for conversations and messages
2. Create custom Gemini provider for OpenAI Agents SDK
3. Build chat API endpoint with JWT authentication
4. Develop frontend chat components with animations
5. Integrate all components and test end-to-end flow