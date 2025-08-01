/**
 * 表单验证工具函数
 */

// 验证规则类型
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

// 验证结果类型
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// 表单验证结果类型
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 验证结果
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: '请输入邮箱地址' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' };
  }
  
  return { isValid: true };
};

/**
 * 验证密码强度
 * @param password 密码
 * @param options 验证选项
 * @returns 验证结果
 */
export const validatePassword = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) {
    return { isValid: false, message: '请输入密码' };
  }

  if (password.length < minLength) {
    return { isValid: false, message: `密码长度不能少于${minLength}位` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: '密码必须包含大写字母' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: '密码必须包含小写字母' };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { isValid: false, message: '密码必须包含数字' };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: '密码必须包含特殊字符' };
  }

  return { isValid: true };
};

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 验证结果
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: '请输入手机号' };
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '请输入有效的手机号' };
  }

  return { isValid: true };
};

/**
 * 验证用户名
 * @param username 用户名
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateUsername = (
  username: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowChinese?: boolean;
  } = {}
): ValidationResult => {
  const { minLength = 3, maxLength = 20, allowChinese = true } = options;

  if (!username) {
    return { isValid: false, message: '请输入用户名' };
  }

  if (username.length < minLength) {
    return { isValid: false, message: `用户名长度不能少于${minLength}位` };
  }

  if (username.length > maxLength) {
    return { isValid: false, message: `用户名长度不能超过${maxLength}位` };
  }

  const pattern = allowChinese
    ? /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/
    : /^[a-zA-Z0-9_-]+$/;

  if (!pattern.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字、下划线和中文字符' };
  }

  return { isValid: true };
};

/**
 * 验证URL格式
 * @param url URL地址
 * @returns 验证结果
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, message: '请输入URL地址' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: '请输入有效的URL地址' };
  }
};

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns 验证结果
 */
export const validateIdCard = (idCard: string): ValidationResult => {
  if (!idCard) {
    return { isValid: false, message: '请输入身份证号' };
  }

  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardRegex.test(idCard)) {
    return { isValid: false, message: '请输入有效的身份证号' };
  }

  return { isValid: true };
};

/**
 * 验证数字范围
 * @param value 数值
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateNumber = (
  value: number | string,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): ValidationResult => {
  const { min, max, integer = false } = options;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return { isValid: false, message: '请输入有效的数字' };
  }

  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, message: '请输入整数' };
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, message: `数值不能小于${min}` };
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, message: `数值不能大于${max}` };
  }

  return { isValid: true };
};

/**
 * 验证字符串长度
 * @param value 字符串值
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateLength = (
  value: string,
  options: {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
  } = {}
): ValidationResult => {
  const { minLength, maxLength, trim = true } = options;
  const strValue = trim ? value.trim() : value;

  if (minLength !== undefined && strValue.length < minLength) {
    return { isValid: false, message: `长度不能少于${minLength}个字符` };
  }

  if (maxLength !== undefined && strValue.length > maxLength) {
    return { isValid: false, message: `长度不能超过${maxLength}个字符` };
  }

  return { isValid: true };
};

/**
 * 验证必填字段
 * @param value 字段值
 * @param fieldName 字段名称
 * @returns 验证结果
 */
export const validateRequired = (value: any, fieldName: string = '字段'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `请输入${fieldName}` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `请输入${fieldName}` };
  }

  return { isValid: true };
};

/**
 * 验证日期格式
 * @param date 日期值
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateDate = (
  date: string | Date,
  options: {
    minDate?: Date;
    maxDate?: Date;
    format?: string;
  } = {}
): ValidationResult => {
  const { minDate, maxDate } = options;
  let dateObj: Date;

  try {
    dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, message: '请输入有效的日期' };
    }
  } catch {
    return { isValid: false, message: '请输入有效的日期' };
  }

  if (minDate && dateObj < minDate) {
    return { isValid: false, message: `日期不能早于${minDate.toLocaleDateString()}` };
  }

  if (maxDate && dateObj > maxDate) {
    return { isValid: false, message: `日期不能晚于${maxDate.toLocaleDateString()}` };
  }

  return { isValid: true };
};

/**
 * 通用验证函数
 * @param value 要验证的值
 * @param rules 验证规则
 * @returns 验证结果
 */
export const validate = (value: any, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    // 必填验证
    if (rule.required) {
      const requiredResult = validateRequired(value);
      if (!requiredResult.isValid) {
        return { isValid: false, message: rule.message || requiredResult.message };
      }
    }

    // 如果值为空且不是必填，跳过其他验证
    if (!value && !rule.required) {
      continue;
    }

    // 长度验证
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return { isValid: false, message: rule.message || `长度不能少于${rule.minLength}个字符` };
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return { isValid: false, message: rule.message || `长度不能超过${rule.maxLength}个字符` };
      }
    }

    // 正则表达式验证
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return { isValid: false, message: rule.message || '格式不正确' };
    }

    // 自定义验证
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        return { isValid: false, message: customResult };
      }
      if (!customResult) {
        return { isValid: false, message: rule.message || '验证失败' };
      }
    }
  }

  return { isValid: true };
};

/**
 * 验证表单数据
 * @param formData 表单数据
 * @param validationSchema 验证模式
 * @returns 表单验证结果
 */
export const validateForm = (
  formData: Record<string, any>,
  validationSchema: Record<string, ValidationRule[]>
): FormValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = formData[field];
    const result = validate(value, rules);
    
    if (!result.isValid) {
      errors[field] = result.message || '';
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * 验证文件
 * @param file 文件对象
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // MB
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): ValidationResult => {
  const { maxSize, allowedTypes, allowedExtensions } = options;

  if (!file) {
    return { isValid: false, message: '请选择文件' };
  }

  // 检查文件大小
  if (maxSize) {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return { isValid: false, message: `文件大小不能超过${maxSize}MB` };
    }
  }

  // 检查文件类型
  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: '不支持的文件类型' };
    }
  }

  // 检查文件扩展名
  if (allowedExtensions && allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return { isValid: false, message: '不支持的文件格式' };
    }
  }

  return { isValid: true };
};

/**
 * 验证图片文件
 * @param file 图片文件
 * @param options 验证选项
 * @returns 验证结果
 */
export const validateImageFile = (
  file: File,
  options: {
    maxSize?: number; // MB
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const { maxSize = 10, maxWidth, maxHeight, minWidth, minHeight } = options;

    // 基本文件验证
    const fileResult = validateFile(file, {
      maxSize,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });

    if (!fileResult.isValid) {
      resolve(fileResult);
      return;
    }

    // 检查图片尺寸
    if (maxWidth || maxHeight || minWidth || minHeight) {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;

        if (minWidth && width < minWidth) {
          resolve({ isValid: false, message: `图片宽度不能小于${minWidth}px` });
          return;
        }

        if (minHeight && height < minHeight) {
          resolve({ isValid: false, message: `图片高度不能小于${minHeight}px` });
          return;
        }

        if (maxWidth && width > maxWidth) {
          resolve({ isValid: false, message: `图片宽度不能大于${maxWidth}px` });
          return;
        }

        if (maxHeight && height > maxHeight) {
          resolve({ isValid: false, message: `图片高度不能大于${maxHeight}px` });
          return;
        }

        resolve({ isValid: true });
      };

      img.onerror = () => {
        resolve({ isValid: false, message: '无法读取图片信息' });
      };

      img.src = URL.createObjectURL(file);
    } else {
      resolve({ isValid: true });
    }
  });
};

/**
 * 创建验证规则
 * @param rules 验证规则配置
 * @returns 验证规则数组
 */
export const createValidationRules = (rules: Partial<ValidationRule>[]): ValidationRule[] => {
  return rules.map(rule => ({
    required: false,
    ...rule,
  }));
};

/**
 * 常用的验证规则预设
 */
export const VALIDATION_PRESETS = {
  email: [
    { required: true, message: '请输入邮箱地址' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 8, message: '密码长度不能少于8位' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
  ],
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名长度不能少于3位' },
    { maxLength: 20, message: '用户名长度不能超过20位' },
    { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/, message: '用户名只能包含字母、数字、下划线和中文字符' },
  ],
  required: [
    { required: true, message: '此字段为必填项' },
  ],
} as const;
