import { create } from "zustand";

export interface NavRect {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  prepOpen: boolean;
  exploreOpen: boolean;
  spacesOpen: boolean;
  activeNavRect: NavRect | null;
  activeNavHref: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  togglePrepOpen: () => void;
  toggleExploreOpen: () => void;
  toggleSpacesOpen: () => void;
  setActiveNavRect: (rect: NavRect | null) => void;
  setActiveNavHref: (href: string | null) => void;
}

const getInitialSidebarState = (): boolean => {
  if (typeof window !== "undefined") {
    return window.innerWidth >= 1024;
  }
  return true;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: getInitialSidebarState(),
  mobileMenuOpen: false,
  prepOpen: true,
  exploreOpen: true,
  spacesOpen: true,
  activeNavRect: null,
  activeNavHref: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
  togglePrepOpen: () => set((state) => ({ prepOpen: !state.prepOpen })),
  toggleExploreOpen: () => set((state) => ({ exploreOpen: !state.exploreOpen })),
  toggleSpacesOpen: () => set((state) => ({ spacesOpen: !state.spacesOpen })),
  setActiveNavRect: (rect) => set({ activeNavRect: rect }),
  setActiveNavHref: (href) => set({ activeNavHref: href }),
}));
