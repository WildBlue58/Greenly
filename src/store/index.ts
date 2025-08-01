import { create } from "zustand";
import { userStore } from "./user";
import { plantStore } from "./plant";
import { careStore } from "./care";
import { aiStore } from "./ai";
import { appStore } from "./app";

// 创建主store
export const useStore = create((set, get) => ({
  // 整合所有子store
  ...userStore(set, get),
  ...plantStore(set, get),
  ...careStore(set, get),
  ...aiStore(set, get),
  ...appStore(set, get),
}));
