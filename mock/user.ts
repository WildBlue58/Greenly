import type { User, LoginCredentials, RegisterData } from '../src/store/types';

// 模拟用户数据
export const mockUser: User = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  phone: '13800138000',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

// 模拟登录凭据
export const mockLoginCredentials: LoginCredentials = {
  email: 'zhangsan@example.com',
  password: 'password123',
};

// 模拟注册数据
export const mockRegisterData: RegisterData = {
  name: '李四',
  email: 'lisi@example.com',
  password: 'password123',
  phone: '13900139000',
};

// 模拟用户统计信息
export const mockUserStats = {
  totalPlants: 5,
  totalCareTasks: 12,
  completedTasks: 8,
  overdueTasks: 2,
  joinDays: 15,
};

// 模拟用户活动记录
export const mockUserActivities = {
  activities: [
    {
      id: '1',
      type: 'plant_added',
      description: '添加了新植物：绿萝',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'care_completed',
      description: '完成了养护任务：给多肉植物浇水',
      timestamp: '2024-01-14T14:20:00Z',
    },
    {
      id: '3',
      type: 'plant_updated',
      description: '更新了植物信息：君子兰',
      timestamp: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      type: 'care_reminder',
      description: '设置了养护提醒：发财树修剪',
      timestamp: '2024-01-12T16:45:00Z',
    },
    {
      id: '5',
      type: 'ai_chat',
      description: '使用了AI聊天功能',
      timestamp: '2024-01-11T11:30:00Z',
    },
  ],
  total: 5,
  page: 1,
  pageSize: 10,
};

// 模拟用户设置
export const mockUserSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  privacy: {
    profileVisible: true,
    plantsVisible: false,
  },
  preferences: {
    language: 'zh-CN',
    theme: 'light',
    timezone: 'Asia/Shanghai',
  },
};

// 模拟通知设置
export const mockNotificationSettings = {
  email: true,
  push: true,
  sms: false,
  wateringReminders: true,
  careTaskReminders: true,
  plantHealthAlerts: true,
};

// 模拟认证token
export const mockAuthToken = 'mock-jwt-token-123456789';

// 模拟登录响应
export const mockLoginResponse = {
  user: mockUser,
  token: mockAuthToken,
};

// 模拟注册响应
export const mockRegisterResponse = {
  user: {
    ...mockUser,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13900139000',
  },
  token: mockAuthToken,
};

// 模拟API响应
export const createMockResponse = <T>(data: T, success = true, message = '') => ({
  success,
  data,
  message,
});

// 模拟延迟
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟验证登录凭据
export const validateCredentials = (credentials: LoginCredentials): boolean => {
  return (
    credentials.email === mockLoginCredentials.email &&
    credentials.password === mockLoginCredentials.password
  );
};

// 模拟验证邮箱是否已存在
export const isEmailExists = (email: string): boolean => {
  return email === mockUser.email;
};

// 模拟生成用户ID
export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 模拟生成token
export const generateToken = (): string => {
  return `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
};
