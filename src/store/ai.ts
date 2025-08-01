import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult } from "./types";

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
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          model,
          history: get().chatMessages.slice(-10), // 保留最近10条消息
        }),
      });

      if (!response.ok) {
        throw new Error("AI聊天失败");
      }

      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.content,
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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/ai/recognize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("植物识别失败");
      }

      const result = await response.json();
      set({ 
        recognitionResult: result,
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
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!response.ok) {
        throw new Error("图片生成失败");
      }

      const result: ImageGenerationResult = await response.json();
      set((state: any) => ({ 
        generationResults: [...state.generationResults, result],
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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", image);
      formData.append("symptoms", symptoms);

      const response = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("植物诊断失败");
      }

      const result = await response.json();
      set({ 
        recognitionResult: result,
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
