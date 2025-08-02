import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult } from "./types";

// 模拟AI响应数据
const mockAIResponses = {
  "浇水": "根据你的描述，这盆植物需要浇水了。建议使用室温的水，避免冷水直接浇灌。浇水时要确保土壤充分湿润，但不要积水。",
  "施肥": "植物施肥建议使用稀释的肥料，避免浓度过高烧伤根系。一般建议在生长季节每月施肥1-2次。",
  "光照": "这盆植物需要充足的散射光，避免阳光直射。可以放在朝东或朝北的窗台附近。",
  "修剪": "定期修剪可以促进植物生长，去除枯黄叶片，保持植株美观。",
  "换盆": "当植物根系充满花盆时，需要换更大的花盆。建议在春季进行换盆操作。",
};

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
      // 模拟AI响应延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成模拟响应
      let aiResponse = "我是你的植物养护AI助手，很高兴为你服务！";
      
      // 根据关键词生成相应回复
      if (message.includes("浇水") || message.includes("水")) {
        aiResponse = mockAIResponses["浇水"];
      } else if (message.includes("施肥") || message.includes("肥料")) {
        aiResponse = mockAIResponses["施肥"];
      } else if (message.includes("光照") || message.includes("阳光")) {
        aiResponse = mockAIResponses["光照"];
      } else if (message.includes("修剪")) {
        aiResponse = mockAIResponses["修剪"];
      } else if (message.includes("换盆")) {
        aiResponse = mockAIResponses["换盆"];
      } else {
        aiResponse = "感谢你的咨询！我是专业的植物养护AI助手，可以为你提供浇水、施肥、光照、修剪等方面的建议。请告诉我你的具体问题。";
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
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
      set({ aiLoading: false });
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
  diagnosePlant: async (image: File, symptoms: string) => {
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
