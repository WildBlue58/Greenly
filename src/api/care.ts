import { api } from '../utils/request';
import type { CarePlan, CareRecord, CareTask, ApiResponse, PaginatedResponse } from '../store/types';

// 养护计划相关 API
export const carePlanAPI = {
  // 获取养护计划列表
  getCarePlans: async (params?: {
    page?: number;
    pageSize?: number;
    plantId?: string;
    status?: string;
  }): Promise<PaginatedResponse<CarePlan>> => {
    return api.get('/care/plans', { params });
  },

  // 获取单个养护计划详情
  getCarePlanById: async (id: string): Promise<CarePlan> => {
    return api.get(`/care/plans/${id}`);
  },

  // 创建养护计划
  createCarePlan: async (planData: Partial<CarePlan>): Promise<CarePlan> => {
    return api.post('/care/plans', planData);
  },

  // 更新养护计划
  updateCarePlan: async (id: string, planData: Partial<CarePlan>): Promise<CarePlan> => {
    return api.put(`/care/plans/${id}`, planData);
  },

  // 删除养护计划
  deleteCarePlan: async (id: string): Promise<void> => {
    return api.delete(`/care/plans/${id}`);
  },

  // 生成养护计划
  generateCarePlan: async (plantId: string, options?: {
    duration?: number; // 计划持续时间（天）
    intensity?: 'low' | 'medium' | 'high'; // 养护强度
  }): Promise<CarePlan> => {
    return api.post('/care/plans/generate', { plantId, ...options });
  },

  // 复制养护计划
  duplicateCarePlan: async (id: string, newPlantId: string): Promise<CarePlan> => {
    return api.post(`/care/plans/${id}/duplicate`, { newPlantId });
  },
};

// 养护任务相关 API
export const careTaskAPI = {
  // 获取养护任务列表
  getCareTasks: async (params?: {
    page?: number;
    pageSize?: number;
    plantId?: string;
    type?: string;
    status?: 'pending' | 'completed' | 'overdue';
    priority?: string;
  }): Promise<PaginatedResponse<CareTask>> => {
    return api.get('/care/tasks', { params });
  },

  // 获取单个养护任务详情
  getCareTaskById: async (id: string): Promise<CareTask> => {
    return api.get(`/care/tasks/${id}`);
  },

  // 创建养护任务
  createCareTask: async (taskData: Partial<CareTask>): Promise<CareTask> => {
    return api.post('/care/tasks', taskData);
  },

  // 更新养护任务
  updateCareTask: async (id: string, taskData: Partial<CareTask>): Promise<CareTask> => {
    return api.put(`/care/tasks/${id}`, taskData);
  },

  // 删除养护任务
  deleteCareTask: async (id: string): Promise<void> => {
    return api.delete(`/care/tasks/${id}`);
  },

  // 完成养护任务
  completeCareTask: async (id: string, data?: {
    notes?: string;
    images?: string[];
  }): Promise<CareTask> => {
    return api.post(`/care/tasks/${id}/complete`, data);
  },

  // 批量完成任务
  completeCareTasks: async (ids: string[], data?: {
    notes?: string;
  }): Promise<void> => {
    return api.post('/care/tasks/batch-complete', { ids, ...data });
  },

  // 获取今日任务
  getTodayTasks: async (): Promise<CareTask[]> => {
    return api.get('/care/tasks/today');
  },

  // 获取逾期任务
  getOverdueTasks: async (): Promise<CareTask[]> => {
    return api.get('/care/tasks/overdue');
  },

  // 获取即将到期的任务
  getUpcomingTasks: async (days: number = 7): Promise<CareTask[]> => {
    return api.get('/care/tasks/upcoming', { params: { days } });
  },
};

// 养护记录相关 API
export const careRecordAPI = {
  // 获取养护记录列表
  getCareRecords: async (params?: {
    page?: number;
    pageSize?: number;
    plantId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<CareRecord>> => {
    return api.get('/care/records', { params });
  },

  // 获取单个养护记录详情
  getCareRecordById: async (id: string): Promise<CareRecord> => {
    return api.get(`/care/records/${id}`);
  },

  // 创建养护记录
  createCareRecord: async (recordData: Partial<CareRecord>): Promise<CareRecord> => {
    return api.post('/care/records', recordData);
  },

  // 更新养护记录
  updateCareRecord: async (id: string, recordData: Partial<CareRecord>): Promise<CareRecord> => {
    return api.put(`/care/records/${id}`, recordData);
  },

  // 删除养护记录
  deleteCareRecord: async (id: string): Promise<void> => {
    return api.delete(`/care/records/${id}`);
  },

  // 上传养护记录图片
  uploadRecordImage: async (recordId: string, imageFile: File): Promise<{ image: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.upload(`/care/records/${recordId}/images`, formData);
  },

  // 删除养护记录图片
  deleteRecordImage: async (recordId: string, imageId: string): Promise<void> => {
    return api.delete(`/care/records/${recordId}/images/${imageId}`);
  },
};

// 养护统计相关 API
export const careStatsAPI = {
  // 获取养护统计信息
  getCareStats: async (params?: {
    startDate?: string;
    endDate?: string;
    plantId?: string;
  }): Promise<{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    averageCompletionTime: number;
    taskTypeDistribution: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
  }> => {
    return api.get('/care/stats', { params });
  },

  // 获取养护趋势
  getCareTrend: async (params?: {
    days?: number;
    plantId?: string;
  }): Promise<{
    dates: string[];
    completedTasks: number[];
    totalTasks: number[];
  }> => {
    return api.get('/care/trend', { params });
  },

  // 获取植物养护历史
  getPlantCareHistory: async (plantId: string, params?: {
    page?: number;
    pageSize?: number;
    type?: string;
  }): Promise<{
    records: CareRecord[];
    total: number;
  }> => {
    return api.get(`/care/plants/${plantId}/history`, { params });
  },
};

// 养护提醒相关 API
export const careReminderAPI = {
  // 获取养护提醒
  getCareReminders: async (): Promise<{
    reminders: Array<{
      id: string;
      taskId: string;
      plantId: string;
      plantName: string;
      taskTitle: string;
      dueDate: string;
      isOverdue: boolean;
      priority: string;
    }>;
  }> => {
    return api.get('/care/reminders');
  },

  // 设置养护提醒
  setCareReminder: async (taskId: string, data: {
    reminderTime: string;
    enabled: boolean;
  }): Promise<void> => {
    return api.post(`/care/tasks/${taskId}/reminders`, data);
  },

  // 更新养护提醒
  updateCareReminder: async (reminderId: string, data: {
    reminderTime?: string;
    enabled?: boolean;
  }): Promise<void> => {
    return api.put(`/care/reminders/${reminderId}`, data);
  },

  // 删除养护提醒
  deleteCareReminder: async (reminderId: string): Promise<void> => {
    return api.delete(`/care/reminders/${reminderId}`);
  },

  // 标记提醒为已读
  markReminderAsRead: async (reminderId: string): Promise<void> => {
    return api.post(`/care/reminders/${reminderId}/read`);
  },
};

// 养护模板相关 API
export const careTemplateAPI = {
  // 获取养护模板列表
  getCareTemplates: async (params?: {
    page?: number;
    pageSize?: number;
    plantType?: string;
  }): Promise<{
    templates: Array<{
      id: string;
      name: string;
      description: string;
      plantType: string;
      tasks: CareTask[];
    }>;
    total: number;
  }> => {
    return api.get('/care/templates', { params });
  },

  // 应用养护模板
  applyCareTemplate: async (templateId: string, plantId: string): Promise<CarePlan> => {
    return api.post(`/care/templates/${templateId}/apply`, { plantId });
  },

  // 创建自定义养护模板
  createCareTemplate: async (templateData: {
    name: string;
    description: string;
    plantType: string;
    tasks: Partial<CareTask>[];
  }): Promise<void> => {
    return api.post('/care/templates', templateData);
  },
};

// 导出所有养护相关 API
export const careAPIs = {
  plan: carePlanAPI,
  task: careTaskAPI,
  record: careRecordAPI,
  stats: careStatsAPI,
  reminder: careReminderAPI,
  template: careTemplateAPI,
};
