"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layout, User as UserIcon, LogOut } from "lucide-react";
import { User } from "@/lib/auth";
import { useState } from "react";

export function ProfileDropdown({
  user,
  logout,
}: {
  user: User;
  logout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
          {user.name?.[0] || user.email[0] || "U"}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.name || user.email.split("@")[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1"
          >
            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.email}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <Layout className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Link>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
