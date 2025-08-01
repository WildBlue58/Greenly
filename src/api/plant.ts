import { api } from '../utils/request';
import type { Plant, ApiResponse, PaginatedResponse } from '../store/types';

// 植物基础操作 API
export const plantAPI = {
  // 获取植物列表
  getPlants: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    health?: string;
    search?: string;
  }): Promise<PaginatedResponse<Plant>> => {
    return api.get('/plants', { params });
  },

  // 获取单个植物详情
  getPlantById: async (id: string): Promise<Plant> => {
    return api.get(`/plants/${id}`);
  },

  // 创建新植物
  createPlant: async (plantData: Partial<Plant>): Promise<Plant> => {
    return api.post('/plants', plantData);
  },

  // 更新植物信息
  updatePlant: async (id: string, plantData: Partial<Plant>): Promise<Plant> => {
    return api.put(`/plants/${id}`, plantData);
  },

  // 删除植物
  deletePlant: async (id: string): Promise<void> => {
    return api.delete(`/plants/${id}`);
  },

  // 批量删除植物
  deletePlants: async (ids: string[]): Promise<void> => {
    return api.post('/plants/batch-delete', { ids });
  },
};

// 植物养护操作 API
export const plantCareAPI = {
  // 给植物浇水
  waterPlant: async (id: string, data?: {
    amount?: number;
    notes?: string;
  }): Promise<Plant> => {
    return api.post(`/plants/${id}/water`, data);
  },

  // 更新植物健康状态
  updatePlantHealth: async (id: string, health: Plant['health']): Promise<Plant> => {
    return api.put(`/plants/${id}/health`, { health });
  },

  // 施肥
  fertilizePlant: async (id: string, data?: {
    fertilizerType?: string;
    amount?: number;
    notes?: string;
  }): Promise<Plant> => {
    return api.post(`/plants/${id}/fertilize`, data);
  },

  // 修剪
  prunePlant: async (id: string, data?: {
    parts?: string[];
    notes?: string;
  }): Promise<Plant> => {
    return api.post(`/plants/${id}/prune`, data);
  },

  // 换盆
  repotPlant: async (id: string, data?: {
    newPotSize?: string;
    newSoilType?: string;
    notes?: string;
  }): Promise<Plant> => {
    return api.post(`/plants/${id}/repot`, data);
  },
};

// 植物图片相关 API
export const plantImageAPI = {
  // 上传植物图片
  uploadPlantImage: async (id: string, imageFile: File): Promise<{ image: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.upload(`/plants/${id}/image`, formData);
  },

  // 删除植物图片
  deletePlantImage: async (id: string, imageId: string): Promise<void> => {
    return api.delete(`/plants/${id}/images/${imageId}`);
  },

  // 获取植物图片列表
  getPlantImages: async (id: string): Promise<{
    images: Array<{
      id: string;
      url: string;
      thumbnail: string;
      uploadedAt: string;
    }>;
  }> => {
    return api.get(`/plants/${id}/images`);
  },
};

// 植物统计相关 API
export const plantStatsAPI = {
  // 获取植物统计信息
  getPlantStats: async (): Promise<{
    totalPlants: number;
    healthyPlants: number;
    needsCarePlants: number;
    sickPlants: number;
    averageHealth: number;
  }> => {
    return api.get('/plants/stats');
  },

  // 获取植物健康趋势
  getHealthTrend: async (plantId: string, days: number = 30): Promise<{
    dates: string[];
    healthScores: number[];
  }> => {
    return api.get(`/plants/${plantId}/health-trend`, { params: { days } });
  },

  // 获取浇水历史
  getWateringHistory: async (plantId: string, params?: {
    page?: number;
    pageSize?: number;
  }): Promise<{
    waterings: Array<{
      id: string;
      amount: number;
      notes?: string;
      wateredAt: string;
    }>;
    total: number;
  }> => {
    return api.get(`/plants/${plantId}/watering-history`, { params });
  },
};

// 植物搜索和筛选 API
export const plantSearchAPI = {
  // 搜索植物
  searchPlants: async (query: string, params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Plant>> => {
    return api.get('/plants/search', { params: { query, ...params } });
  },

  // 按条件筛选植物
  filterPlants: async (filters: {
    status?: string[];
    health?: string[];
    location?: string[];
    species?: string[];
  }, params?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Plant>> => {
    return api.post('/plants/filter', { filters, ...params });
  },

  // 获取植物种类列表
  getPlantSpecies: async (): Promise<{
    species: Array<{
      name: string;
      count: number;
    }>;
  }> => {
    return api.get('/plants/species');
  },

  // 获取植物位置列表
  getPlantLocations: async (): Promise<{
    locations: Array<{
      name: string;
      count: number;
    }>;
  }> => {
    return api.get('/plants/locations');
  },
};

// 植物提醒相关 API
export const plantReminderAPI = {
  // 获取植物提醒
  getPlantReminders: async (): Promise<{
    reminders: Array<{
      id: string;
      plantId: string;
      plantName: string;
      type: 'water' | 'fertilize' | 'prune' | 'repot';
      dueDate: string;
      isOverdue: boolean;
    }>;
  }> => {
    return api.get('/plants/reminders');
  },

  // 设置植物提醒
  setPlantReminder: async (plantId: string, data: {
    type: 'water' | 'fertilize' | 'prune' | 'repot';
    frequency: number;
    frequencyUnit: 'days' | 'weeks' | 'months';
    enabled: boolean;
  }): Promise<void> => {
    return api.post(`/plants/${plantId}/reminders`, data);
  },

  // 更新植物提醒
  updatePlantReminder: async (reminderId: string, data: {
    frequency?: number;
    frequencyUnit?: 'days' | 'weeks' | 'months';
    enabled?: boolean;
  }): Promise<void> => {
    return api.put(`/plants/reminders/${reminderId}`, data);
  },

  // 删除植物提醒
  deletePlantReminder: async (reminderId: string): Promise<void> => {
    return api.delete(`/plants/reminders/${reminderId}`);
  },
};

// 导出所有植物相关 API
export const plantAPIs = {
  basic: plantAPI,
  care: plantCareAPI,
  image: plantImageAPI,
  stats: plantStatsAPI,
  search: plantSearchAPI,
  reminder: plantReminderAPI,
};
