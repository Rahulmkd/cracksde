import { create } from "zustand";

export interface OnboardingState {
  currentStep: number;

  // Profile info for display
  targetRole: string;
  experience: string;

  // Step 1: Subjects
  selectedSubjects: string[];

  // Step 2: Weekly Availability
  availability: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };

  // Step 3: Plan Details
  planName: string;
  startDateOption: "today" | "tomorrow" | "custom";
  customStartDate: string;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTargetRole: (role: string) => void;
  setExperience: (exp: string) => void;
  toggleSubject: (slug: string) => void;
  setSelectedSubjects: (subjects: string[]) => void;
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

  selectedSubjects: ["dsa", "dbms", "operating-systems", "computer-networks", "oops", "lld"],

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

  setStep: (step) => set({ currentStep: Math.max(1, Math.min(step, 3)) }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setTargetRole: (role) => set({ targetRole: role }),
  setExperience: (exp) => set({ experience: exp }),

  toggleSubject: (slug) =>
    set((s) => {
      const exists = s.selectedSubjects.includes(slug);
      return {
        selectedSubjects: exists
          ? s.selectedSubjects.filter((x) => x !== slug)
          : [...s.selectedSubjects, slug],
      };
    }),

  setSelectedSubjects: (subjects) => set({ selectedSubjects: subjects }),

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
      selectedSubjects: ["dsa", "dbms", "operating-systems", "computer-networks", "oops", "lld"],
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
    }),
}));
