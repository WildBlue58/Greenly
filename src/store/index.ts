import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createUserSlice } from "./user";
import { createPlantSlice } from "./plant";
import { createCareSlice } from "./care";
import { createAiSlice } from "./ai";
import { createAppSlice } from "./app";
import { APP_STORAGE_KEY, STORAGE_VERSION } from "../repositories/appStorage";
import type { AppStore } from "./slices";

/**
 * 全局唯一 store。
 * 持久化由 persist 中间件负责：需要持久化的字段在 partialize 中声明，
 * 其余（loading 标志、会话内状态）不落盘。localStorage 中没有数据时
 * 各 slice 的初始值即种子数据（见 src/mocks/seed.ts）。
 */
export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createPlantSlice(...a),
      ...createCareSlice(...a),
      ...createAiSlice(...a),
      ...createAppSlice(...a),
    }),
    {
      name: APP_STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        plants: state.plants,
        carePlans: state.carePlans,
        careRecords: state.careRecords,
        careTasks: state.careTasks,
        theme: state.theme,
      }),
    }
  )
);
