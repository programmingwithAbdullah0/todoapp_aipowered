"use client";

import { useState, useEffect } from "react";

interface FeedbackProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export default function Feedback({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: FeedbackProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: "bg-green-100",
    error: "bg-red-100",
    info: "bg-blue-100",
    warning: "bg-yellow-100",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
    warning: "text-yellow-800",
  }[type];

  const borderColor = {
    success: "border-green-400",
    error: "border-red-400",
    info: "border-blue-400",
    warning: "border-yellow-400",
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} border ${borderColor} text-${textColor.replace(
        "text-",
        ""
      )} px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <p>{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
