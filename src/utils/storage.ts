/**
 * 本地存储工具函数
 */

// 存储类型
export type StorageType = 'localStorage' | 'sessionStorage';

// 存储配置
export interface StorageConfig {
  type?: StorageType;
  prefix?: string;
  expire?: number; // 过期时间（毫秒）
  encrypt?: boolean; // 是否加密
}

// 存储项类型
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expire?: number;
}

/**
 * 获取存储实例
 * @param type 存储类型
 * @returns 存储实例
 */
const getStorageInstance = (type: StorageType = 'localStorage'): Storage => {
  return type === 'localStorage' ? localStorage : sessionStorage;
};

/**
 * 生成存储键名
 * @param key 原始键名
 * @param prefix 前缀
 * @returns 完整键名
 */
const generateKey = (key: string, prefix: string = ''): string => {
  return prefix ? `${prefix}_${key}` : key;
};

/**
 * 简单的加密/解密函数
 * @param data 要加密的数据
 * @param encrypt 是否加密
 * @returns 加密/解密后的数据
 */
const encryptData = (data: string, encrypt: boolean = false): string => {
  if (!encrypt) return data;
  
  try {
    // 简单的Base64编码，实际项目中可以使用更安全的加密方式
    return encrypt ? btoa(data) : atob(data);
  } catch {
    return data;
  }
};

/**
 * 设置存储项
 * @param key 键名
 * @param value 值
 * @param config 配置选项
 */
export const setStorage = <T>(
  key: string,
  value: T,
  config: StorageConfig = {}
): void => {
  const { type = 'localStorage', prefix = '', expire, encrypt = false } = config;
  const storage = getStorageInstance(type);
  const fullKey = generateKey(key, prefix);
  
  const item: StorageItem<T> = {
    value,
    timestamp: Date.now(),
    expire,
  };
  
  const serializedData = JSON.stringify(item);
  const encryptedData = encryptData(serializedData, encrypt);
  
  try {
    storage.setItem(fullKey, encryptedData);
  } catch (error) {
    console.error('存储数据失败:', error);
  }
};

/**
 * 获取存储项
 * @param key 键名
 * @param config 配置选项
 * @returns 存储的值或null
 */
export const getStorageItem = <T>(
  key: string,
  config: StorageConfig = {}
): T | null => {
  const { type = 'localStorage', prefix = '', encrypt = false } = config;
  const storage = getStorageInstance(type);
  const fullKey = generateKey(key, prefix);
  
  try {
    const data = storage.getItem(fullKey);
    if (!data) return null;
    
    const decryptedData = encryptData(data, false);
    const item: StorageItem<T> = JSON.parse(decryptedData);
    
    // 检查是否过期
    if (item.expire && Date.now() - item.timestamp > item.expire) {
      removeStorage(key, config);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('读取存储数据失败:', error);
    return null;
  }
};

/**
 * 删除存储项
 * @param key 键名
 * @param config 配置选项
 */
export const removeStorage = (key: string, config: StorageConfig = {}): void => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  const fullKey = generateKey(key, prefix);
  
  try {
    storage.removeItem(fullKey);
  } catch (error) {
    console.error('删除存储数据失败:', error);
  }
};

/**
 * 清空存储
 * @param config 配置选项
 */
export const clearStorage = (config: StorageConfig = {}): void => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  
  if (!prefix) {
    storage.clear();
    return;
  }
  
  // 只删除指定前缀的项
  const keysToRemove: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`删除存储项失败: ${key}`, error);
    }
  });
};

/**
 * 检查存储项是否存在
 * @param key 键名
 * @param config 配置选项
 * @returns 是否存在
 */
export const hasStorage = (key: string, config: StorageConfig = {}): boolean => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  const fullKey = generateKey(key, prefix);
  
  return storage.getItem(fullKey) !== null;
};

/**
 * 获取存储项数量
 * @param config 配置选项
 * @returns 存储项数量
 */
export const getStorageSize = (config: StorageConfig = {}): number => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  
  if (!prefix) {
    return storage.length;
  }
  
  let count = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(prefix)) {
      count++;
    }
  }
  
  return count;
};

/**
 * 获取所有存储键名
 * @param config 配置选项
 * @returns 键名数组
 */
export const getStorageKeys = (config: StorageConfig = {}): string[] => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  const keys: string[] = [];
  
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      if (!prefix || key.startsWith(prefix)) {
        const originalKey = prefix ? key.replace(`${prefix}_`, '') : key;
        keys.push(originalKey);
      }
    }
  }
  
  return keys;
};

/**
 * 获取存储使用情况
 * @param config 配置选项
 * @returns 存储使用情况
 */
export const getStorageUsage = (config: StorageConfig = {}): {
  size: number;
  keys: string[];
  totalSize: number;
} => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  const keys = getStorageKeys(config);
  let totalSize = 0;
  
  keys.forEach(key => {
    const fullKey = generateKey(key, prefix);
    const data = storage.getItem(fullKey);
    if (data) {
      totalSize += data.length;
    }
  });
  
  return {
    size: keys.length,
    keys,
    totalSize,
  };
};

/**
 * 设置带过期时间的存储项
 * @param key 键名
 * @param value 值
 * @param expire 过期时间（毫秒）
 * @param config 配置选项
 */
export const setStorageWithExpire = <T>(
  key: string,
  value: T,
  expire: number,
  config: StorageConfig = {}
): void => {
  setStorage(key, value, { ...config, expire });
};

/**
 * 设置缓存项（默认1小时过期）
 * @param key 键名
 * @param value 值
 * @param expire 过期时间（毫秒，默认1小时）
 * @param config 配置选项
 */
export const setCache = <T>(
  key: string,
  value: T,
  expire: number = 3600000, // 1小时
  config: StorageConfig = {}
): void => {
  setStorageWithExpire(key, value, expire, config);
};

/**
 * 获取缓存项
 * @param key 键名
 * @param config 配置选项
 * @returns 缓存值或null
 */
export const getCache = <T>(key: string, config: StorageConfig = {}): T | null => {
  return getStorageItem<T>(key, config);
};

/**
 * 删除缓存项
 * @param key 键名
 * @param config 配置选项
 */
export const removeCache = (key: string, config: StorageConfig = {}): void => {
  removeStorage(key, config);
};

/**
 * 清空所有缓存
 * @param config 配置选项
 */
export const clearCache = (config: StorageConfig = {}): void => {
  clearStorage(config);
};

/**
 * 检查缓存是否有效
 * @param key 键名
 * @param config 配置选项
 * @returns 是否有效
 */
export const isCacheValid = (key: string, config: StorageConfig = {}): boolean => {
  return getCache(key, config) !== null;
};

/**
 * 获取缓存统计信息
 * @param config 配置选项
 * @returns 缓存统计信息
 */
export const getCacheStats = (config: StorageConfig = {}): {
  total: number;
  valid: number;
  expired: number;
  size: number;
} => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  let total = 0;
  let valid = 0;
  let expired = 0;
  let size = 0;
  
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && (!prefix || key.startsWith(prefix))) {
      total++;
      const data = storage.getItem(key);
      if (data) {
        size += data.length;
        try {
          const item = JSON.parse(data);
          if (item.expire && Date.now() - item.timestamp > item.expire) {
            expired++;
          } else {
            valid++;
          }
        } catch {
          valid++;
        }
      }
    }
  }
  
  return { total, valid, expired, size };
};

/**
 * 清理过期的缓存项
 * @param config 配置选项
 * @returns 清理的项数
 */
export const cleanExpiredCache = (config: StorageConfig = {}): number => {
  const { type = 'localStorage', prefix = '' } = config;
  const storage = getStorageInstance(type);
  let cleanedCount = 0;
  
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && (!prefix || key.startsWith(prefix))) {
      const data = storage.getItem(key);
      if (data) {
        try {
          const item = JSON.parse(data);
          if (item.expire && Date.now() - item.timestamp > item.expire) {
            storage.removeItem(key);
            cleanedCount++;
          }
        } catch {
          // 忽略解析错误的数据
        }
      }
    }
  }
  
  return cleanedCount;
};

/**
 * 存储管理器类
 */
export class StorageManager {
  private config: StorageConfig;
  
  constructor(config: StorageConfig = {}) {
    this.config = {
      type: 'localStorage',
      prefix: '',
      encrypt: false,
      ...config,
    };
  }
  
  set<T>(key: string, value: T, expire?: number): void {
    setStorage(key, value, { ...this.config, expire });
  }
  
  get<T>(key: string): T | null {
    return getStorageItem<T>(key, this.config);
  }
  
  remove(key: string): void {
    removeStorage(key, this.config);
  }
  
  clear(): void {
    clearStorage(this.config);
  }
  
  has(key: string): boolean {
    return hasStorage(key, this.config);
  }
  
  keys(): string[] {
    return getStorageKeys(this.config);
  }
  
  size(): number {
    return getStorageSize(this.config);
  }
  
  usage() {
    return getStorageUsage(this.config);
  }
}

/**
 * 缓存管理器类
 */
export class CacheManager {
  private config: StorageConfig;
  
  constructor(config: StorageConfig = {}) {
    this.config = {
      type: 'localStorage',
      prefix: 'cache',
      encrypt: false,
      ...config,
    };
  }
  
  set<T>(key: string, value: T, expire: number = 3600000): void {
    setCache(key, value, expire, this.config);
  }
  
  get<T>(key: string): T | null {
    return getCache<T>(key, this.config);
  }
  
  remove(key: string): void {
    removeCache(key, this.config);
  }
  
  clear(): void {
    clearCache(this.config);
  }
  
  isValid(key: string): boolean {
    return isCacheValid(key, this.config);
  }
  
  stats() {
    return getCacheStats(this.config);
  }
  
  clean(): number {
    return cleanExpiredCache(this.config);
  }
}

// 默认的存储管理器实例
export const defaultStorage = new StorageManager();
export const defaultCache = new CacheManager();
