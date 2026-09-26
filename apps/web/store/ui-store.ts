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
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  togglePrepOpen: () => void;
  toggleExploreOpen: () => void;
  toggleSpacesOpen: () => void;
  setActiveNavRect: (rect: NavRect | null) => void;
  setActiveNavHref: (href: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  prepOpen: true,
  exploreOpen: true,
  spacesOpen: true,
  activeNavRect: null,
  activeNavHref: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  togglePrepOpen: () => set((state) => ({ prepOpen: !state.prepOpen })),
  toggleExploreOpen: () => set((state) => ({ exploreOpen: !state.exploreOpen })),
  toggleSpacesOpen: () => set((state) => ({ spacesOpen: !state.spacesOpen })),
  setActiveNavRect: (rect) => set({ activeNavRect: rect }),
  setActiveNavHref: (href) => set({ activeNavHref: href }),
}));
