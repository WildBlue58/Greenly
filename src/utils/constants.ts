/**
 * 应用常量定义
 */

// 应用基本信息
export const APP_INFO = {
  NAME: '小养',
  VERSION: '1.0.0',
  DESCRIPTION: '智能植物养护助手',
  AUTHOR: 'Greenly Team',
  WEBSITE: 'https://greenly.app',
} as const;

// 环境配置
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// 用户相关常量
export const USER_CONSTANTS = {
  // 用户状态
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
  },
  
  // 用户角色
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
  },
  
  // 性别
  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
  
  // 验证码类型
  VERIFICATION_TYPE: {
    EMAIL: 'email',
    PHONE: 'phone',
    PASSWORD_RESET: 'password_reset',
  },
} as const;

// 植物相关常量
export const PLANT_CONSTANTS = {
  // 植物健康状态
  HEALTH_STATUS: {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor',
  },
  
  // 植物状态
  STATUS: {
    HEALTHY: 'healthy',
    NEEDS_CARE: 'needs_care',
    SICK: 'sick',
  },
  
  // 植物类型
  TYPES: {
    INDOOR: 'indoor',
    OUTDOOR: 'outdoor',
    SUCCULENT: 'succulent',
    HERB: 'herb',
    TREE: 'tree',
    FLOWER: 'flower',
  },
  
  // 养护类型
  CARE_TYPES: {
    WATER: 'water',
    FERTILIZE: 'fertilize',
    PRUNE: 'prune',
    REPOT: 'repot',
    OTHER: 'other',
  },
  
  // 养护优先级
  PRIORITY: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  },
  
  // 浇水频率
  WATERING_FREQUENCY: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    BIWEEKLY: 'biweekly',
    MONTHLY: 'monthly',
    CUSTOM: 'custom',
  },
  
  // 光照需求
  LIGHT_REQUIREMENT: {
    FULL_SUN: 'full_sun',
    PARTIAL_SUN: 'partial_sun',
    SHADE: 'shade',
    LOW_LIGHT: 'low_light',
  },
  
  // 湿度需求
  HUMIDITY_REQUIREMENT: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
  
  // 温度范围
  TEMPERATURE_RANGE: {
    COLD: 'cold',
    COOL: 'cool',
    WARM: 'warm',
    HOT: 'hot',
  },
} as const;

// AI 相关常量
export const AI_CONSTANTS = {
  // AI 模型类型
  MODEL_TYPES: {
    GPT: 'gpt',
    CLAUDE: 'claude',
    GEMINI: 'gemini',
    CUSTOM: 'custom',
  },
  
  // AI 功能类型
  FUNCTION_TYPES: {
    CHAT: 'chat',
    RECOGNIZE: 'recognize',
    DIAGNOSE: 'diagnose',
    GENERATE: 'generate',
  },
  
  // 聊天消息角色
  CHAT_ROLES: {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
  },
  
  // 图片识别类型
  RECOGNITION_TYPES: {
    PLANT: 'plant',
    DISEASE: 'disease',
    PEST: 'pest',
  },
} as const;

// 通知相关常量
export const NOTIFICATION_CONSTANTS = {
  // 通知类型
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  
  // 通知级别
  LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  },
  
  // 通知状态
  STATUS: {
    UNREAD: 'unread',
    READ: 'read',
    ARCHIVED: 'archived',
  },
} as const;

// 文件上传相关常量
export const UPLOAD_CONSTANTS = {
  // 文件类型
  FILE_TYPES: {
    IMAGE: 'image',
    DOCUMENT: 'document',
    VIDEO: 'video',
    AUDIO: 'audio',
  },
  
  // 图片格式
  IMAGE_FORMATS: {
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    WEBP: 'image/webp',
    GIF: 'image/gif',
    BMP: 'image/bmp',
  },
  
  // 文件大小限制（MB）
  MAX_FILE_SIZE: {
    IMAGE: 10,
    DOCUMENT: 50,
    VIDEO: 100,
    AUDIO: 20,
  },
  
  // 图片尺寸限制
  IMAGE_DIMENSIONS: {
    MIN_WIDTH: 100,
    MIN_HEIGHT: 100,
    MAX_WIDTH: 4096,
    MAX_HEIGHT: 4096,
  },
} as const;

// 本地存储相关常量
export const STORAGE_CONSTANTS = {
  // 存储键名
  KEYS: {
    TOKEN: 'token',
    USER: 'user',
    SETTINGS: 'settings',
    THEME: 'theme',
    LANGUAGE: 'language',
    CACHE_PREFIX: 'cache_',
  },
  
  // 缓存过期时间（毫秒）
  CACHE_EXPIRE: {
    SHORT: 5 * 60 * 1000, // 5分钟
    MEDIUM: 30 * 60 * 1000, // 30分钟
    LONG: 2 * 60 * 60 * 1000, // 2小时
    DAY: 24 * 60 * 60 * 1000, // 1天
    WEEK: 7 * 24 * 60 * 60 * 1000, // 1周
  },
} as const;

// 主题相关常量
export const THEME_CONSTANTS = {
  // 主题类型
  TYPES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
  
  // 主题颜色
  COLORS: {
    PRIMARY: '#4CAF50',
    SECONDARY: '#2196F3',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
    ERROR: '#F44336',
    INFO: '#2196F3',
  },
} as const;

// 语言相关常量
export const LANGUAGE_CONSTANTS = {
  // 支持的语言
  SUPPORTED: {
    ZH_CN: 'zh-CN',
    EN_US: 'en-US',
    JA_JP: 'ja-JP',
  },
  
  // 默认语言
  DEFAULT: 'zh-CN',
} as const;

// 路由相关常量
export const ROUTE_CONSTANTS = {
  // 路由路径
  PATHS: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    PLANTS: '/plants',
    PLANT_DETAIL: '/plants/:id',
    CARE: '/care',
    CARE_PLAN: '/care',
    AI: '/ai',
    AI_CHAT: '/ai/chat',
    SETTINGS: '/settings',
    ABOUT: '/about',
    HELP: '/help',
    PRIVACY: '/privacy',
    TERMS: '/terms',
  },
  
  // 路由参数
  PARAMS: {
    PLANT_ID: 'id',
    USER_ID: 'userId',
    CATEGORY: 'category',
    SEARCH: 'search',
  },
} as const;

// 分页相关常量
export const PAGINATION_CONSTANTS = {
  // 默认分页大小
  DEFAULT_PAGE_SIZE: 20,
  
  // 分页大小选项
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // 最大分页大小
  MAX_PAGE_SIZE: 100,
} as const;

// 时间相关常量
export const TIME_CONSTANTS = {
  // 时间单位（毫秒）
  UNITS: {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000,
  },
  
  // 日期格式
  DATE_FORMATS: {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },
} as const;

// 验证相关常量
export const VALIDATION_CONSTANTS = {
  // 密码规则
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  
  // 用户名规则
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    ALLOW_CHINESE: true,
  },
  
  // 邮箱规则
  EMAIL: {
    MAX_LENGTH: 254,
  },
  
  // 手机号规则
  PHONE: {
    PATTERN: /^1[3-9]\d{9}$/,
  },
  
  // 文件上传规则
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;

// 错误码常量
export const ERROR_CODES = {
  // 通用错误
  COMMON: {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  },
  
  // 用户相关错误
  USER: {
    LOGIN_FAILED: 'LOGIN_FAILED',
    REGISTER_FAILED: 'REGISTER_FAILED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_EXISTS: 'EMAIL_EXISTS',
    PHONE_EXISTS: 'PHONE_EXISTS',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  },
  
  // 植物相关错误
  PLANT: {
    PLANT_NOT_FOUND: 'PLANT_NOT_FOUND',
    INVALID_PLANT_DATA: 'INVALID_PLANT_DATA',
    CARE_TASK_NOT_FOUND: 'CARE_TASK_NOT_FOUND',
  },
  
  // AI 相关错误
  AI: {
    MODEL_NOT_AVAILABLE: 'MODEL_NOT_AVAILABLE',
    RECOGNITION_FAILED: 'RECOGNITION_FAILED',
    GENERATION_FAILED: 'GENERATION_FAILED',
  },
  
  // 文件上传错误
  UPLOAD: {
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    UPLOAD_FAILED: 'UPLOAD_FAILED',
  },
} as const;

// 成功码常量
export const SUCCESS_CODES = {
  // 通用成功
  COMMON: {
    OPERATION_SUCCESS: 'OPERATION_SUCCESS',
    DATA_SAVED: 'DATA_SAVED',
    DATA_DELETED: 'DATA_DELETED',
  },
  
  // 用户相关成功
  USER: {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  },
  
  // 植物相关成功
  PLANT: {
    PLANT_CREATED: 'PLANT_CREATED',
    PLANT_UPDATED: 'PLANT_UPDATED',
    PLANT_DELETED: 'PLANT_DELETED',
    CARE_TASK_COMPLETED: 'CARE_TASK_COMPLETED',
  },
  
  // AI 相关成功
  AI: {
    RECOGNITION_SUCCESS: 'RECOGNITION_SUCCESS',
    GENERATION_SUCCESS: 'GENERATION_SUCCESS',
  },
  
  // 文件上传成功
  UPLOAD: {
    FILE_UPLOADED: 'FILE_UPLOADED',
  },
} as const;

// 导出所有常量
export const CONSTANTS = {
  APP_INFO,
  ENV,
  API_CONFIG,
  HTTP_STATUS,
  USER_CONSTANTS,
  PLANT_CONSTANTS,
  AI_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  UPLOAD_CONSTANTS,
  STORAGE_CONSTANTS,
  THEME_CONSTANTS,
  LANGUAGE_CONSTANTS,
  ROUTE_CONSTANTS,
  PAGINATION_CONSTANTS,
  TIME_CONSTANTS,
  VALIDATION_CONSTANTS,
  ERROR_CODES,
  SUCCESS_CODES,
} as const;
