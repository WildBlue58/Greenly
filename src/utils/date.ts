/**
 * 日期时间处理工具函数
 */

// 日期格式化选项
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_SHORT: 'MM-DD HH:mm',
  TIME_SHORT: 'HH:mm',
  MONTH_DAY: 'MM-DD',
  YEAR_MONTH: 'YYYY-MM',
  RELATIVE: 'relative',
} as const;

export type DateFormat = typeof DATE_FORMATS[keyof typeof DATE_FORMATS];

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string, format: DateFormat = DATE_FORMATS.DATETIME): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === DATE_FORMATS.RELATIVE) {
    return formatRelativeDate(dateObj);
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  switch (format) {
    case DATE_FORMATS.DATE:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.TIME:
      return `${hours}:${minutes}:${seconds}`;
    case DATE_FORMATS.DATETIME:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case DATE_FORMATS.DATETIME_SHORT:
      return `${month}-${day} ${hours}:${minutes}`;
    case DATE_FORMATS.TIME_SHORT:
      return `${hours}:${minutes}`;
    case DATE_FORMATS.MONTH_DAY:
      return `${month}-${day}`;
    case DATE_FORMATS.YEAR_MONTH:
      return `${year}-${month}`;
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};

/**
 * 格式化相对时间
 * @param date 日期对象
 * @returns 相对时间字符串
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatDate(date, DATE_FORMATS.DATE);
  }
};

/**
 * 解析日期字符串
 * @param dateString 日期字符串
 * @returns 日期对象
 */
export const parseDate = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('无效的日期格式');
  }
  return date;
};

/**
 * 检查是否为有效日期
 * @param date 日期对象或字符串
 * @returns 是否为有效日期
 */
export const isValidDate = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};

/**
 * 获取日期范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 日期范围数组
 */
export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

/**
 * 计算两个日期之间的天数差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 天数差
 */
export const getDaysDiff = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 获取今天的开始时间
 * @returns 今天的开始时间
 */
export const getTodayStart = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 获取今天的结束时间
 * @returns 今天的结束时间
 */
export const getTodayEnd = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};

/**
 * 获取本周的开始时间
 * @returns 本周的开始时间
 */
export const getWeekStart = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * 获取本月的开始时间
 * @returns 本月的开始时间
 */
export const getMonthStart = (): Date => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  return firstDay;
};

/**
 * 获取本月的结束时间
 * @returns 本月的结束时间
 */
export const getMonthEnd = (): Date => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
};

/**
 * 添加天数
 * @param date 日期
 * @param days 天数
 * @returns 新日期
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * 添加小时
 * @param date 日期
 * @param hours 小时数
 * @returns 新日期
 */
export const addHours = (date: Date, hours: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

/**
 * 添加分钟
 * @param date 日期
 * @param minutes 分钟数
 * @returns 新日期
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

/**
 * 获取日期是星期几
 * @param date 日期
 * @returns 星期几的中文名称
 */
export const getDayOfWeek = (date: Date): string => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[date.getDay()];
};

/**
 * 获取日期是星期几（英文）
 * @param date 日期
 * @returns 星期几的英文名称
 */
export const getDayOfWeekEn = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * 格式化时间间隔
 * @param milliseconds 毫秒数
 * @returns 格式化的时间间隔
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}天`;
  } else if (hours > 0) {
    return `${hours}小时`;
  } else if (minutes > 0) {
    return `${minutes}分钟`;
  } else {
    return `${seconds}秒`;
  }
};

/**
 * 获取年龄
 * @param birthDate 出生日期
 * @returns 年龄
 */
export const getAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * 检查是否为同一天
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否为同一天
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 检查是否为今天
 * @param date 日期
 * @returns 是否为今天
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * 检查是否为昨天
 * @param date 日期
 * @returns 是否为昨天
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

/**
 * 检查是否为明天
 * @param date 日期
 * @returns 是否为明天
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
};

/**
 * 格式化养护提醒时间
 * @param dateString 日期字符串或日期对象
 * @returns 格式化后的时间字符串
 */
export const formatCareReminderTime = (dateString: string | Date): string => {
  try {
    // 检查输入是否为空
    if (!dateString) {
      return '无效时间';
    }
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // 检查日期是否有效
    if (!isValidDate(date)) {
      return '无效时间';
    }
    
    const now = new Date();
    
    if (isToday(date)) {
      return `今天 ${formatDate(date, DATE_FORMATS.TIME_SHORT)}`;
    } else if (isTomorrow(date)) {
      return `明天 ${formatDate(date, DATE_FORMATS.TIME_SHORT)}`;
    } else if (isYesterday(date)) {
      return `昨天 ${formatDate(date, DATE_FORMATS.TIME_SHORT)}`;
    } else {
      // 如果是本年内，显示月-日 时:分
      if (date.getFullYear() === now.getFullYear()) {
        return formatDate(date, DATE_FORMATS.DATETIME_SHORT);
      } else {
        // 跨年显示完整日期
        return formatDate(date, DATE_FORMATS.DATETIME);
      }
    }
  } catch (error) {
    console.error('格式化养护提醒时间失败:', error);
    return '时间格式错误';
  }
};
