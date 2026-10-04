import type { CareRecord, CareTask } from "./types";
import type { CareActionResult, CareSlice, SliceCreator } from "./slices";
import { seedCarePlans, seedCareRecords, seedCareTasks } from "../mocks/seed";

const createId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createCareSlice: SliceCreator<CareSlice> = (set) => ({
  carePlans: seedCarePlans,
  careRecords: seedCareRecords,
  careTasks: seedCareTasks,

  addCareTask: async (
    taskData: Partial<CareTask>
  ): Promise<CareActionResult<CareTask>> => {
    try {
      const newTask: CareTask = {
        plantId: "",
        plantName: "",
        type: "water",
        title: "新任务",
        description: "",
        dueDate: new Date().toISOString(),
        completed: false,
        priority: "medium",
        ...taskData,
        id: createId("task"),
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ careTasks: [...state.careTasks, newTask] }));
      return { success: true, data: newTask };
    } catch (error) {
      console.error("添加养护任务失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "添加任务失败",
      };
    }
  },

  updateCareTask: async (id: string, taskData: Partial<CareTask>) => {
    try {
      set((state) => ({
        careTasks: state.careTasks.map((task) =>
          task.id === id ? { ...task, ...taskData } : task
        ),
      }));
      return { success: true };
    } catch (error) {
      console.error("更新养护任务失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "更新任务失败",
      };
    }
  },

  completeCareTask: async (id: string) => {
    try {
      set((state) => ({
        careTasks: state.careTasks.map((task) =>
          task.id === id
            ? { ...task, completed: true, completedAt: new Date().toISOString() }
            : task
        ),
      }));
      return { success: true };
    } catch (error) {
      console.error("完成任务失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "完成任务失败",
      };
    }
  },

  deleteCareTask: async (id: string) => {
    try {
      set((state) => ({
        careTasks: state.careTasks.filter((task) => task.id !== id),
      }));
      return { success: true };
    } catch (error) {
      console.error("删除养护任务失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "删除任务失败",
      };
    }
  },

  addCareRecord: async (
    recordData: Partial<CareRecord>
  ): Promise<CareActionResult<CareRecord>> => {
    try {
      const newRecord: CareRecord = {
        plantId: "",
        plantName: "",
        type: "water",
        title: "养护记录",
        description: "",
        ...recordData,
        id: createId("record"),
        completedAt: new Date().toISOString(),
      };

      set((state) => ({ careRecords: [...state.careRecords, newRecord] }));
      return { success: true, data: newRecord };
    } catch (error) {
      console.error("添加养护记录失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "添加记录失败",
      };
    }
  },

  deleteCareRecord: async (id: string) => {
    try {
      set((state) => ({
        careRecords: state.careRecords.filter((record) => record.id !== id),
      }));
      return { success: true };
    } catch (error) {
      console.error("删除养护记录失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "删除记录失败",
      };
    }
  },
});
