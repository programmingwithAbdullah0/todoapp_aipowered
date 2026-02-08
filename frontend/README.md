# Frontend - TodoFlow Chat UI

This is the Next.js frontend for Phase III, featuring a premium specs-driven AI Chatbot interface.

## Features

### 1. Advanced Chatbot Interface

- **ChatWidget**: A floating bubble that opens the main chat window.
- **ChatWindow**: A fully animated interface with staggered message entrances.
- **Lucide Icons**: Modern, high-quality icons used throughout the chat UI.

### 2. Intelligent Resizing

The chat window supports four distinct sizing modes via a custom state machine:

- **Small (Default)**: Compact view for quick interactions.
- **Medium**: Balanced size for reading longer responses.
- **Large**: Expansive view for complex management tasks.
- **Full-screen**: Takes over the viewport for an immersive experience.

### 3. Stateless History Management

- The chat history is maintained in the React state (`messages` array).
- This history is sent to the backend with every request, ensuring the API can provide context-aware responses without needing an expensive session database.

---

## Development

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (Highly Recommended)

### Installation

```bash
# Using pnpm (Recommended)
pnpm install

# Using npm
npm install
```

### Config & Environment

Create a `.env` file in this directory based on `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Running the App

```bash
pnpm dev
```

### API Connection

The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_URL`:

- **Backend URL**: `http://localhost:8000/api` (default)
- **Authentication**: JWT tokens are stored in localStorage after login
- **OAuth Redirects**: The frontend receives OAuth callbacks and extracts JWT tokens from URL fragments

---

## Styling & Animation

- **Tailwind CSS**: Utility-first styling for the entire interface.
- **Framer Motion**: Powering all transitions, including button hover states, window opening/closing, and resizing animations.
- **Theme**: A premium Indigo/Slate color palette that matches modern Spec-driven designs.

## 📁 Key Components

- `components/ChatWidget.tsx`: The main entry point for the chatbot.
- `components/ChatWindow.tsx`: The primary container for the chat interface.
- `components/MessageList.tsx`: Handles rendering of user and assistant messages.
- `lib/api.ts`: Centralized Axios configuration for backend communication.
