// API 入口文件
export * from './user';
export * from './plant';
export * from './care';
export * from './ai';
export * from './upload';

// API 基础配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
};

// API 端点常量
export const API_ENDPOINTS = {
  // 用户相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // 用户资料
  USER: {
    PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    PASSWORD: '/user/password',
  },
  
  // 植物相关
  PLANT: {
    LIST: '/plants',
    DETAIL: (id: string) => `/plants/${id}`,
    CREATE: '/plants',
    UPDATE: (id: string) => `/plants/${id}`,
    DELETE: (id: string) => `/plants/${id}`,
    WATER: (id: string) => `/plants/${id}/water`,
    HEALTH: (id: string) => `/plants/${id}/health`,
  },
  
  // 养护相关
  CARE: {
    PLANS: '/care/plans',
    PLAN_DETAIL: (id: string) => `/care/plans/${id}`,
    GENERATE_PLAN: '/care/plans/generate',
    TASKS: '/care/tasks',
    TASK_DETAIL: (id: string) => `/care/tasks/${id}`,
    COMPLETE_TASK: (id: string) => `/care/tasks/${id}/complete`,
    RECORDS: '/care/records',
    RECORD_DETAIL: (id: string) => `/care/records/${id}`,
  },
  
  // AI 相关
  AI: {
    CHAT: '/ai/chat',
    RECOGNIZE: '/ai/recognize',
    GENERATE: '/ai/generate',
    DIAGNOSE: '/ai/diagnose',
    MODELS: '/ai/models',
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    AVATAR: '/upload/avatar',
    PLANT_IMAGE: '/upload/plant',
  },
};
