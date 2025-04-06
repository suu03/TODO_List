import { create } from "zustand";
import type { Task, Category } from "../types";

interface TaskState {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Task) => void;
  addCategory: (category: Category) => void;
  toggleTaskComplete: (taskId: string) => void;
  selectedTask: Task | null | undefined;
  setSelectedTask: (task: Task | null | undefined) => void;
  deleteTask: (taskId: string) => void;
}

// Helper function to load data from localStorage
const loadFromLocalStorage = () => {
  if (typeof window === "undefined") {
    return { tasks: [], categories: [] };
  }

  try {
    const tasksJson = localStorage.getItem("tasks");
    const categoriesJson = localStorage.getItem("categories");

    const tasks = tasksJson
      ? JSON.parse(tasksJson).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: new Date(task.dueDate),
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        }))
      : [];

    const categories = categoriesJson ? JSON.parse(categoriesJson) : [];

    return { tasks, categories };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return { tasks: [], categories: [] };
  }
};

// Initial data from localStorage
const { tasks: initialTasks, categories: initialCategories } =
  loadFromLocalStorage();

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  categories: initialCategories,
  selectedTask: undefined,
  addTask: (task) =>
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),
  addCategory: (category) =>
    set((state) => {
      const newCategories = [...state.categories, category];
      localStorage.setItem("categories", JSON.stringify(newCategories));
      return { categories: newCategories };
    }),
  toggleTaskComplete: (taskId) =>
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      );

      localStorage.setItem("tasks", JSON.stringify(newTasks));

      return {
        tasks: newTasks,
        selectedTask:
          state.selectedTask?.id === taskId
            ? {
                ...state.selectedTask,
                completed: !state.selectedTask.completed,
                completedAt: !state.selectedTask.completed
                  ? new Date()
                  : undefined,
              }
            : state.selectedTask,
      };
    }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  deleteTask: (taskId) =>
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(newTasks));

      return {
        tasks: newTasks,
        selectedTask:
          state.selectedTask?.id === taskId ? null : state.selectedTask,
      };
    }),
}));
