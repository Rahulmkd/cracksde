import { create } from "zustand";

export interface OnboardingState {
  currentStep: number;
  
  // Step 1: About You
  targetRole: string;
  experience: string;
  targetCompany: string;
  targetRegion: string;
  
  // Step 2: Subjects
  selectedSubjects: string[];
  
  // Step 3: Subject Levels
  subjectLevels: Record<string, string>;
  
  // Step 4: Deleted items in review
  removedItemIds: number[];
  
  // Step 5: Weekly Availability
  availability: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  
  // Step 6: Plan Details
  planName: string;
  startDateOption: "today" | "tomorrow" | "custom";
  customStartDate: string;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTargetRole: (role: string) => void;
  setExperience: (exp: string) => void;
  setTargetCompany: (comp: string) => void;
  setTargetRegion: (region: string) => void;
  toggleSubject: (slug: string) => void;
  setSubjectLevel: (slug: string, level: string) => void;
  toggleRemoveItem: (itemId: number) => void;
  setDayAvailability: (day: keyof OnboardingState["availability"], hours: number) => void;
  setPlanName: (name: string) => void;
  setStartDateOption: (opt: "today" | "tomorrow" | "custom") => void;
  setCustomStartDate: (dateStr: string) => void;
  getTotalWeeklyHours: () => number;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  
  targetRole: "Software Engineer",
  experience: "0 - 2 years",
  targetCompany: "Open to all",
  targetRegion: "India",
  
  selectedSubjects: ["dsa", "dbms", "operating-systems", "computer-networks", "oops", "lld"],
  
  subjectLevels: {
    dsa: "Pattern Mastery",
    dbms: "Interview Preparation",
    "operating-systems": "Interview Preparation",
    "computer-networks": "Interview Preparation",
    oops: "Interview Preparation",
    lld: "Interview Preparation",
  },
  
  removedItemIds: [],
  
  availability: {
    monday: 4,
    tuesday: 4,
    wednesday: 4,
    thursday: 4,
    friday: 4,
    saturday: 8,
    sunday: 8,
  },
  
  planName: "Crack SDE",
  startDateOption: "custom",
  customStartDate: "2026-10-01",
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  
  setTargetRole: (role) => set({ targetRole: role }),
  setExperience: (exp) => set({ experience: exp }),
  setTargetCompany: (comp) => set({ targetCompany: comp }),
  setTargetRegion: (reg) => set({ targetRegion: reg }),
  
  toggleSubject: (slug) =>
    set((s) => {
      const exists = s.selectedSubjects.includes(slug);
      return {
        selectedSubjects: exists
          ? s.selectedSubjects.filter((x) => x !== slug)
          : [...s.selectedSubjects, slug],
      };
    }),
    
  setSubjectLevel: (slug, level) =>
    set((s) => ({
      subjectLevels: { ...s.subjectLevels, [slug]: level },
    })),
    
  toggleRemoveItem: (itemId) =>
    set((s) => {
      const exists = s.removedItemIds.includes(itemId);
      return {
        removedItemIds: exists
          ? s.removedItemIds.filter((id) => id !== itemId)
          : [...s.removedItemIds, itemId],
      };
    }),
    
  setDayAvailability: (day, hours) =>
    set((s) => ({
      availability: { ...s.availability, [day]: hours },
    })),
    
  setPlanName: (name) => set({ planName: name }),
  setStartDateOption: (opt) => set({ startDateOption: opt }),
  setCustomStartDate: (dateStr) => set({ customStartDate: dateStr }),
  
  getTotalWeeklyHours: () => {
    const a = get().availability;
    return a.monday + a.tuesday + a.wednesday + a.thursday + a.friday + a.saturday + a.sunday;
  },
  
  resetOnboarding: () =>
    set({
      currentStep: 1,
      targetRole: "Software Engineer",
      experience: "0 - 2 years",
      targetCompany: "Open to all",
      targetRegion: "India",
      selectedSubjects: ["dsa", "dbms", "operating-systems", "computer-networks", "oops", "lld"],
      removedItemIds: [],
      planName: "Crack SDE",
    }),
}));
