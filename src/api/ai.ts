import { api } from '../utils/request';
import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult, ApiResponse } from '../store/types';

// AI 聊天相关 API
export const aiChatAPI = {
  // 发送聊天消息
  sendMessage: async (data: {
    message: string;
    model?: string;
    history?: ChatMessage[];
    context?: string;
  }): Promise<{
    content: string;
    model: string;
    timestamp: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> => {
    return api.post('/ai/chat', data);
  },

  // 获取聊天历史
  getChatHistory: async (params?: {
    page?: number;
    pageSize?: number;
    model?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    messages: ChatMessage[];
    total: number;
  }> => {
    return api.get('/ai/chat/history', { params });
  },

  // 清空聊天历史
  clearChatHistory: async (): Promise<void> => {
    return api.delete('/ai/chat/history');
  },

  // 获取支持的聊天模型
  getChatModels: async (): Promise<{
    models: Array<{
      id: string;
      name: string;
      description: string;
      maxTokens: number;
      supportsStreaming: boolean;
      pricing: {
        input: number;
        output: number;
      };
    }>;
  }> => {
    return api.get('/ai/models/chat');
  },

  // 流式聊天（WebSocket 或 Server-Sent Events）
  streamChat: async (data: {
    message: string;
    model?: string;
    history?: ChatMessage[];
  }, onMessage: (chunk: string) => void): Promise<void> => {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('流式聊天失败');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            onMessage(parsed.content || '');
          } catch (e) {
            console.error('解析流数据失败:', e);
          }
        }
      }
    }
  },
};

// 植物识别相关 API
export const aiRecognitionAPI = {
  // 植物识别
  recognizePlant: async (image: File, options?: {
    confidence?: number;
    maxResults?: number;
  }): Promise<PlantRecognitionResult> => {
    const formData = new FormData();
    formData.append('image', image);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    return api.upload('/ai/recognize', formData);
  },

  // 批量植物识别
  recognizePlants: async (images: File[]): Promise<PlantRecognitionResult[]> => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    return api.upload('/ai/recognize/batch', formData);
  },

  // 获取识别历史
  getRecognitionHistory: async (params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    recognitions: Array<PlantRecognitionResult & {
      id: string;
      createdAt: string;
    }>;
    total: number;
  }> => {
    return api.get('/ai/recognize/history', { params });
  },

  // 获取植物信息
  getPlantInfo: async (plantName: string): Promise<{
    name: string;
    scientificName: string;
    family: string;
    description: string;
    careInstructions: {
      watering: string;
      sunlight: string;
      temperature: string;
      soil: string;
      fertilizer: string;
    };
    commonProblems: Array<{
      issue: string;
      symptoms: string;
      solution: string;
    }>;
  }> => {
    return api.get(`/ai/plants/${encodeURIComponent(plantName)}/info`);
  },
};

// 图片生成相关 API
export const aiGenerationAPI = {
  // 生成图片
  generateImage: async (data: {
    prompt: string;
    model?: string;
    size?: string;
    quality?: string;
    style?: string;
  }): Promise<ImageGenerationResult> => {
    return api.post('/ai/generate', data);
  },

  // 批量生成图片
  generateImages: async (data: {
    prompts: string[];
    model?: string;
    size?: string;
    quality?: string;
  }): Promise<ImageGenerationResult[]> => {
    return api.post('/ai/generate/batch', data);
  },

  // 获取生成历史
  getGenerationHistory: async (params?: {
    page?: number;
    pageSize?: number;
    model?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    generations: Array<ImageGenerationResult & {
      id: string;
      createdAt: string;
    }>;
    total: number;
  }> => {
    return api.get('/ai/generate/history', { params });
  },

  // 获取支持的图片生成模型
  getImageModels: async (): Promise<{
    models: Array<{
      id: string;
      name: string;
      description: string;
      supportedSizes: string[];
      pricing: {
        perImage: number;
      };
    }>;
  }> => {
    return api.get('/ai/models/image');
  },
};

// 植物诊断相关 API
export const aiDiagnosisAPI = {
  // 植物诊断
  diagnosePlant: async (data: {
    image: File;
    symptoms?: string;
    plantName?: string;
  }): Promise<{
    diagnosis: string;
    confidence: number;
    possibleIssues: Array<{
      issue: string;
      probability: number;
      symptoms: string[];
      solutions: string[];
    }>;
    recommendations: string[];
    followUpActions: string[];
  }> => {
    const formData = new FormData();
    formData.append('image', data.image);
    if (data.symptoms) {
      formData.append('symptoms', data.symptoms);
    }
    if (data.plantName) {
      formData.append('plantName', data.plantName);
    }
    return api.upload('/ai/diagnose', formData);
  },

  // 获取诊断历史
  getDiagnosisHistory: async (params?: {
    page?: number;
    pageSize?: number;
    plantId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    diagnoses: Array<{
      id: string;
      plantId: string;
      plantName: string;
      diagnosis: string;
      confidence: number;
      createdAt: string;
    }>;
    total: number;
  }> => {
    return api.get('/ai/diagnose/history', { params });
  },

  // 获取常见植物问题
  getCommonPlantIssues: async (plantName?: string): Promise<{
    issues: Array<{
      name: string;
      description: string;
      symptoms: string[];
      causes: string[];
      solutions: string[];
      prevention: string[];
    }>;
  }> => {
    return api.get('/ai/diagnose/common-issues', {
      params: plantName ? { plantName } : undefined,
    });
  },
};

// AI 工作流相关 API
export const aiWorkflowAPI = {
  // 执行 AI 工作流
  executeWorkflow: async (workflowId: string, data: {
    inputs: Record<string, any>;
    options?: Record<string, any>;
  }): Promise<{
    outputs: Record<string, any>;
    executionTime: number;
    cost: number;
  }> => {
    return api.post(`/ai/workflows/${workflowId}/execute`, data);
  },

  // 获取可用工作流
  getWorkflows: async (): Promise<{
    workflows: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      inputs: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
      outputs: Array<{
        name: string;
        type: string;
        description: string;
      }>;
    }>;
  }> => {
    return api.get('/ai/workflows');
  },

  // 获取工作流执行历史
  getWorkflowHistory: async (params?: {
    page?: number;
    pageSize?: number;
    workflowId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    executions: Array<{
      id: string;
      workflowId: string;
      workflowName: string;
      status: 'success' | 'failed' | 'running';
      executionTime: number;
      cost: number;
      createdAt: string;
    }>;
    total: number;
  }> => {
    return api.get('/ai/workflows/history', { params });
  },
};

// AI 设置相关 API
export const aiSettingsAPI = {
  // 获取 AI 设置
  getAISettings: async (): Promise<{
    defaultChatModel: string;
    defaultImageModel: string;
    maxTokens: number;
    temperature: number;
    enableStreaming: boolean;
    autoSaveHistory: boolean;
    costLimit: number;
  }> => {
    return api.get('/ai/settings');
  },

  // 更新 AI 设置
  updateAISettings: async (settings: {
    defaultChatModel?: string;
    defaultImageModel?: string;
    maxTokens?: number;
    temperature?: number;
    enableStreaming?: boolean;
    autoSaveHistory?: boolean;
    costLimit?: number;
  }): Promise<void> => {
    return api.put('/ai/settings', settings);
  },

  // 获取 AI 使用统计
  getAIUsageStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalRequests: number;
    totalCost: number;
    requestsByModel: Record<string, number>;
    costByModel: Record<string, number>;
    dailyUsage: Array<{
      date: string;
      requests: number;
      cost: number;
    }>;
  }> => {
    return api.get('/ai/usage', { params });
  },
};

// 导出所有 AI 相关 API
export const aiAPIs = {
  chat: aiChatAPI,
  recognition: aiRecognitionAPI,
  generation: aiGenerationAPI,
  diagnosis: aiDiagnosisAPI,
  workflow: aiWorkflowAPI,
  settings: aiSettingsAPI,
};
