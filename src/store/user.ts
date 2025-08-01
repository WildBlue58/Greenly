import type { User, LoginCredentials, RegisterData } from "./types";

// 用户状态管理
export const userStore = (set: any, get: any) => ({
  user: null as User | null,
  isAuthenticated: false,
  loading: false,

  // 登录
  login: async (credentials: LoginCredentials) => {
    set({ loading: true });
    try {
      // 模拟API调用
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("登录失败");
      }

      const data = await response.json();
      
      // 存储token
      localStorage.setItem("token", data.token);
      
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error("登录失败:", error);
      set({ loading: false });
      throw error;
    }
  },

  // 注册
  register: async (userData: RegisterData) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("注册失败");
      }

      const data = await response.json();
      
      // 存储token
      localStorage.setItem("token", data.token);
      
      set({
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error("注册失败:", error);
      set({ loading: false });
      throw error;
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  // 更新用户资料
  updateProfile: async (profile: Partial<User>) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("更新资料失败");
      }

      const data = await response.json();
      
      set({
        user: data.user,
        loading: false,
      });
    } catch (error) {
      console.error("更新资料失败:", error);
      set({ loading: false });
      throw error;
    }
  },

  // 检查登录状态
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({
          user: data.user,
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem("token");
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("检查登录状态失败:", error);
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
});
