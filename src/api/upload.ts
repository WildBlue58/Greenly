import { api } from '../utils/request';

// 文件上传相关 API
export const uploadAPI = {
  // 上传图片
  uploadImage: async (file: File, options?: {
    category?: string;
    compress?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<{
    url: string;
    thumbnail: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append('image', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/image', formData);
  },

  // 批量上传图片
  uploadImages: async (files: File[], options?: {
    category?: string;
    compress?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<Array<{
    url: string;
    thumbnail: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }>> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/images', formData);
  },

  // 上传头像
  uploadAvatar: async (file: File, options?: {
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    size?: number;
  }): Promise<{
    url: string;
    thumbnail: string;
    filename: string;
  }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/avatar', formData);
  },

  // 上传植物图片
  uploadPlantImage: async (file: File, plantId?: string, options?: {
    compress?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<{
    url: string;
    thumbnail: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append('image', file);
    if (plantId) {
      formData.append('plantId', plantId);
    }
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/plant-image', formData);
  },

  // 上传养护记录图片
  uploadCareRecordImage: async (file: File, recordId?: string, options?: {
    compress?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<{
    url: string;
    thumbnail: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append('image', file);
    if (recordId) {
      formData.append('recordId', recordId);
    }
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/care-record-image', formData);
  },

  // 上传文档
  uploadDocument: async (file: File, options?: {
    category?: string;
    allowedTypes?: string[];
  }): Promise<{
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  }> => {
    const formData = new FormData();
    formData.append('document', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/upload/document', formData);
  },
};

// 文件管理相关 API
export const fileManagementAPI = {
  // 获取用户文件列表
  getUserFiles: async (params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    files: Array<{
      id: string;
      filename: string;
      url: string;
      thumbnail?: string;
      size: number;
      mimeType: string;
      category: string;
      uploadedAt: string;
    }>;
    total: number;
  }> => {
    return api.get('/upload/files', { params });
  },

  // 获取文件详情
  getFileInfo: async (fileId: string): Promise<{
    id: string;
    filename: string;
    url: string;
    thumbnail?: string;
    size: number;
    mimeType: string;
    category: string;
    uploadedAt: string;
    metadata?: Record<string, any>;
  }> => {
    return api.get(`/upload/files/${fileId}`);
  },

  // 删除文件
  deleteFile: async (fileId: string): Promise<void> => {
    return api.delete(`/upload/files/${fileId}`);
  },

  // 批量删除文件
  deleteFiles: async (fileIds: string[]): Promise<void> => {
    return api.post('/upload/files/batch-delete', { fileIds });
  },

  // 更新文件信息
  updateFileInfo: async (fileId: string, data: {
    filename?: string;
    category?: string;
    metadata?: Record<string, any>;
  }): Promise<void> => {
    return api.put(`/upload/files/${fileId}`, data);
  },

  // 获取文件使用统计
  getFileStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByCategory: Record<string, number>;
    filesByType: Record<string, number>;
    dailyUploads: Array<{
      date: string;
      count: number;
      size: number;
    }>;
  }> => {
    return api.get('/upload/stats', { params });
  },
};

// 图片处理相关 API
export const imageProcessingAPI = {
  // 压缩图片
  compressImage: async (imageUrl: string, options: {
    quality: number;
    maxWidth?: number;
    maxHeight?: number;
  }): Promise<{
    url: string;
    size: number;
    originalSize: number;
    compressionRatio: number;
  }> => {
    return api.post('/upload/compress', { imageUrl, ...options });
  },

  // 裁剪图片
  cropImage: async (imageUrl: string, crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<{
    url: string;
    thumbnail: string;
  }> => {
    return api.post('/upload/crop', { imageUrl, crop });
  },

  // 调整图片大小
  resizeImage: async (imageUrl: string, options: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  }): Promise<{
    url: string;
    thumbnail: string;
  }> => {
    return api.post('/upload/resize', { imageUrl, ...options });
  },

  // 添加水印
  addWatermark: async (imageUrl: string, watermark: {
    text?: string;
    imageUrl?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  }): Promise<{
    url: string;
  }> => {
    return api.post('/upload/watermark', { imageUrl, watermark });
  },

  // 获取图片信息
  getImageInfo: async (imageUrl: string): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    hasAlpha: boolean;
    colorSpace: string;
  }> => {
    return api.get('/upload/image-info', { params: { url: imageUrl } });
  },
};

// 存储管理相关 API
export const storageAPI = {
  // 获取存储配额
  getStorageQuota: async (): Promise<{
    used: number;
    total: number;
    available: number;
    usagePercentage: number;
  }> => {
    return api.get('/upload/quota');
  },

  // 清理过期文件
  cleanupExpiredFiles: async (): Promise<{
    deletedCount: number;
    freedSpace: number;
  }> => {
    return api.post('/upload/cleanup');
  },

  // 获取存储策略
  getStoragePolicy: async (): Promise<{
    maxFileSize: number;
    allowedTypes: string[];
    retentionDays: number;
    compressionEnabled: boolean;
    backupEnabled: boolean;
  }> => {
    return api.get('/upload/policy');
  },

  // 更新存储策略
  updateStoragePolicy: async (policy: {
    maxFileSize?: number;
    allowedTypes?: string[];
    retentionDays?: number;
    compressionEnabled?: boolean;
    backupEnabled?: boolean;
  }): Promise<void> => {
    return api.put('/upload/policy', policy);
  },
};

// 导出所有上传相关 API
export const uploadAPIs = {
  upload: uploadAPI,
  management: fileManagementAPI,
  processing: imageProcessingAPI,
  storage: storageAPI,
};
