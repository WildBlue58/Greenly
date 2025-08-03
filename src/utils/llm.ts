/**
 * LLM 大模型接入工具
 * 支持 DeepSeek、Kimi 等多种模型
 */

const DEEPSEEK_CHAT_API_URL = "https://api.deepseek.com/chat/completions";
const KIMI_CHAT_API_URL = "https://api.moonshot.cn/v1/chat/completions";

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMResponse {
  code: number;
  data?: {
    role: "assistant";
    content: string;
  };
  msg?: string;
}

/**
 * 通用LLM聊天接口
 * @param messages 消息历史
 * @param api_url API地址
 * @param api_key API密钥
 * @param model 模型名称
 * @returns 
 */
export const chat = async (
  messages: LLMMessage[],
  api_url: string = DEEPSEEK_CHAT_API_URL,
  api_key?: string,
  model: string = "deepseek-chat"
): Promise<LLMResponse> => {
  try {
    if (!api_key) {
      throw new Error("API密钥未配置");
    }

    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("API响应格式不正确");
    }

    return {
      code: 0,
      data: {
        role: "assistant",
        content: data.choices[0].message.content,
      },
    };
  } catch (err) {
    console.error("LLM API调用失败:", err);
    return {
      code: 1,
      msg: err instanceof Error ? err.message : "LLM调用出错",
    };
  }
};

/**
 * 流式LLM聊天接口
 * @param messages 消息历史
 * @param onChunk 流式数据回调
 * @param api_url API地址
 * @param api_key API密钥
 * @param model 模型名称
 * @returns 
 */
export const streamChat = async (
  messages: LLMMessage[],
  onChunk: (chunk: string) => void,
  api_url: string = DEEPSEEK_CHAT_API_URL,
  api_key?: string,
  model: string = "deepseek-chat"
): Promise<LLMResponse> => {
  try {
    if (!api_key) {
      throw new Error("API密钥未配置");
    }

    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法读取响应流");
    }

    const decoder = new TextDecoder();
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return {
                code: 0,
                data: {
                  role: "assistant",
                  content: fullContent,
                },
              };
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                const content = parsed.choices[0].delta.content;
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一个chunk
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      code: 0,
      data: {
        role: "assistant",
        content: fullContent,
      },
    };
  } catch (err) {
    console.error("流式LLM API调用失败:", err);
    return {
      code: 1,
      msg: err instanceof Error ? err.message : "LLM调用出错",
    };
  }
};

/**
 * DeepSeek 聊天
 * @param messages 消息历史
 * @returns 
 */
export const deepSeekChat = async (messages: LLMMessage[]): Promise<LLMResponse> => {
  const api_key = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!api_key) {
    return {
      code: 1,
      msg: "DeepSeek API密钥未配置。请在项目根目录创建.env.local文件并添加: VITE_DEEPSEEK_API_KEY=您的密钥"
    };
  }
  return await chat(messages, DEEPSEEK_CHAT_API_URL, api_key, "deepseek-chat");
};

/**
 * Kimi 聊天
 * @param messages 消息历史
 * @returns 
 */
export const kimiChat = async (messages: LLMMessage[]): Promise<LLMResponse> => {
  const api_key = import.meta.env.VITE_KIMI_API_KEY;
  if (!api_key) {
    return {
      code: 1,
      msg: "Kimi API密钥未配置。请在项目根目录创建.env.local文件并添加: VITE_KIMI_API_KEY=您的密钥"
    };
  }
  return await chat(messages, KIMI_CHAT_API_URL, api_key, "moonshot-v1-auto");
};

/**
 * 根据模型名称选择对应的聊天函数
 * @param model 模型名称
 * @param messages 消息历史
 * @returns 
 */
export const chatWithModel = async (
  model: string,
  messages: LLMMessage[]
): Promise<LLMResponse> => {
  switch (model.toLowerCase()) {
    case "kimi":
    case "moonshot":
      return await kimiChat(messages);
    case "deepseek":
    case "deepseek-chat":
    default:
      return await deepSeekChat(messages);
  }
};

/**
 * 为植物养护场景优化的聊天函数
 * @param userMessage 用户消息
 * @param chatHistory 聊天历史（可选）
 * @param model 模型名称
 * @returns 
 */
export const plantCareChat = async (
  userMessage: string,
  chatHistory: LLMMessage[] = [],
  model: string = "deepseek"
): Promise<LLMResponse> => {
  // 为植物养护添加系统提示
  const systemPrompt: LLMMessage = {
    role: "system",
    content: `你是一个专业的植物养护AI助手，名叫"小养"。你的任务是帮助用户解决植物养护相关问题。

请遵循以下原则：
1. 提供专业、准确的植物养护建议
2. 回答要简洁明了，易于理解
3. 如果涉及植物疾病诊断，建议用户提供更多信息或寻求专业帮助
4. 多使用友好、关怀的语调
5. 可以适当使用植物相关的emoji来让回答更生动
6. 如果问题不在你的专业范围内，礼貌地引导用户咨询相关专家

当前对话是关于植物养护的咨询。`
  };

  const messages: LLMMessage[] = [
    systemPrompt,
    ...chatHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];

  return await chatWithModel(model, messages);
};

/**
 * 流式植物养护聊天函数
 * @param userMessage 用户消息
 * @param onChunk 流式数据回调
 * @param chatHistory 聊天历史（可选）
 * @param model 模型名称
 * @returns 
 */
export const streamPlantCareChat = async (
  userMessage: string,
  onChunk: (chunk: string) => void,
  chatHistory: LLMMessage[] = [],
  model: string = "deepseek"
): Promise<LLMResponse> => {
  // 为植物养护添加系统提示
  const systemPrompt: LLMMessage = {
    role: "system",
    content: `你是一个专业的植物养护AI助手，名叫"小养"。你的任务是帮助用户解决植物养护相关问题。

请遵循以下原则：
1. 提供专业、准确的植物养护建议
2. 回答要简洁明了，易于理解
3. 如果涉及植物疾病诊断，建议用户提供更多信息或寻求专业帮助
4. 多使用友好、关怀的语调
5. 可以适当使用植物相关的emoji来让回答更生动
6. 如果问题不在你的专业范围内，礼貌地引导用户咨询相关专家

当前对话是关于植物养护的咨询。`
  };

  const messages: LLMMessage[] = [
    systemPrompt,
    ...chatHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];

  // 根据模型选择对应的API
  let api_url = DEEPSEEK_CHAT_API_URL;
  let api_key = import.meta.env.VITE_DEEPSEEK_API_KEY;
  let model_name = "deepseek-chat";

  if (model.toLowerCase() === "kimi" || model.toLowerCase() === "moonshot") {
    api_url = KIMI_CHAT_API_URL;
    api_key = import.meta.env.VITE_KIMI_API_KEY;
    model_name = "moonshot-v1-auto";
  }

  return await streamChat(messages, onChunk, api_url, api_key, model_name);
};

