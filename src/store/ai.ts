import { streamPlantCareChat, type LLMMessage } from "../utils/llm";
import type { ChatMessage } from "./types";
import type { AiSlice, SliceCreator } from "./slices";

const createId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createAiSlice: SliceCreator<AiSlice> = (set, get) => ({
  chatMessages: [],
  aiLoading: false,

  sendChatMessage: async (message: string, model: string = "deepseek") => {
    const userMessage: ChatMessage = {
      id: createId("msg"),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    const aiMessage: ChatMessage = {
      id: createId("msg"),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      model,
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage, aiMessage],
      aiLoading: true,
    }));

    try {
      // 只保留最近10条消息作为上下文
      const chatHistory: LLMMessage[] = get()
        .chatMessages.slice(0, -1)
        .slice(-10)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const response = await streamPlantCareChat(
        message,
        (chunk: string) => {
          set((state) => ({
            chatMessages: state.chatMessages.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          }));
        },
        chatHistory,
        model,
      );

      if (response.code !== 0 || !response.data) {
        throw new Error(response.msg || "AI响应失败");
      }

      set((state) => ({
        chatMessages: state.chatMessages.map((msg) =>
          msg.id === aiMessage.id
            ? { ...msg, content: response.data!.content }
            : msg,
        ),
        aiLoading: false,
      }));
    } catch (error) {
      console.error("AI聊天失败:", error);

      set((state) => ({
        chatMessages: state.chatMessages.map((msg) =>
          msg.id === aiMessage.id
            ? {
                ...msg,
                content:
                  error instanceof Error
                    ? `抱歉，AI服务暂时不可用：${error.message}。请检查 .env.local 中的 API 密钥配置或稍后重试。`
                    : "抱歉，AI服务暂时不可用，请稍后重试。",
              }
            : msg,
        ),
        aiLoading: false,
      }));

      throw error;
    }
  },

  clearChat: () => {
    set({ chatMessages: [] });
  },
});
