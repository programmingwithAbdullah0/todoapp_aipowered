# Phase III: Specs-Driven AI Chatbot Integration

Phase III of the TodoFlow project focuses on integrating a production-grade AI assistant using the **Model Context Protocol (MCP)** and modern UI/UX principles.

## Key Features

### 1. Intelligent AI Assistant

- **Natural Language Task Management**: Users can add, list, update, complete, and delete tasks using conversational English.
- **Context-Aware**: The assistant maintains short-term conversational history for follow-up questions.
- **Disambiguation Flow**: If multiple tasks match a title, the assistant intelligently asks the user for clarification.

### 2. MCP (Model Context Protocol) Server

- **Standardized Tools**: Exposes the backend's `TaskService` as MCP tools, making them compatible with any MCP-enabled AI client.
- **Shared Resolution Logic**: Centralized task identification logic (ID vs. Title) ensures consistent behavior across all tools.

### 3. Premium Chat UI

- **Modern Aesthetic**: A clean, "SaaS-style" interface using Lucide icons and an Indigo/Slate theme.
- **Dynamic Resizing**: Responsive chat window with four distinct size modes (Small, Medium, Large, Full-screen).

---

## Technical Architecture

### Backend ([/backend](file:///e:/Abdul%20samad%20codes/Hackhaton/GIAIC_Hackhatons/Q4_Specs_Driven_Developement/hackathon-II-todo/phase-III/backend))

- **FastAPI**: Main application API.
- **SQLModel**: ORM for PostgreSQL (Neon) interaction.
- **uv**: Modern Python package manager for high-performance dependency resolution.

### Frontend ([/frontend](file:///e:/Abdul%20samad%20codes/Hackhaton/GIAIC_Hackhatons/Q4_Specs_Driven_Developement/hackathon-II-todo/phase-III/frontend))

- **Next.js & React**: Core application framework.
- **Framer Motion**: Smooth animations and staggered entrances.
- **pnpm**: Fast, disk space efficient package manager.

---

## Getting Started

### 1. Backend Setup (using `uv`)

The backend uses **`uv`** for faster and safer dependency management.

```bash
cd backend
# Install dependencies
uv sync
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
# Set up environment
cp .env.example .env
# Run the FastAPI server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (using `pnpm`)

The frontend uses **`pnpm`** for optimized package handling.

```bash
cd frontend
# Install dependencies
pnpm install
# Set up environment
cp .env.example .env
# Run the development server
pnpm dev
```

### 3. Running the MCP Server (Optional)

If you want to use the MCP tools with an external AI client (like Claude Desktop):

```bash
cd backend
python mcp_server/start_server.py
```

---

## Recent Optimizations

- **Package Structure**: Standardized Python package with proper `__init__.py` files.
- **DB-Side Filtering**: Moved task filtering to the Database layer (`select().where()`) for speed.
- **Stateless Chat**: Frontend-managed history for better backend scalability.
