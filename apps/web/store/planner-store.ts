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
  addTask: (title: string, duration?: string, category?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
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
      toggleTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      deleteTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: "cracksde-daily-planner-storage",
    }
  )
);
