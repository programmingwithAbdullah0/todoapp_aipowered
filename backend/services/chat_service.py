from agents import Agent, Runner, RunConfig, function_tool
import logging
# from ai import model, config
from models.chat import ChatRequest
from sqlmodel import Session
from typing import Optional, Dict, Any
from mcp_server.tools.add_task import add_task
from mcp_server.tools.list_tasks import list_tasks
from mcp_server.tools.update_task import update_task
from mcp_server.tools.delete_task import delete_task
from mcp_server.tools.complete_task import complete_task
from mcp_server.tools.incomplete_task import incomplete_task

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        # Updated instructions with title-based operations
        self.instructions = """You are a todo assistant that helps users manage their tasks through natural language.

CAPABILITIES:
- Create tasks: "Add a task to buy groceries"
- View tasks: "Show my tasks" or "What's pending?"
- Update tasks: "Update 'buy milk' to 'buy almond milk'" or "Change task 5 title to 'new title'"
- Delete tasks: "Delete 'buy milk'" or "Remove task 5"
- Complete tasks: "Mark 'buy milk' as complete" or "Complete task 5"
- Incomplete tasks: "Mark 'buy milk' as incomplete" or "Unmark task 5 as done"

HOW TO IDENTIFY TASKS:
- You can use EITHER the task title OR the task ID
- Users typically refer to tasks by title (e.g., "Delete 'Buy groceries'")
- The tools support both `task_id` (integer) and `task_title` (string) parameters
- If the user provides a title, pass it as `task_title` - no need to call list_tasks first!
- If multiple tasks match the title, the tool will return a disambiguation message with IDs

WHEN TO USE list_tasks:
- When the user asks to see their tasks
- When you need to find task IDs for a disambiguation response
- When the user asks "what do I need to do?" or similar

IMPORTANT BEHAVIOR:
- Always confirm actions clearly with task details (ID and title)
- If a tool returns "needs_clarification" status, show the user the matching tasks and ask them to specify by ID
- After successful operations, mention both the ID and title for clarity
- Be conversational and helpful
- Use natural language, not technical jargon

EXAMPLES:
User: "Add buy milk to my list"
You: "✓ Added task: 'Buy milk' (ID: 8)"

User: "What do I need to do?"
You: "You have 3 pending tasks:
• #5 - Buy milk
• #6 - Call mom  
• #7 - Finish report"

User: "Mark 'Buy milk' as done"
→ Call complete_task_tool(task_title="Buy milk")
You: "✓ Marked 'Buy milk' (ID: 5) as complete!"

User: "Delete task 6"
→ Call delete_task_tool(task_id=6)
You: "✓ Deleted task 'Call mom' (ID: 6)"

User: "Mark 'Buy milk' as incomplete"
→ Call incomplete_task_tool(task_title="Buy milk")
You: "✓ Marked 'Buy milk' (ID: 5) as incomplete"

User: "Update 'report' to 'Quarterly report'"
→ Call update_task_tool(task_title="report", title="Quarterly report")
You: "✓ Updated task 'Quarterly report' (ID: 7)"
"""

    async def process_message(
        self, request: ChatRequest, user_id: str, session: Session
    ) -> str:
        try:
            # Construct context from Request History (Stateless)
            history_context = "\nChat History:\n"
            if request.history:
                for msg in request.history:
                    role_label = "assistant" if msg.role == "assistant" else "user"
                    history_context += f"{role_label}: {msg.content}\n"

            # --- Tool Wrappers for User ID Injection ---
            async def add_task_tool(title: str, description: str = ""):
                """Add a new task to the user's list."""
                return await add_task(
                    user_id=user_id, title=title, description=description
                )

            async def list_tasks_tool(status: str = "all"):
                """List tasks for the user. Use status='pending' for incomplete tasks, 'completed' for done tasks, or 'all' for everything."""
                return await list_tasks(user_id=user_id, status=status)

            async def update_task_tool(
                task_id: int = None,
                task_title: str = None,
                title: str = None,
                description: str = None,
            ):
                """Update a task. Provide either task_id OR task_title to identify the task. Then provide the new title and/or description."""
                return await update_task(
                    user_id=user_id,
                    task_id=task_id,
                    task_title=task_title,
                    title=title,
                    description=description,
                )

            async def delete_task_tool(task_id: int = None, task_title: str = None):
                """Delete a task. Provide either task_id OR task_title to identify the task."""
                return await delete_task(
                    user_id=user_id, task_id=task_id, task_title=task_title
                )

            async def complete_task_tool(task_id: int = None, task_title: str = None):
                """Mark a task as complete. Provide either task_id OR task_title to identify the task."""
                return await complete_task(
                    user_id=user_id, task_id=task_id, task_title=task_title
                )

            async def incomplete_task_tool(task_id: int = None, task_title: str = None):
                """Mark a task as incomplete (undo completion). Provide either task_id OR task_title to identify the task."""
                return await incomplete_task(
                    user_id=user_id, task_id=task_id, task_title=task_title
                )

            # Register tools with the Agent
            tools = [
                function_tool(add_task_tool),
                function_tool(list_tasks_tool),
                function_tool(update_task_tool),
                function_tool(delete_task_tool),
                function_tool(complete_task_tool),
                function_tool(incomplete_task_tool),
            ]

            agent = Agent(
                name="assistant",
                instructions=self.instructions,
                model=model,
                tools=tools,
            )

            full_prompt = f"{history_context}\nUser: {request.message}"

            # Run the agent
            result = await Runner.run(
                agent, full_prompt, run_config=config, max_turns=30
            )

            return result.final_output

        except Exception as e:
            logger.error(f"Error in ChatService: {e}")
            raise e
