import type { StateCreator } from "zustand";
import type {
  User,
  Plant,
  CarePlan,
  CareRecord,
  CareTask,
  ChatMessage,
} from "./types";

export type Theme = "light" | "dark";

/**
 * 各 slice 的统一构造器签名：
 * 带 persist 中间件变体标记，保证 slice 内 set/get 拿到完整 AppStore 类型。
 */
export type SliceCreator<T> = StateCreator<
  AppStore,
  [["zustand/persist", unknown]],
  [],
  T
>;

// 用户 slice
export interface UserSlice {
  user: User | null;
  /** 更新用户资料（部分字段合并） */
  updateProfile: (profile: Partial<User>) => Promise<void>;
  /** 退出登录：重置为默认访客身份（本应用为免登录 demo） */
  logout: () => void;
}

// 植物 slice
export interface PlantSlice {
  plants: Plant[];
  currentPlant: Plant | null;
  plantsLoading: boolean;
  addPlant: (plantData: Partial<Plant>) => Promise<Plant>;
  updatePlant: (id: string, plantData: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  setCurrentPlant: (plant: Plant | null) => void;
}

// 养护 slice
export interface CareActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CareSlice {
  carePlans: CarePlan[];
  careRecords: CareRecord[];
  careTasks: CareTask[];
  addCareTask: (taskData: Partial<CareTask>) => Promise<CareActionResult<CareTask>>;
  updateCareTask: (id: string, taskData: Partial<CareTask>) => Promise<CareActionResult>;
  completeCareTask: (id: string) => Promise<CareActionResult>;
  deleteCareTask: (id: string) => Promise<CareActionResult>;
  addCareRecord: (recordData: Partial<CareRecord>) => Promise<CareActionResult<CareRecord>>;
  deleteCareRecord: (id: string) => Promise<CareActionResult>;
}

// AI slice
export interface AiSlice {
  chatMessages: ChatMessage[];
  aiLoading: boolean;
  sendChatMessage: (message: string, model?: string) => Promise<void>;
  clearChat: () => void;
}

// 应用设置 slice
export interface AppSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type AppStore = UserSlice & PlantSlice & CareSlice & AiSlice & AppSlice;
