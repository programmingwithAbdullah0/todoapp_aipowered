"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300">
      {/* Left Area: Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Search Bar */}
        <div
          className={`relative hidden sm:flex items-center transition-all duration-300 ${
            isSearchFocused ? "w-96" : "w-64"
          }`}
        >
          <Search
            size={20}
            className={`absolute left-3 transition-colors ${
              isSearchFocused ? "text-purple-600" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full h-10 pl-10 pr-4 bg-slate-100 border-2 rounded-xl text-sm transition-all outline-none ${
              isSearchFocused
                ? "border-purple-600 bg-white shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"
                : "border-transparent hover:bg-slate-200"
            }`}
          />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle - Visual only for now */}
        {/* <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative overflow-hidden group">
             <Sun size={20} className="dark:hidden" />
             <Moon size={20} className="hidden dark:block" />
        </button> */}

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-none">
                {user?.name?.split(" ")[0]}
              </p>
              {/* <p className="text-xs text-slate-500">Free Plan</p> */}
            </div>
            <ChevronDown size={16} className="text-slate-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden py-1 z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-purple-50">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <User size={16} /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Settings size={16} /> Settings
                  </button>
                </div>

                <div className="border-t border-purple-50 p-1">
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
