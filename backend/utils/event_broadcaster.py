"""
Event broadcaster utility for real-time notifications
"""
import asyncio
import json
from typing import Dict, List, Callable, Set
from fastapi import HTTPException
from sse_starlette.sse import EventSourceResponse


class EventBroadcaster:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.connections: Dict[str, Set] = {}  # Changed to use Set for connections
        self.user_callbacks: Dict[str, List[Callable]] = {}  # Store callbacks per user

    def subscribe(self, channel: str, callback: Callable):
        """Subscribe to a specific channel"""
        if channel not in self.subscribers:
            self.subscribers[channel] = []
        self.subscribers[channel].append(callback)

    def unsubscribe(self, channel: str, callback: Callable):
        """Unsubscribe from a specific channel"""
        if channel in self.subscribers and callback in self.subscribers[channel]:
            self.subscribers[channel].remove(callback)

    async def broadcast(self, channel: str, data: Dict):
        """Broadcast data to all subscribers of a channel"""
        if channel in self.subscribers:
            for callback in self.subscribers[channel]:
                try:
                    await callback(channel, data)
                except Exception:
                    # Remove broken callbacks
                    self.unsubscribe(channel, callback)

    def add_user_callback(self, user_id: str, callback: Callable):
        """Add a callback function for a specific user"""
        if user_id not in self.user_callbacks:
            self.user_callbacks[user_id] = []
        self.user_callbacks[user_id].append(callback)

    def remove_user_callback(self, user_id: str, callback: Callable):
        """Remove a callback function for a specific user"""
        if user_id in self.user_callbacks and callback in self.user_callbacks[user_id]:
            self.user_callbacks[user_id].remove(callback)
            if not self.user_callbacks[user_id]:  # Clean up empty user list
                del self.user_callbacks[user_id]

    async def notify_user(self, user_id: str, event_type: str, data: Dict):
        """Notify a specific user about an event using stored callbacks"""
        if user_id in self.user_callbacks:
            for callback in self.user_callbacks[user_id][:]:  # Copy list to avoid modification during iteration
                try:
                    await callback(event_type, data)
                except Exception as e:
                    print(f"Error calling callback for user {user_id}: {e}")
                    # Remove broken callback
                    self.remove_user_callback(user_id, callback)


# Global broadcaster instance
broadcaster = EventBroadcaster()