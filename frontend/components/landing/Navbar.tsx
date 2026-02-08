"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { User } from "@/lib/auth";
import { ProfileDropdown } from "./ProfileDropdown";

interface NavbarProps {
  user: User | null;
  logout: () => void;
  isScrolled: boolean;
  handleScroll: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => void;
}

export function Navbar({
  user,
  logout,
  isScrolled,
  handleScroll,
}: NavbarProps) {
  const isLoggedIn = !!user;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              FlowSync
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Features", "Updates", "Pricing", "About"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleScroll(e, item.toLowerCase())}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <ProfileDropdown user={user} logout={logout} />
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
