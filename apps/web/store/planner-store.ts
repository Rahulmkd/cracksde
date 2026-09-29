import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DailyTask {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  category?: string;
  createdAt: number;
}

interface PlannerState {
  tasks: DailyTask[];
  points: number;
  streak: number;
  lastActiveDate: string | null;
  addTask: (title: string, duration?: string, category?: string) => void;
  importTasks: (newTasks: Array<{ title: string; duration?: string; category?: string }>) => number;
  toggleTask: (id: string) => boolean; // returns true if now completed
  deleteTask: (id: string) => void;
  clearTasks: () => void;
  addPoints: (pts: number) => void;
  checkInStreak: () => void;
}

const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: "1",
          title: "Two Sum & Pair with Target Sum",
          duration: "15m",
          completed: false,
          category: "DSA",
          createdAt: Date.now() - 3600000,
        },
        {
          id: "2",
          title: "Review DBMS Indexing & B-Trees",
          duration: "25m",
          completed: false,
          category: "DBMS",
          createdAt: Date.now() - 1800000,
        },
        {
          id: "3",
          title: "Process Synchronization & Mutex",
          duration: "20m",
          completed: false,
          category: "OS",
          createdAt: Date.now() - 900000,
        },
      ],
      points: 315,
      streak: 3,
      lastActiveDate: getTodayDateString(),

      addTask: (title: string, duration = "15m", category = "Custom") =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title: title.trim(),
              duration: duration.trim(),
              completed: false,
              category,
              createdAt: Date.now(),
            },
          ],
        })),

      importTasks: (newTasks) => {
        const state = get();
        const existingTitles = new Set(state.tasks.map((t) => t.title.toLowerCase()));
        const uniqueToAdd: DailyTask[] = [];

        newTasks.forEach((item, index) => {
          if (!existingTitles.has(item.title.toLowerCase())) {
            uniqueToAdd.push({
              id: `imported-${Date.now()}-${index}`,
              title: item.title,
              duration: item.duration || "20m",
              completed: false,
              category: item.category || "Sprint",
              createdAt: Date.now() + index,
            });
            existingTitles.add(item.title.toLowerCase());
          }
        });

        if (uniqueToAdd.length > 0) {
          set({ tasks: [...state.tasks, ...uniqueToAdd] });
        }

        return uniqueToAdd.length;
      },

      toggleTask: (id: string) => {
        let isNowCompleted = false;
        set((state) => {
          const updated = state.tasks.map((t) => {
            if (t.id === id) {
              isNowCompleted = !t.completed;
              return { ...t, completed: isNowCompleted };
            }
            return t;
          });

          const nextPoints = isNowCompleted ? state.points + 15 : Math.max(0, state.points - 15);
          return {
            tasks: updated,
            points: nextPoints,
          };
        });
        get().checkInStreak();
        return isNowCompleted;
      },

      deleteTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      clearTasks: () => set({ tasks: [] }),

      addPoints: (pts: number) =>
        set((state) => ({
          points: state.points + pts,
        })),

      checkInStreak: () => {
        const today = getTodayDateString();
        const { lastActiveDate, streak } = get();

        if (lastActiveDate === today) {
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

        if (lastActiveDate === yStr) {
          set({ streak: streak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },
    }),
    {
      name: "cracksde-daily-planner-storage",
    }
  )
);
