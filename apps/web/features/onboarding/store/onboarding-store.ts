import { create } from "zustand";
import {
  DEFAULT_SELECTED_SUBJECTS,
  getTodayDateString,
} from "@/constants/onboarding-options";

export interface OnboardingAvailability {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export const DEFAULT_AVAILABILITY: OnboardingAvailability = {
  monday: 4,
  tuesday: 4,
  wednesday: 4,
  thursday: 4,
  friday: 4,
  saturday: 8,
  sunday: 8,
};

export interface OnboardingState {
  currentStep: number;

  // Profile info for display
  targetRole: string;
  experience: string;

  // Step 1: Subjects
  selectedSubjects: string[];

  // Step 2: Weekly Availability
  availability: OnboardingAvailability;

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
  selectAllSubjects: () => void;
  clearAllSubjects: () => void;
  setDayAvailability: (day: keyof OnboardingAvailability, hours: number) => void;
  resetAvailability: () => void;
  setPlanName: (name: string) => void;
  setStartDateOption: (opt: "today" | "tomorrow" | "custom") => void;
  setCustomStartDate: (dateStr: string) => void;
  getTotalWeeklyHours: () => number;
  resetOnboarding: (initialValues?: Partial<OnboardingState>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,

  targetRole: "Software Engineer",
  experience: "0 - 2 years",

  selectedSubjects: [...DEFAULT_SELECTED_SUBJECTS],

  availability: { ...DEFAULT_AVAILABILITY },

  planName: "Crack SDE",
  startDateOption: "today",
  customStartDate: getTodayDateString(),

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

  setSelectedSubjects: (subjects) => set({ selectedSubjects: [...subjects] }),
  selectAllSubjects: () => set({ selectedSubjects: [...DEFAULT_SELECTED_SUBJECTS] }),
  clearAllSubjects: () => set({ selectedSubjects: [] }),

  setDayAvailability: (day, hours) =>
    set((s) => ({
      availability: { ...s.availability, [day]: Math.max(0, Math.min(hours, 24)) },
    })),

  resetAvailability: () => set({ availability: { ...DEFAULT_AVAILABILITY } }),

  setPlanName: (name) => set({ planName: name }),
  setStartDateOption: (opt) => set({ startDateOption: opt }),
  setCustomStartDate: (dateStr) => set({ customStartDate: dateStr }),

  getTotalWeeklyHours: () => {
    const a = get().availability;
    return (
      (a.monday || 0) +
      (a.tuesday || 0) +
      (a.wednesday || 0) +
      (a.thursday || 0) +
      (a.friday || 0) +
      (a.saturday || 0) +
      (a.sunday || 0)
    );
  },

  resetOnboarding: (initialValues?: Partial<OnboardingState>) =>
    set({
      currentStep: initialValues?.currentStep ?? 1,
      targetRole: initialValues?.targetRole ?? "Software Engineer",
      experience: initialValues?.experience ?? "0 - 2 years",
      selectedSubjects: initialValues?.selectedSubjects
        ? [...initialValues.selectedSubjects]
        : [...DEFAULT_SELECTED_SUBJECTS],
      availability: initialValues?.availability
        ? { ...initialValues.availability }
        : { ...DEFAULT_AVAILABILITY },
      planName: initialValues?.planName ?? "Crack SDE",
      startDateOption: initialValues?.startDateOption ?? "today",
      customStartDate: initialValues?.customStartDate ?? getTodayDateString(),
    }),
}));

