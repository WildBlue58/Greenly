/**
 * 图片处理工具函数
 */

// 图片格式类型
export const IMAGE_FORMATS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  BMP: 'image/bmp',
} as const;

export type ImageFormat = typeof IMAGE_FORMATS[keyof typeof IMAGE_FORMATS];

// 图片压缩选项
export interface ImageCompressOptions {
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  format?: ImageFormat;
  maintainAspectRatio?: boolean;
}

// 图片裁剪选项
export interface ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 检查文件是否为图片
 * @param file 文件对象
 * @returns 是否为图片
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * 获取图片文件大小（MB）
 * @param file 图片文件
 * @returns 文件大小（MB）
 */
export const getImageSize = (file: File): number => {
  return file.size / (1024 * 1024);
};

/**
 * 检查图片文件大小是否在限制范围内
 * @param file 图片文件
 * @param maxSize 最大大小（MB）
 * @returns 是否在限制范围内
 */
export const isImageSizeValid = (file: File, maxSize: number = 10): boolean => {
  return getImageSize(file) <= maxSize;
};

/**
 * 获取图片的宽高信息
 * @param file 图片文件
 * @returns Promise<{width: number, height: number}>
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('无法读取图片尺寸'));
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns Promise<File> 压缩后的图片文件
 */
export const compressImage = async (
  file: File,
  options: ImageCompressOptions = {}
): Promise<File> => {
  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    format = IMAGE_FORMATS.JPEG,
    maintainAspectRatio = true,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // 如果指定了最大宽高，进行缩放
      if (maxWidth || maxHeight) {
        if (maintainAspectRatio) {
          const aspectRatio = width / height;
          if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          width = maxWidth || width;
          height = maxHeight || height;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: format,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          format,
          quality
        );
      } else {
        reject(new Error('无法创建画布上下文'));
      }
    };

    img.onerror = () => {
      reject(new Error('无法加载图片'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * 裁剪图片
 * @param file 原始图片文件
 * @param cropOptions 裁剪选项
 * @returns Promise<File> 裁剪后的图片文件
 */
export const cropImage = async (
  file: File,
  cropOptions: ImageCropOptions
): Promise<File> => {
  const { x, y, width, height } = cropOptions;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(croppedFile);
            } else {
              reject(new Error('图片裁剪失败'));
            }
          },
          file.type,
          0.9
        );
      } else {
        reject(new Error('无法创建画布上下文'));
      }
    };

    img.onerror = () => {
      reject(new Error('无法加载图片'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * 将图片转换为Base64
 * @param file 图片文件
 * @returns Promise<string> Base64字符串
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 将Base64转换为File对象
 * @param base64 Base64字符串
 * @param filename 文件名
 * @param mimeType MIME类型
 * @returns File对象
 */
export const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
  const arr = base64.split(',');
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mimeType });
};

/**
 * 创建图片缩略图
 * @param file 原始图片文件
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @returns Promise<File> 缩略图文件
 */
export const createThumbnail = async (
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<File> => {
  return compressImage(file, {
    maxWidth,
    maxHeight,
    quality: 0.7,
    maintainAspectRatio: true,
  });
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
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<{ isValid: boolean; error?: string }> => {
  const {
    maxSize = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  } = options;

  return new Promise((resolve) => {
    // 检查文件类型
    if (!allowedTypes.includes(file.type)) {
      resolve({
        isValid: false,
        error: '不支持的图片格式',
      });
      return;
    }

    // 检查文件大小
    if (getImageSize(file) > maxSize) {
      resolve({
        isValid: false,
        error: `图片大小不能超过${maxSize}MB`,
      });
      return;
    }

    // 检查图片尺寸
    if (minWidth || minHeight || maxWidth || maxHeight) {
      getImageDimensions(file)
        .then(({ width, height }) => {
          if (minWidth && width < minWidth) {
            resolve({
              isValid: false,
              error: `图片宽度不能小于${minWidth}px`,
            });
            return;
          }
          if (minHeight && height < minHeight) {
            resolve({
              isValid: false,
              error: `图片高度不能小于${minHeight}px`,
            });
            return;
          }
          if (maxWidth && width > maxWidth) {
            resolve({
              isValid: false,
              error: `图片宽度不能大于${maxWidth}px`,
            });
            return;
          }
          if (maxHeight && height > maxHeight) {
            resolve({
              isValid: false,
              error: `图片高度不能大于${maxHeight}px`,
            });
            return;
          }
          resolve({ isValid: true });
        })
        .catch(() => {
          resolve({
            isValid: false,
            error: '无法读取图片尺寸',
          });
        });
    } else {
      resolve({ isValid: true });
    }
  });
};

/**
 * 获取图片的MIME类型
 * @param filename 文件名
 * @returns MIME类型
 */
export const getImageMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return IMAGE_FORMATS.JPEG;
    case 'png':
      return IMAGE_FORMATS.PNG;
    case 'webp':
      return IMAGE_FORMATS.WEBP;
    case 'gif':
      return IMAGE_FORMATS.GIF;
    case 'bmp':
      return IMAGE_FORMATS.BMP;
    default:
      return IMAGE_FORMATS.JPEG;
  }
};

/**
 * 生成随机文件名
 * @param originalName 原始文件名
 * @param prefix 前缀
 * @returns 随机文件名
 */
export const generateRandomFileName = (originalName: string, prefix: string = ''): string => {
  const ext = originalName.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}_${random}.${ext}`;
};

/**
 * 批量压缩图片
 * @param files 图片文件数组
 * @param options 压缩选项
 * @returns Promise<File[]> 压缩后的图片文件数组
 */
export const compressImages = async (
  files: File[],
  options: ImageCompressOptions = {}
): Promise<File[]> => {
  const compressedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`压缩图片失败: ${file.name}`, error);
      // 如果压缩失败，使用原文件
      compressedFiles.push(file);
    }
  }
  
  return compressedFiles;
};

/**
 * 检查浏览器是否支持WebP格式
 * @returns 是否支持WebP
 */
export const isWebPSupported = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * 获取最佳图片格式
 * @returns 最佳图片格式
 */
export const getBestImageFormat = (): ImageFormat => {
  if (isWebPSupported()) {
    return IMAGE_FORMATS.WEBP;
  }
  return IMAGE_FORMATS.JPEG;
};
