"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { storage } from "./storage";
import { authClient } from "./auth-client";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface ErrorResponse {
  message?: string;
  detail?: string;
  error?: {
    message?: string;
    detail?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state and handle route protection
  useEffect(() => {
    const initAuth = () => {
      const token = storage.getToken();
      const storedUser = storage.getUser<User>();

      // Check current path for route protection
      const isAuthPage = pathname === "/login" || pathname === "/signup";
      const isProtectedPage = pathname.startsWith("/dashboard");

      const checkUser = async () => {
        if (token) {
          if (storedUser) {
            setUser(storedUser);
            if (isAuthPage) router.replace("/dashboard");
          } else {
            // Fetch user from backend if we have token but no user details
            try {
              // Dynamically import to avoid circular dependencies if any
              const { authAPI } = await import("./api");
              const userProfile = await authAPI.getCurrentUser();
              setUser(userProfile);
              storage.setUser(userProfile);
              if (isAuthPage) router.replace("/dashboard");
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
              // If fetching user fails, token might be invalid
              storage.clear();
              setUser(null);
            }
          }
        } else {
          setUser(null);
          if (isProtectedPage) router.replace("/login");
        }
        setLoading(false);
      };

      checkUser();
    };

    initAuth();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        // Better Auth wraps the error, try to extract the actual message
        const error = result.error as unknown as ErrorResponse;
        const errorMessage =
          result.error.message || error.detail || "Login failed";
        throw new Error(errorMessage);
      }

      // Backend returns { access_token, token_type } in the data property
      interface AuthResponse {
        access_token?: string;
        user?: User;
      }
      const data = result.data as AuthResponse;
      const access_token = data?.access_token;
      // Backend login doesn't currently return the user object, so we use the email
      // If backend is updated to return user, we can use data.user
      const apiUser = data?.user;

      if (!access_token) {
        // Fallback: If better-auth client handled the response differently or didn't parse JSON as expected
        // This relies on the backend returning JSON matching Login schema
        // For debugging, we might check result
        throw new Error("No access token received from server");
      }

      storage.setToken(access_token);

      const userData: User = apiUser || {
        id: "me",
        email: email,
      };

      setUser(userData);
      storage.setUser(userData);

      router.push("/dashboard");
    } catch (error: unknown) {
      // If it's already an Error we threw, re-throw it
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        throw error;
      }

      // Try to extract error message from response
      if (typeof error === "object" && error !== null) {
        const errorObj = error as ErrorResponse;
        const errorMessage =
          errorObj.message ||
          errorObj.detail ||
          errorObj.error?.message ||
          errorObj.error?.detail ||
          "Invalid email or password";
        throw new Error(errorMessage);
      }

      throw new Error("Invalid email or password");
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // Better Auth expects name in the object
      const result = await authClient.signUp.email({
        email,
        password,
        name: name || "", // backend treats name as optional string
      });

      if (result.error) {
        // Better Auth wraps the error, try to extract the actual message
        const error = result.error as unknown as ErrorResponse;
        const errorMessage =
          result.error.message || error.detail || "Signup failed";
        throw new Error(errorMessage);
      }

      // After signup, we log the user in
      await login(email, password);
    } catch (error: unknown) {
      // If it's already an Error we threw, re-throw it
      if (error instanceof Error) {
        console.error("Signup failed:", error.message);
        throw error;
      }

      // Try to extract error message from response
      if (typeof error === "object" && error !== null) {
        const errorObj = error as ErrorResponse;
        const errorMessage =
          errorObj.message ||
          errorObj.detail ||
          errorObj.error?.message ||
          errorObj.error?.detail ||
          "Failed to create account. Please try again.";
        throw new Error(errorMessage);
      }

      throw new Error("Failed to create account. Please try again.");
    }
  };

  const logout = useCallback(async () => {
    try {
      // Attempt server-side sign out if supported
      await authClient.signOut();
    } catch {
      // Ignore checking error on logout
    }
    storage.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  const isAuthenticated = () => {
    return !!user && !!storage.getToken();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
