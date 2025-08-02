import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult } from "./types";
import { plantCareChat, type LLMMessage } from "../utils/llm";

// AI状态管理
export const aiStore = (set: any, get: any) => ({
  chatMessages: [] as ChatMessage[],
  aiLoading: false,
  recognitionResult: null as PlantRecognitionResult | null,
  generationResults: [] as ImageGenerationResult[],

  // 发送聊天消息
  sendChatMessage: async (message: string, model: string = "deepseek") => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    set((state: any) => ({ 
      chatMessages: [...state.chatMessages, userMessage],
      aiLoading: true 
    }));

    try {
      // 获取当前聊天历史，转换为LLM格式
      const currentMessages = get().chatMessages;
      const chatHistory: LLMMessage[] = currentMessages
        .slice(-10) // 只保留最近10条消息作为上下文
        .map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.content,
        }));

      // 调用真实的LLM API
      const response = await plantCareChat(message, chatHistory, model);
      
      if (response.code !== 0 || !response.data) {
        throw new Error(response.msg || "AI响应失败");
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data.content,
        role: "assistant",
        timestamp: new Date(),
        model,
      };

      set((state: any) => ({ 
        chatMessages: [...state.chatMessages, aiMessage],
        aiLoading: false 
      }));
    } catch (error) {
      console.error("AI聊天失败:", error);
      
      // 添加错误消息到聊天记录
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error 
          ? `抱歉，AI服务暂时不可用：${error.message}。请检查网络连接或稍后重试。` 
          : "抱歉，AI服务暂时不可用，请稍后重试。",
        role: "assistant",
        timestamp: new Date(),
        model,
      };

      set((state: any) => ({ 
        chatMessages: [...state.chatMessages, errorMessage],
        aiLoading: false 
      }));
      
      throw error;
    }
  },

  // 植物识别
  recognizePlant: async (image: File) => {
    set({ aiLoading: true });
    try {
      // 模拟识别延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟识别结果
      const mockResult: PlantRecognitionResult = {
        plantName: "绿萝",
        species: "绿萝属",
        confidence: 0.95,
        careTips: [
          "喜欢温暖湿润的环境",
          "需要散射光，避免阳光直射",
          "土壤保持湿润但不积水",
          "定期修剪促进生长"
        ],
        image: URL.createObjectURL(image),
      };
      
      set({ 
        recognitionResult: mockResult,
        aiLoading: false 
      });
    } catch (error) {
      console.error("植物识别失败:", error);
      set({ aiLoading: false });
      throw error;
    }
  },

  // 生成图片
  generateImage: async (prompt: string, model: string = "dall-e") => {
    set({ aiLoading: true });
    try {
      // 模拟生成延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟生成结果
      const mockResult: ImageGenerationResult = {
        imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=512&h=512&fit=crop",
        prompt,
        model,
        createdAt: new Date(),
      };
      
      set((state: any) => ({ 
        generationResults: [...state.generationResults, mockResult],
        aiLoading: false 
      }));
    } catch (error) {
      console.error("图片生成失败:", error);
      set({ aiLoading: false });
      throw error;
    }
  },

  // 植物诊断
  diagnosePlant: async (image: File, _symptoms: string) => {
    set({ aiLoading: true });
    try {
      // 模拟诊断延迟
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // 模拟诊断结果
      const mockResult: PlantRecognitionResult = {
        plantName: "绿萝",
        species: "绿萝属",
        confidence: 0.88,
        careTips: [
          "叶子发黄可能是缺水或光照过强",
          "建议检查土壤湿度",
          "适当增加浇水频率",
          "避免阳光直射"
        ],
        image: URL.createObjectURL(image),
      };
      
      set({ 
        recognitionResult: mockResult,
        aiLoading: false 
      });
    } catch (error) {
      console.error("植物诊断失败:", error);
      set({ aiLoading: false });
      throw error;
    }
  },

  // 清空聊天记录
  clearChat: () => {
    set({ chatMessages: [] });
  },

  // 清空识别结果
  clearRecognitionResult: () => {
    set({ recognitionResult: null });
  },

  // 清空生成结果
  clearGenerationResults: () => {
    set({ generationResults: [] });
  },

  // 获取聊天历史
  getChatHistory: () => {
    return get().chatMessages;
  },

  // 获取最近的聊天消息
  getRecentMessages: (count: number = 10) => {
    const messages = get().chatMessages;
    return messages.slice(-count);
  },

  // 切换AI模型
  switchModel: (model: string) => {
    // 这里可以添加模型切换的逻辑
    console.log("切换到模型:", model);
  },

  // 获取支持的模型列表
  getSupportedModels: () => {
    return [
      { value: "deepseek", label: "DeepSeek", color: "primary" },
      { value: "kimi", label: "Kimi", color: "success" },
      { value: "doubao", label: "豆包", color: "warning" },
    ];
  },

  // 获取图片生成模型
  getImageModels: () => {
    return [
      { value: "dall-e", label: "DALL-E", color: "primary" },
      { value: "midjourney", label: "Midjourney", color: "success" },
      { value: "stable-diffusion", label: "Stable Diffusion", color: "warning" },
    ];
  },
});
