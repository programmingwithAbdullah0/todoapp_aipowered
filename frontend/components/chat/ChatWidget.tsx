"use client";

import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Message as MessageType } from "@/lib/chatApi";

export type ChatSize = "small" | "medium" | "large" | "full";

const sizeVariants = {
  small: { width: 320, height: 450 },
  medium: { width: 400, height: 600 },
  large: { width: 550, height: 700 },
  full: { width: 700, height: 800 },
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ChatSize>("medium");

  // Lifted state for persistence across open/close
  // This is in-memory only (refresh clears it), as requested
  const [messages, setMessages] = useState<MessageType[]>([]);

  // Handle keyboard shortcuts (Alt+C or Cmd+C to open chat, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt+C or Cmd+C (Mac Command key) to open chat
      if ((e.altKey || e.metaKey) && e.key === "c" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      // Check for Escape key to close chat when open
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating button - bottom-left */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open chat"
          title="Press Alt+C or Cmd+C to open chat"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat window - slides up from button */}
      {isOpen && (
        <motion.div
          className="fixed bottom-5 sm:bottom-24 right-5 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 max-w-[calc(100vw-40px)] max-h-[calc(100vh-120px)]"
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
            width: sizeVariants[size].width,
            height: sizeVariants[size].height,
          }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat window"
        >
          <ChatWindow
            onClose={() => setIsOpen(false)}
            currentSize={size}
            onResize={setSize}
            messages={messages}
            setMessages={setMessages}
          />
        </motion.div>
      )}
    </>
  );
}
