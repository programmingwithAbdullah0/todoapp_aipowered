import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount and when re-enabled
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const trySendMessage = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      // Refocus immediately after clearing, in case loading is very fast
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trySendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      trySendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-gray-50 hover:bg-gray-100 focus:bg-white border-0 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm placeholder:text-gray-400"
        rows={1}
        disabled={disabled}
        style={{ minHeight: "44px", maxHeight: "120px" }}
        autoFocus
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || disabled}
        className={`p-3 rounded-full transition-all duration-200 shrink-0 ${
          inputValue.trim() && !disabled
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:scale-105 active:scale-95"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
