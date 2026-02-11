"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import {
  sendMessage,
  ChatResponse,
  Message as MessageType,
} from "@/lib/chatApi";
import { useAuth } from "@/lib/auth";

import { ChatSize } from "./ChatWidget";
import { X, Bot } from "lucide-react";

interface ChatWindowProps {
  onClose: () => void;
  currentSize: ChatSize;
  onResize: (size: ChatSize) => void;
  messages: MessageType[];
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
}

export default function ChatWindow({
  onClose,
  currentSize,
  onResize,
  messages,
  setMessages,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || null;

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const containsTaskKeywords = (text: string): boolean => {
    const taskOperationPhrases = [
      'task added', 'task created', 'task deleted', 'task removed', 
      'task updated', 'task edited', 'task completed', 'task marked as done',
      'added task', 'created task', 'deleted task', 'removed task',
      'updated task', 'edited task', 'completed task', 'marked task',
      'added a task', 'created a task', 'deleted a task', 'removed a task',
      'updated a task', 'edited a task', 'completed a task', 'marked a task',
      'will be added', 'will be created', 'will be deleted', 'will be removed',
      'has been added', 'has been created', 'has been deleted', 'has been removed',
      'was added', 'was created', 'was deleted', 'was removed',
      'marked as complete', 'marked as completed', 'marked as done',
      'marked as finished', 'marked complete', 'marked completed', 'marked done',
      'set as complete', 'set as completed', 'set as done', 'set as finished',
      'completed successfully', 'successfully completed', 'completion successful',
      'created successfully', 'successfully created', 'creation successful',
      'deleted successfully', 'successfully deleted', 'deletion successful',
      'updated successfully', 'successfully updated', 'update successful'
    ];
    
    const lowerText = text.toLowerCase();
    
    // First check for specific task operation phrases
    if (taskOperationPhrases.some(phrase => lowerText.includes(phrase))) {
      return true;
    }
    
    // Fallback: Check for general keywords combined with task-related context
    const generalKeywords = ['add', 'create', 'delete', 'remove', 'update', 'edit', 'complete', 'done', 'finished', 'marked'];
    const taskContextWords = ['task', 'tasks', 'to-do', 'todo', 'item', 'items'];
    
    const hasGeneralKeyword = generalKeywords.some(keyword => lowerText.includes(keyword));
    const hasTaskContext = taskContextWords.some(contextWord => lowerText.includes(contextWord));
    
    return hasGeneralKeyword && hasTaskContext;
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (!currentUserId) {
      // Show user their message first
      const userMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      // Add a system reminder
      const authMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Please log in first to continue the chat and manage your tasks.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, authMessage]);
      return;
    }

    // Add user message optimistically
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Pass current messages as history
      // Note: We don't track conversationId anymore as it's stateless/in-memory
      const response: ChatResponse = await sendMessage(
        message,
        messages, // Send FULL history to backend
        undefined,
      );

      // Add AI response
      const aiMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Check if the response contains task operation keywords
      if (containsTaskKeywords(response.response)) {
        // Dispatch event to refresh tasks in other components
        window.dispatchEvent(new CustomEvent("tasks-updated"));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to send message:", error);
      }

      // Add error message based on error type
      let errorMsg =
        "Sorry, I'm having trouble thinking right now. Please try again.";
      if (
        error instanceof Error &&
        error.message.includes("Too many requests")
      ) {
        errorMsg = "You're sending messages too quickly. Please slow down.";
      } else if (
        error instanceof Error &&
        error.message.includes("Unauthorized")
      ) {
        errorMsg = "Session expired. Please log in again.";
      } else if (
        error instanceof Error &&
        error.message.includes("Network Error")
      ) {
        errorMsg =
          "Connection issue. Please check your internet and try again.";
      }

      const errorMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorMsg,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-3 flex justify-between items-center shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100/50 shadow-sm shrink-0">
            <Bot className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm tracking-tight leading-4">
              Todo Assistant
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
              <span className="text-[10px] text-gray-400 font-medium">
                Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Segmented Size Controls */}
          <div className="hidden sm:flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100 gap-0.5">
            {[
              { id: "small" as ChatSize, label: "S" },
              { id: "medium" as ChatSize, label: "M" },
              { id: "large" as ChatSize, label: "L" },
              { id: "full" as ChatSize, label: "XL" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => onResize(option.id)}
                className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-all duration-200 ${
                  currentSize === option.id
                    ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                }`}
                title={`Resize to ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Close chat"
            tabIndex={0}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8" tabIndex={0}>
            Hi! I&apos;m your todo assistant. How can I help you today?
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
