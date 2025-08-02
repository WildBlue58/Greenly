import type { User, LoginCredentials, RegisterData } from "./types";

// 模拟用户数据
const mockUser: User = {
  id: "1",
  name: "植物爱好者",
  email: "user@example.com",
  avatar: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=100&h=100&fit=crop",
  phone: "13800138000",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 用户状态管理
export const userStore = (set: any, get: any) => ({
  user: null as User | null,
  isAuthenticated: false,
  loading: false,

  // 登录
  login: async (credentials: LoginCredentials) => {
    set({ loading: true });
    try {
      // 模拟登录成功
      console.log("模拟登录成功");
      const mockToken = "mock-jwt-token-" + Date.now();
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      set({
        user: mockUser,
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
      // 模拟注册成功
      console.log("模拟注册成功");
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = "mock-jwt-token-" + Date.now();
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      set({
        user: newUser,
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
    localStorage.removeItem("user");
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  // 更新用户资料
  updateProfile: async (profile: Partial<User>) => {
    set({ loading: true });
    try {
      const currentUser = get().user;
      const updatedUser = { ...currentUser, ...profile, updatedAt: new Date().toISOString() };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      set({
        user: updatedUser,
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
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("检查登录状态失败:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
});
