"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

// --- Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// --- Components ---

function FloatingLabelInput({
  id,
  type,
  label,
  value,
  onChange,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <div
        className={`relative border rounded-lg transition-all duration-300 ${
          isFocused ? "border-purple-600 ring-2 ring-purple-100" : "border-gray-200"
        } bg-white`}
      >
        <Input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-14 px-4 pt-4 pb-1 border-none shadow-none focus-visible:ring-0 bg-transparent text-base"
          placeholder=" " // Required for :placeholder-shown trick if we used pure CSS, but we use state here
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || value
              ? "top-1 text-xs text-purple-600 font-medium"
              : "top-4 text-base text-gray-500"
          }`}
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form.email, form.password);
      // Success redirect
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Left Column - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12"
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500 rounded-full blur-[100px]"
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-100 text-sm font-medium"
            >
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              Join the productivity revolution
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              Turn your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                daily chaos
              </span>{" "}
              into clarity.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-purple-100/80 leading-relaxed"
            >
              Experience the flow state you&rsquo;ve been looking for. Organize,
              prioritize, and accomplish more with FlowSync.
            </motion.p>

            {/* Floating Cards */}
            <motion.div variants={itemVariants} className="pt-8">
              <div className="relative h-48 w-full perspective-1000">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 top-4 w-64 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-300" />
                    </div>
                    <div className="h-2 w-24 bg-white/20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute right-0 bottom-4 w-64 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg z-[-1]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-violet-300" />
                    </div>
                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 group"
            >
              <div className="w-8 h-8 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">FlowSync</span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <FloatingLabelInput
                id="email"
                type="email"
                label="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FloatingLabelInput
                id="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-purple-600 hover:text-purple-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Social Auth */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
              }
              className="w-full h-11 bg-white hover:bg-gray-50 text-slate-700 border-gray-200 hover:border-gray-300 transition-all"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`)
              }
              className="w-full h-11 bg-white hover:bg-gray-50 text-slate-700 border-gray-200 hover:border-gray-300 transition-all"
            >
              <SiGithub className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
