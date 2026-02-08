"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Check } from "lucide-react";

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// --- Components ---

function FloatingLabelInput({
  id,
  type,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <div
        className={`relative border rounded-lg transition-all duration-300 ${
          error
            ? "border-red-300 ring-2 ring-red-100 bg-red-50/10"
            : isFocused
            ? "border-purple-600 ring-2 ring-purple-100 bg-white"
            : "border-gray-200 bg-white"
        }`}
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
          placeholder=" "
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

function PasswordStrength({ password }: { password: string }) {
  const strength = (() => {
    let s = 0;
    if (password.length > 5) s += 1;
    if (password.length > 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  })();

  const getColor = () => {
    if (strength <= 1) return "bg-red-400";
    if (strength <= 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (strength === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-1 mt-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500 font-medium">Password strength</span>
        <span
          className={`font-medium ${
            strength <= 1
              ? "text-red-500"
              : strength <= 3
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {getLabel()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          className={`h-full ${getColor()} transition-all duration-300`}
        />
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      await signup(form.email, form.password, form.name);
      setSuccess(true);
      // Redirect handled by auth flow, but we can show success state first
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 p-8 max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Account Created!
          </h2>
          <p className="text-slate-500">
            Welcome to FlowSync, {form.name.split(" ")[0]}.<br />
            Redirecting you to your dashboard...
          </p>
          <div className="h-1 w-full bg-gray-100 rounded-full mt-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-purple-600"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Left Column - Visual (Kept consistent with Login/Homepage style logic) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-600 to-purple-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        {/* Animated Shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 50,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -right-20 -bottom-20 w-[600px] h-[600px] border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -right-20 -bottom-20 w-[500px] h-[500px] border border-white/5 rounded-full"
        />

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold leading-tight">
              Start your <span className="italic text-pink-200">journey</span>{" "}
              today.
            </h1>
            <p className="text-xl text-purple-100/80 font-light">
              Join thousands of developers and teams building the future with
              FlowSync.
            </p>

            <div className="space-y-4 pt-8">
              {[
                "Free forever for personal use",
                "Unlimited collaborators",
                "Real-time sync on all devices",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-300" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-sm space-y-8 py-8">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 group lg:hidden"
            >
              <div className="w-8 h-8 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">FlowSync</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create an account
            </h2>
            <p className="text-slate-500">
              Enter your details below to create your account
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  id="name"
                  type="text"
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  id="password"
                  type="password"
                  label="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <PasswordStrength password={form.password} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FloatingLabelInput
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  error={
                    form.confirmPassword !== "" &&
                    form.password !== form.confirmPassword
                  }
                />
              </motion.div>
            </motion.div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(c) => setAgreed(c as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 leading-relaxed"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium text-purple-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-medium text-purple-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !agreed}
              className={`w-full h-12 ${
                loading || !agreed
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              } text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl`}
            >
              {loading ? "Creating account..." : !agreed ? "Agree to terms" : "Create Account"}
            </Button>
          </form>

          {/* Social Auth */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
              }
              className="h-11 bg-white hover:bg-gray-50 text-slate-700 border-gray-200 transition-all"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`)
              }
              className="h-11 bg-white hover:bg-gray-50 text-slate-700 border-gray-200 transition-all"
            >
              <SiGithub className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
