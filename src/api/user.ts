import { api } from '../utils/request';
import type { User, LoginCredentials, RegisterData } from '../store/types';

// 用户认证相关 API
export const authAPI = {
  // 用户登录
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    return api.post('/auth/login', credentials);
  },

  // 用户注册
  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    return api.post('/auth/register', userData);
  },

  // 用户登出
  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    return api.get('/auth/me');
  },

  // 刷新 token
  refreshToken: async (): Promise<{ token: string }> => {
    return api.post('/auth/refresh');
  },
};

// 用户资料相关 API
export const userAPI = {
  // 获取用户资料
  getProfile: async (): Promise<User> => {
    return api.get('/user/profile');
  },

  // 更新用户资料
  updateProfile: async (profile: Partial<User>): Promise<User> => {
    return api.put('/user/profile', profile);
  },

  // 更新用户头像
  updateAvatar: async (avatarFile: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return api.upload('/user/avatar', formData);
  },

  // 修改密码
  changePassword: async (passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    return api.put('/user/password', passwordData);
  },

  // 删除账户
  deleteAccount: async (): Promise<void> => {
    return api.delete('/user/account');
  },
};

// 用户统计相关 API
export const userStatsAPI = {
  // 获取用户统计信息
  getStats: async (): Promise<{
    totalPlants: number;
    totalCareTasks: number;
    completedTasks: number;
    overdueTasks: number;
    joinDays: number;
  }> => {
    return api.get('/user/stats');
  },

  // 获取用户活动记录
  getActivityLog: async (params?: {
    page?: number;
    pageSize?: number;
    type?: string;
  }): Promise<{
    activities: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }> => {
    return api.get('/user/activities', { params });
  },
};

// 用户设置相关 API
export const userSettingsAPI = {
  // 获取用户设置
  getSettings: async (): Promise<{
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      plantsVisible: boolean;
    };
    preferences: {
      language: string;
      theme: string;
      timezone: string;
    };
  }> => {
    return api.get('/user/settings');
  },

  // 更新用户设置
  updateSettings: async (settings: any): Promise<void> => {
    return api.put('/user/settings', settings);
  },

  // 获取通知设置
  getNotificationSettings: async (): Promise<{
    email: boolean;
    push: boolean;
    sms: boolean;
    wateringReminders: boolean;
    careTaskReminders: boolean;
    plantHealthAlerts: boolean;
  }> => {
    return api.get('/user/settings/notifications');
  },

  // 更新通知设置
  updateNotificationSettings: async (settings: any): Promise<void> => {
    return api.put('/user/settings/notifications', settings);
  },
};

// 导出所有用户相关 API
export const userAPIs = {
  auth: authAPI,
  profile: userAPI,
  stats: userStatsAPI,
  settings: userSettingsAPI,
};
