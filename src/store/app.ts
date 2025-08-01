import type { Notification } from "./types";

// 应用全局状态管理
export const appStore = (set: any, get: any) => ({
  theme: "light" as "light" | "dark",
  language: "zh-CN" as "zh-CN" | "en-US",
  notifications: [] as Notification[],

  // 设置主题
  setTheme: (theme: "light" | "dark") => {
    set({ theme });
    // 保存到本地存储
    localStorage.setItem("theme", theme);
    // 应用到DOM
    document.documentElement.setAttribute("data-theme", theme);
  },

  // 设置语言
  setLanguage: (language: "zh-CN" | "en-US") => {
    set({ language });
    // 保存到本地存储
    localStorage.setItem("language", language);
  },

  // 添加通知
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    set((state: any) => ({ 
      notifications: [...state.notifications, newNotification] 
    }));

    // 自动移除通知（5秒后）
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },

  // 移除通知
  removeNotification: (id: string) => {
    set((state: any) => ({
      notifications: state.notifications.filter((n: Notification) => n.id !== id),
    }));
  },

  // 清空所有通知
  clearNotifications: () => {
    set({ notifications: [] });
  },

  // 标记通知为已读
  markNotificationAsRead: (id: string) => {
    set((state: any) => ({
      notifications: state.notifications.map((n: Notification) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  // 获取未读通知数量
  getUnreadNotificationCount: () => {
    const { notifications } = get();
    return notifications.filter((n: Notification) => !n.read).length;
  },

  // 初始化应用设置
  initializeApp: () => {
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedLanguage = localStorage.getItem("language") as "zh-CN" | "en-US" | null;

    if (savedTheme) {
      set({ theme: savedTheme });
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    if (savedLanguage) {
      set({ language: savedLanguage });
    }
  },

  // 获取应用统计信息
  getAppStats: () => {
    const { plants, careTasks, chatMessages } = get();
    
    return {
      totalPlants: plants.length,
      totalTasks: careTasks.length,
      completedTasks: careTasks.filter((task: any) => task.completed).length,
      chatMessages: chatMessages.length,
      unreadNotifications: get().getUnreadNotificationCount(),
    };
  },

  // 导出数据
  exportData: () => {
    const { plants, careRecords, careTasks } = get();
    
    const data = {
      plants,
      careRecords,
      careTasks,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greenly-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // 导入数据
  importData: async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // 验证数据格式
      if (!data.plants || !data.careRecords || !data.careTasks) {
        throw new Error("数据格式不正确");
      }

      // 这里可以添加数据导入逻辑
      console.log("导入数据:", data);
      
      // 显示成功通知
      get().addNotification({
        type: "success",
        title: "数据导入成功",
        message: `成功导入 ${data.plants.length} 个植物，${data.careRecords.length} 条养护记录`,
      });
    } catch (error) {
      console.error("数据导入失败:", error);
      
      // 显示错误通知
      get().addNotification({
        type: "error",
        title: "数据导入失败",
        message: "请检查文件格式是否正确",
      });
    }
  },

  // 重置应用数据
  resetAppData: () => {
    if (confirm("确定要重置所有数据吗？此操作不可恢复。")) {
      // 清空所有数据
      set({
        plants: [],
        carePlans: [],
        careRecords: [],
        careTasks: [],
        chatMessages: [],
        recognitionResult: null,
        generationResults: [],
        notifications: [],
      });

      // 显示成功通知
      get().addNotification({
        type: "success",
        title: "数据重置成功",
        message: "所有数据已清空",
      });
    }
  },

  // 获取应用版本信息
  getAppVersion: () => {
    return {
      version: "1.0.0",
      buildDate: "2024-01-01",
      environment: import.meta.env.MODE,
    };
  },

  // 检查更新
  checkForUpdates: async () => {
    try {
      const response = await fetch("/api/app/version");
      if (response.ok) {
        const data = await response.json();
        const currentVersion = "1.0.0";
        
        if (data.version !== currentVersion) {
          get().addNotification({
            type: "info",
            title: "发现新版本",
            message: `新版本 ${data.version} 可用，请更新应用`,
          });
        }
      }
    } catch (error) {
      console.error("检查更新失败:", error);
    }
  },
});
