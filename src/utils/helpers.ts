/**
 * 通用辅助函数
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 选项
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  const { leading = true, trailing = true } = options;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (!previous && !leading) previous = now;
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
};

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  
  return obj;
};

/**
 * 合并对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 */
export const merge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  const result = { ...target } as any;
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        const value = source[key];
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            result[key] = merge(result[key] || {}, value);
          } else {
            result[key] = value;
          }
        }
      });
    }
  });
  return result as T;
};

/**
 * 获取对象的嵌套属性值
 * @param obj 对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @returns 属性值
 */
export const get = <T = any>(
  obj: any,
  path: string | string[],
  defaultValue?: T
): T => {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T;
    }
    result = result[key];
  }
  return result !== undefined ? (result as T) : (defaultValue as T);
};

/**
 * 设置对象的嵌套属性值
 * @param obj 对象
 * @param path 属性路径
 * @param value 要设置的值
 * @returns 设置后的对象
 */
export const set = <T extends Record<string, any>>(
  obj: T,
  path: string | string[],
  value: any
): T => {
  const keys = Array.isArray(path) ? path : path.split('.');
  const result = { ...obj } as any;
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * 检查对象是否为空
 * @param obj 要检查的对象
 * @returns 是否为空
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param chars 字符集
 * @returns 随机字符串
 */
export const randomString = (
  length: number = 8,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 生成UUID
 * @returns UUID字符串
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * 格式化数字
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (
  num: number,
  options: {
    decimals?: number;
    separator?: string;
    decimalSeparator?: string;
  } = {}
): string => {
  const { decimals = 0, separator = ',', decimalSeparator = '.' } = options;
  
  const parts = num.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  
  return parts.join(decimalSeparator);
};

/**
 * 截断字符串
 * @param str 字符串
 * @param length 最大长度
 * @param suffix 后缀
 * @returns 截断后的字符串
 */
export const truncate = (
  str: string,
  length: number,
  suffix: string = '...'
): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 转换为驼峰命名
 * @param str 字符串
 * @returns 驼峰命名的字符串
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toLowerCase());
};

/**
 * 转换为帕斯卡命名
 * @param str 字符串
 * @returns 帕斯卡命名的字符串
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toUpperCase());
};

/**
 * 转换为短横线命名
 * @param str 字符串
 * @returns 短横线命名的字符串
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * 转换为下划线命名
 * @param str 字符串
 * @returns 下划线命名的字符串
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * 数组去重
 * @param arr 数组
 * @param key 对象属性键（可选）
 * @returns 去重后的数组
 */
export const unique = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 数组分组
 * @param arr 数组
 * @param key 分组键
 * @returns 分组后的对象
 */
export const groupBy = <T>(
  arr: T[],
  key: keyof T
): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * 数组排序
 * @param arr 数组
 * @param key 排序键
 * @param order 排序顺序
 * @returns 排序后的数组
 */
export const sortBy = <T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * 数组分块
 * @param arr 数组
 * @param size 块大小
 * @returns 分块后的数组
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * 数组扁平化
 * @param arr 数组
 * @param depth 扁平化深度
 * @returns 扁平化后的数组
 */
export const flatten = <T>(arr: any[], depth: number = Infinity): T[] => {
  if (depth === 0) return arr;
  
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item, depth - 1) : item);
  }, []);
};

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxAttempts 最大重试次数
 * @param delay 重试间隔（毫秒）
 * @returns Promise
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) {
        throw lastError;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

/**
 * 检查是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 检查是否为iOS设备
 * @returns 是否为iOS设备
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * 检查是否为Android设备
 * @returns 是否为Android设备
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * 检查是否为微信浏览器
 * @returns 是否为微信浏览器
 */
export const isWeChat = (): boolean => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

/**
 * 获取URL参数
 * @param url URL字符串
 * @returns 参数对象
 */
export const getUrlParams = (url: string = window.location.href): Record<string, string> => {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * 构建URL查询字符串
 * @param params 参数对象
 * @returns 查询字符串
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean>
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 检查元素是否在视口中
 * @param element 元素
 * @returns 是否在视口中
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * 滚动到元素
 * @param element 元素或选择器
 * @param options 滚动选项
 */
export const scrollToElement = (
  element: Element | string,
  options: ScrollToOptions = {}
): void => {
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;
  
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options,
    });
  }
};
