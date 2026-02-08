from dependencies.auth import get_current_user
from fastapi import APIRouter, HTTPException, Depends
from services.chat_service import ChatService
from models.chat import ChatRequest, ChatResponse
from models.conversation import Message, Conversation # DB models used in this route
from database import get_session
from sqlmodel import Session, select
import logging
from datetime import datetime
from typing import List

router = APIRouter()
logger = logging.getLogger(__name__)

# Single instance or dependency injection
chat_service = ChatService()


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest,
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    try:
        answer = await chat_service.process_message(req, user_id, session)
        return ChatResponse(
            conversation_id=req.conversation_id or -1,  # Return -1 for stateless chat
            response=answer,
            timestamp=datetime.utcnow(),
        )
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        # Secure error message - do not expose internal details
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while processing your message.",
        )


@router.get("/{user_id}/conversations/{conversation_id}")
async def get_conversation(
    user_id: str,
    conversation_id: int,
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Authorization check
    if user_id != current_user_id:
        raise HTTPException(
            status_code=403, detail="Unauthorized access to conversation"
        )

    conversation = session.get(Conversation, conversation_id)
    if not conversation or conversation.user_id != user_id:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    ).all()

    return {
        "conversation_id": conversation.id,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at,
            }
            for msg in messages
        ],
        "total_count": len(messages),
    }
