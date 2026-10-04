import { useCallback, useMemo } from 'react';
import { useStore } from '../store';

/**
 * AI相关Hook
 * 提供AI聊天功能
 */
export const useAI = () => {
  const store = useStore();

  const chatMessages = store.chatMessages;
  const aiLoading = store.aiLoading;

  /**
   * 发送聊天消息
   */
  const handleSendChatMessage = useCallback(async (message: string, model: string = "deepseek") => {
    try {
      await store.sendChatMessage(message, model);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '发送消息失败' };
    }
  }, [store]);

  /**
   * 清空聊天记录
   */
  const handleClearChat = useCallback(() => {
    store.clearChat();
  }, [store]);

  /**
   * 获取最新消息
   */
  const latestMessage = useMemo(() => {
    return chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
  }, [chatMessages]);

  return {
    // 状态
    chatMessages,
    aiLoading,

    // 方法
    sendChatMessage: handleSendChatMessage,
    clearChat: handleClearChat,

    // 派生数据
    latestMessage,
  };
};
