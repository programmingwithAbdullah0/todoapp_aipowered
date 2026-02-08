"use client";

import { useEffect, useRef, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storage } from "@/lib/storage";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasProcessed = useRef(false);

  // Parse hash on client side only - calculate initial value instead of using effect
  const [hashToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get("token");
    }
    return null;
  });

  const urlToken = searchParams.get("token");
  const token = hashToken || urlToken;

  const errorParam = searchParams.get("error");
  const error =
    errorParam || (!token ? "No authentication token received" : null);

  useEffect(() => {
    // Prevent running the effect multiple times
    if (hasProcessed.current) return;

    if (token && !errorParam) {
      hasProcessed.current = true;

      // Save token to storage
      storage.setToken(token);

      // Clean up hash from URL
      if (hashToken && typeof window !== "undefined") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else if (!token) {
      // Mark as processed for error cases too
      hasProcessed.current = true;
    }
  }, [token, errorParam, router, hashToken]);

  // Show loading state while processing successful token
  if (token && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-serif font-medium">
            Completing sign in...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we authenticate you.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-medium">
              Authentication Failed
            </h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity font-medium"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-serif font-medium">Loading...</h2>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
