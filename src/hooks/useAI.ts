import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult } from '../store/types';

/**
 * AI相关Hook
 * 提供聊天、植物识别、图片生成等功能
 */
export const useAI = () => {
  const store = useStore() as any;
  
  // 从store中提取AI相关状态和方法
  const chatMessages = store.chatMessages || [];
  const aiLoading = store.aiLoading;
  const recognitionResult = store.recognitionResult;
  const generationResults = store.generationResults || [];
  const sendChatMessage = store.sendChatMessage;
  const recognizePlant = store.recognizePlant;
  const generateImage = store.generateImage;
  const clearChat = store.clearChat;
  const getAvailableModels = store.getAvailableModels;

  /**
   * 发送聊天消息
   */
  const handleSendChatMessage = useCallback(async (message: string, model: string = "deepseek") => {
    try {
      await sendChatMessage(message, model);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '发送消息失败' };
    }
  }, [sendChatMessage]);

  /**
   * 植物识别
   */
  const handleRecognizePlant = useCallback(async (image: File) => {
    try {
      await recognizePlant(image);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '植物识别失败' };
    }
  }, [recognizePlant]);

  /**
   * 生成图片
   */
  const handleGenerateImage = useCallback(async (prompt: string, model: string = "dall-e") => {
    try {
      const result = await generateImage(prompt, model);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '图片生成失败' };
    }
  }, [generateImage]);

  /**
   * 清空聊天记录
   */
  const handleClearChat = useCallback(() => {
    clearChat();
  }, [clearChat]);

  /**
   * 获取可用模型列表
   */
  const handleGetAvailableModels = useCallback(async () => {
    try {
      const models = await getAvailableModels();
      return { success: true, data: models };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取模型列表失败' };
    }
  }, [getAvailableModels]);

  /**
   * 获取用户消息
   */
  const userMessages = useMemo(() => {
    return chatMessages.filter((message: ChatMessage) => message.role === 'user');
  }, [chatMessages]);

  /**
   * 获取AI回复消息
   */
  const aiMessages = useMemo(() => {
    return chatMessages.filter((message: ChatMessage) => message.role === 'assistant');
  }, [chatMessages]);

  /**
   * 获取最新消息
   */
  const latestMessage = useMemo(() => {
    return chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
  }, [chatMessages]);

  /**
   * 获取聊天统计信息
   */
  const chatStats = useMemo(() => {
    const totalMessages = chatMessages.length;
    const userCount = userMessages.length;
    const aiCount = aiMessages.length;
    const uniqueModels = new Set(aiMessages.map((msg: ChatMessage) => msg.model)).size;

    return {
      totalMessages,
      userCount,
      aiCount,
      uniqueModels,
      averageResponseTime: totalMessages > 0 ? '2.5s' : '0s', // 这里可以根据实际数据计算
    };
  }, [chatMessages, userMessages, aiMessages]);

  /**
   * 获取最近使用的模型
   */
  const recentModels = useMemo(() => {
    const modelCounts: Record<string, number> = {};
    aiMessages.forEach((message: ChatMessage) => {
      if (message.model) {
        modelCounts[message.model] = (modelCounts[message.model] || 0) + 1;
      }
    });
    
    return Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([model]) => model);
  }, [aiMessages]);

  /**
   * 检查是否有未读消息
   */
  const hasUnreadMessages = useMemo(() => {
    // 这里可以根据实际需求实现未读消息检测逻辑
    return false;
  }, [chatMessages]);

  return {
    // 状态
    chatMessages,
    aiLoading,
    recognitionResult,
    generationResults,
    
    // 方法
    sendChatMessage: handleSendChatMessage,
    recognizePlant: handleRecognizePlant,
    generateImage: handleGenerateImage,
    clearChat: handleClearChat,
    getAvailableModels: handleGetAvailableModels,
    
    // 筛选数据
    userMessages,
    aiMessages,
    latestMessage,
    recentModels,
    
    // 统计信息
    chatStats,
    hasUnreadMessages,
  };
};
