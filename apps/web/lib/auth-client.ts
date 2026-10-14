import { createAuthClient } from "better-auth/react";

function getAuthBaseURL(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    // If NEXT_PUBLIC_API_URL is configured and is NOT localhost, use it (e.g. production domain)
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
    // Otherwise in browser, use window.location.origin.
    // Next.js rewrites proxy /api/auth/* to the backend API.
    // This avoids mobile loopback errors (attempting to reach localhost:5001 on the mobile phone)
    // and eliminates third-party cookie restrictions in Safari iOS and Chrome Android.
    return window.location.origin;
  }
  return envUrl || process.env.API_URL || "http://localhost:5001";
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    onRequest: (context) => {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("cracksde_auth_token");
          if (token) {
            context.headers.set("Authorization", `Bearer ${token}`);
          }
        } catch {}
      }
    },
    onResponse: (context) => {
      if (typeof window !== "undefined") {
        try {
          const authToken = context.response.headers.get("set-auth-token");
          if (authToken) {
            localStorage.setItem("cracksde_auth_token", authToken);
          }
        } catch {}
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
