// auth.ts
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import axios from "axios";

interface DatabaseUserAttributes {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  isActive: boolean;
}

interface AuthResponse {
  user: DatabaseUserAttributes | null;
  session: {
    id: string;
    fresh?: boolean;
    expiresAt?: Date;
  } | null;
  error?: string;
}

// Initialize Lucia with more secure defaults
export const lucia = new Lucia({
  sessionCookie: {
    expires: false, // Session cookie
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
    },
  },
  getUserAttributes: (attributes: DatabaseUserAttributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      email: attributes.email,
      displayName: attributes.displayName,
      avatarUrl: attributes.avatarUrl,
      isActive: attributes.isActive,
    };
  },
});

// Type augmentation for Lucia
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    return Promise.reject(error);
  }
);

// Enhanced session validation
export const validateRequest = cache(
  async (): Promise<{ user: User | null; session: Session | null }> => {
    const sessionCookies = await cookies();
    const sessionId = sessionCookies.get(lucia.sessionCookieName)?.value ?? null;
    const csrfToken = sessionCookies.get("csrftoken")?.value;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    try {
      const { data: result } = await api.post<AuthResponse>(
        "/validate-session/",
        { sessionId },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Handle session refresh
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      // Clear session if invalid
      if (!result.session) {
        const blankSessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          blankSessionCookie.name,
          blankSessionCookie.value,
          blankSessionCookie.attributes
        );
      }

      return {
        user: result.user as User,
        session: result.session as Session,
      };
    } catch (error) {
      console.error("Session validation error:", error);
      // Clear session on error
      const blankSessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        blankSessionCookie.name,
        blankSessionCookie.value,
        blankSessionCookie.attributes
      );
      return {
        user: null,
        session: null,
      };
    }
  }
);

// Enhanced login handler with better error handling and types
export const handleLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const csrfToken = (await cookies()).get("csrftoken")?.value;
    
    const { data } = await api.post<AuthResponse>(
      "/login/",
      { email, password },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (data.session && data.user) {
      const sessionCookie = lucia.createSessionCookie(data.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return data;
    }

    throw new Error(data.error || "Login failed");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "Unable to login. Please try again.";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Logout handler
export const handleLogout = async (): Promise<void> => {
  try {
    const csrfToken = (await cookies()).get("csrftoken")?.value;
    
    await api.post("/logout/", {}, {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });

    const blankSessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      blankSessionCookie.name,
      blankSessionCookie.value,
      blankSessionCookie.attributes
    );
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Unable to logout. Please try again.");
  }
};