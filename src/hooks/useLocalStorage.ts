import { useCallback, useState, useEffect } from 'react';

/**
 * 本地存储相关Hook
 * 提供localStorage的封装功能，支持自动序列化和反序列化
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // 获取初始值
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 设置值的函数
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，这样我们就有了与useState相同的API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 保存到状态
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 移除值的函数
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 监听其他标签页的localStorage变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * 布尔值本地存储Hook
 */
export const useLocalStorageBoolean = (key: string, initialValue: boolean = false) => {
  return useLocalStorage<boolean>(key, initialValue);
};

/**
 * 字符串本地存储Hook
 */
export const useLocalStorageString = (key: string, initialValue: string = '') => {
  return useLocalStorage<string>(key, initialValue);
};

/**
 * 数字本地存储Hook
 */
export const useLocalStorageNumber = (key: string, initialValue: number = 0) => {
  return useLocalStorage<number>(key, initialValue);
};

/**
 * 数组本地存储Hook
 */
export const useLocalStorageArray = <T>(key: string, initialValue: T[] = []) => {
  return useLocalStorage<T[]>(key, initialValue);
};

/**
 * 对象本地存储Hook
 */
export const useLocalStorageObject = <T extends Record<string, any>>(key: string, initialValue: T) => {
  return useLocalStorage<T>(key, initialValue);
};

/**
 * 主题设置本地存储Hook
 */
export const useThemeStorage = () => {
  return useLocalStorage<'light' | 'dark'>('theme', 'light');
};

/**
 * 用户偏好设置本地存储Hook
 */
export const useUserPreferences = () => {
  return useLocalStorageObject('userPreferences', {
    language: 'zh-CN',
    notifications: true,
    autoSave: true,
    compactMode: false,
  });
};

/**
 * 应用设置本地存储Hook
 */
export const useAppSettings = () => {
  return useLocalStorageObject('appSettings', {
    sidebarCollapsed: false,
    showWelcome: true,
    lastVisit: new Date().toISOString(),
    version: '1.0.0',
  });
};

/**
 * 缓存管理Hook
 */
export const useCache = <T>(key: string, ttl: number = 3600000) => { // 默认1小时
  const [cache, setCache, removeCache] = useLocalStorage<{
    data: T;
    timestamp: number;
  } | null>(`cache_${key}`, null);

  const setValue = useCallback((value: T) => {
    setCache({
      data: value,
      timestamp: Date.now(),
    });
  }, [setCache]);

  const getValue = useCallback((): T | null => {
    if (!cache) return null;
    
    const now = Date.now();
    if (now - cache.timestamp > ttl) {
      removeCache();
      return null;
    }
    
    return cache.data;
  }, [cache, ttl, removeCache]);

  const isValid = useCallback((): boolean => {
    if (!cache) return false;
    return Date.now() - cache.timestamp <= ttl;
  }, [cache, ttl]);

  return {
    getValue,
    setValue,
    removeCache,
    isValid,
    cache,
  };
};
