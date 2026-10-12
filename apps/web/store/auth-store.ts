import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [key: string]: any;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date | string;
  token?: string;
  [key: string]: any;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isInitialized: boolean;
  error: any | null;

  setSession: (user: AuthUser, session: AuthSession | null) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  setLoggingIn: (isLoggingIn: boolean) => void;
  setLoggingOut: (isLoggingOut: boolean) => void;
  setError: (error: any | null) => void;
  syncSession: (
    sessionData: { user?: AuthUser | null; session?: AuthSession | null } | null | undefined,
    isPending: boolean,
    error?: any
  ) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingIn: false,
  isLoggingOut: false,
  isInitialized: false,
  error: null,

  setSession: (user: AuthUser, session: AuthSession | null) => {
    set({
      user,
      session,
      isAuthenticated: true,
      isLoading: false,
      isLoggingIn: false,
      isInitialized: true,
      error: null,
    });
  },

  clearSession: () => {
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      isLoggingOut: false,
      isInitialized: true,
      error: null,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setLoggingIn: (isLoggingIn: boolean) => set({ isLoggingIn }),
  setLoggingOut: (isLoggingOut: boolean) => set({ isLoggingOut }),
  setError: (error: any | null) => set({ error }),

  syncSession: (sessionData, isPending, error) => {
    const state = get();

    if (isPending) {
      if (!state.isInitialized && !state.user) {
        set({ isLoading: true, error: error ?? null });
      }
      return;
    }

    if (sessionData?.user) {
      set({
        user: sessionData.user,
        session: sessionData.session ?? null,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } else {
      // Only set to unauthenticated if we aren't currently in the middle of a login action
      if (!state.isLoggingIn) {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: error ?? null,
        });
      }
    }
  },
}));
