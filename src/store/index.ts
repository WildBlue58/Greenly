import { create } from "zustand";
import { userStore } from "./user";
import { plantStore } from "./plant";
import { careStore } from "./care";
import { aiStore } from "./ai";
import { appStore } from "./app";
import type { User, Plant } from "./types";

// 定义 Store 类型
interface StoreState {
  // User store
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  
  // Plant store
  plants: Plant[];
  currentPlant: Plant | null;
  plantsLoading: boolean;
  fetchPlants: () => Promise<void>;
  addPlant: (plantData: Partial<Plant>) => Promise<Plant>;
  updatePlant: (id: string, plantData: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  setCurrentPlant: (plant: Plant | null) => void;
  fetchPlantById: (id: string) => Promise<Plant>;
  waterPlant: (id: string) => Promise<void>;
  updatePlantHealth: (id: string, health: Plant["health"]) => Promise<void>;
  
  // 其他 store 的方法（根据需要添加）
  [key: string]: any;
}

// 创建主store
export const useStore = create<StoreState>((set, get) => ({
  // 整合所有子store
  ...userStore(set, get),
  ...plantStore(set, get),
  ...careStore(set, get),
  ...aiStore(set, get),
  ...appStore(set, get),
}));
