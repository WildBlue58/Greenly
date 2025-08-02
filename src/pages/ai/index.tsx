import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Field, Loading } from "react-vant";
import { PhotoO, Search, Setting, Arrow, Add } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import { useAI } from "../../hooks/useAI";
import styles from "./ai.module.css";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image";
}

const AIPage: React.FC = () => {
  const { sendChatMessage, aiLoading, chatMessages } = useAI();
  const navigate = useNavigate();

  // 检查API密钥配置状态
  const checkAPIConfig = () => {
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const kimiKey = import.meta.env.VITE_KIMI_API_KEY;
    return {
      hasDeepSeek: !!deepseekKey,
      hasKimi: !!kimiKey,
      hasAnyKey: !!deepseekKey || !!kimiKey,
    };
  };

  const apiConfig = checkAPIConfig();

  // 聊天相关状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<"welcome" | "chat">("welcome");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Search />,
      title: "植物识别",
      description: "拍照识别植物种类，获取专业养护建议",
      action: () => navigate("/ai/recognition"),
      color: "#2196F3",
    },
    {
      icon: <PhotoO />,
      title: "图片生成",
      description: "根据描述生成植物相关的图片",
      action: () => alert("图片生成功能即将上线！"),
      color: "#FF9800",
    },
    {
      icon: <Setting />,
      title: "AI设置",
      description: "配置AI模型和个性化选项",
      action: () => alert("AI设置功能即将上线！"),
      color: "#9C27B0",
    },
  ];

  const handleFeatureClick = (action: () => void) => {
    action();
  };

  // 聊天相关函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatMode === "chat") {
      scrollToBottom();
    }
  }, [messages, chatMode]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || aiLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage(currentInput);

      if (result.success) {
        // 直接使用从LLM返回的实际内容
        let assistantContent = "收到您的消息，正在处理...";

        // 尝试从chatMessages中获取最新的AI回复
        if (chatMessages.length > 0) {
          const latestMessage = chatMessages[chatMessages.length - 1];
          if (latestMessage && latestMessage.role === "assistant") {
            assistantContent = latestMessage.content;
          }
        }

        // 短暂延迟以确保store更新
        setTimeout(() => {
          const updatedLatestMessage = chatMessages[chatMessages.length - 1];
          if (
            updatedLatestMessage &&
            updatedLatestMessage.role === "assistant"
          ) {
            assistantContent = updatedLatestMessage.content;
          }

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: assistantContent,
            role: "assistant",
            timestamp: new Date(),
            type: "text",
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }, 800);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            result.error ||
            "抱歉，我现在无法回答您的问题。可能是API密钥未配置或网络问题，请检查配置后重试。",
          role: "assistant",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("聊天发送失败:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "网络连接出现问题，请检查网络连接和API配置后重试。",
        role: "assistant",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "如何给植物浇水？",
    "植物叶子发黄怎么办？",
    "什么植物适合新手？",
    "如何判断植物缺水？",
    "多肉植物怎么养护？",
    "室内植物需要多少光照？",
  ];

  const handleQuickQuestion = async (question: string) => {
    if (chatMode === "welcome") {
      setChatMode("chat");
    }
    setInputValue(question);
    // 延迟一下确保UI更新后自动发送消息
    setTimeout(async () => {
      if (!question.trim() || isLoading || aiLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        content: question,
        role: "user",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const result = await sendChatMessage(question);

        if (result.success) {
          let assistantContent = "收到您的消息，正在处理...";

          if (chatMessages.length > 0) {
            const latestMessage = chatMessages[chatMessages.length - 1];
            if (latestMessage && latestMessage.role === "assistant") {
              assistantContent = latestMessage.content;
            }
          }

          setTimeout(() => {
            const updatedLatestMessage = chatMessages[chatMessages.length - 1];
            if (
              updatedLatestMessage &&
              updatedLatestMessage.role === "assistant"
            ) {
              assistantContent = updatedLatestMessage.content;
            }

            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: assistantContent,
              role: "assistant",
              timestamp: new Date(),
              type: "text",
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }, 800);
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              result.error ||
              "抱歉，我现在无法回答您的问题。可能是API密钥未配置或网络问题，请检查配置后重试。",
            role: "assistant",
            timestamp: new Date(),
            type: "text",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error("聊天发送失败:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "网络连接出现问题，请检查网络连接和API配置后重试。",
          role: "assistant",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  const startNewChat = () => {
    setChatMode("chat");
  };

  const backToWelcome = () => {
    setChatMode("welcome");
    setMessages([]);
    setInputValue("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.aiPage}>
      {/* API配置状态 */}
      {!apiConfig.hasAnyKey && (
        <div className={styles.configWarning}>
          <Card className={styles.warningCard}>
            <div className={styles.warningContent}>
              <div className={styles.warningIcon}>⚠️</div>
              <div className={styles.warningText}>
                <h3>需要配置API密钥</h3>
                <p>
                  请在项目根目录创建 <code>.env.local</code>{" "}
                  文件并添加您的API密钥：
                </p>
                <div className={styles.codeBlock}>
                  <pre>
                    {`VITE_DEEPSEEK_API_KEY=sk-your-deepseek-key
VITE_KIMI_API_KEY=sk-your-kimi-key`}
                  </pre>
                </div>
                <p className={styles.helpText}>
                  配置完成后请重启开发服务器。详细说明请查看项目根目录的{" "}
                  <code>AI_API_配置说明.md</code> 文件。
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {chatMode === "welcome" ? (
        // 欢迎界面
        <>
          {/* 页面头部 */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>🌱</div>
              <div className={styles.headerText}>
                <h1 className={styles.title}>AI植物助手</h1>
                <p className={styles.subtitle}>您的专属植物养护顾问</p>
              </div>
            </div>
          </div>

          {/* 主要聊天区域 */}
          <div className={styles.welcomeSection}>
            <Card className={styles.welcomeCard}>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeIcon}>🤖</div>
                <h2 className={styles.welcomeTitle}>AI植物助手</h2>
                <p className={styles.welcomeDesc}>
                  我是您的专属植物养护顾问，可以帮您解答各种植物相关问题
                </p>

                <div className={styles.configStatus}>
                  <span className={styles.statusLabel}>配置状态：</span>
                  <span
                    className={`${styles.statusItem} ${
                      apiConfig.hasDeepSeek
                        ? styles.configured
                        : styles.notConfigured
                    }`}
                  >
                    DeepSeek {apiConfig.hasDeepSeek ? "✓" : "✗"}
                  </span>
                  <span
                    className={`${styles.statusItem} ${
                      apiConfig.hasKimi
                        ? styles.configured
                        : styles.notConfigured
                    }`}
                  >
                    Kimi {apiConfig.hasKimi ? "✓" : "✗"}
                  </span>
                </div>

                <div className={styles.quickQuestions}>
                  <h3 className={styles.quickTitle}>常见问题</h3>
                  <div className={styles.questionsGrid}>
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        size="small"
                        type="primary"
                        plain
                        className={styles.quickButton}
                        onClick={() => handleQuickQuestion(question)}
                        disabled={!apiConfig.hasAnyKey}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<Add />}
                    className={styles.startChatButton}
                    onClick={startNewChat}
                    disabled={!apiConfig.hasAnyKey}
                  >
                    开始对话
                  </Button>
                  {!apiConfig.hasAnyKey && (
                    <p className={styles.disabledHint}>请先配置API密钥后使用</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* 功能网格 */}
          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>其他功能</h3>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={styles.featureCard}
                  onClick={() => handleFeatureClick(feature.action)}
                >
                  <div className={styles.featureContent}>
                    <div
                      className={styles.featureIcon}
                      style={{
                        backgroundColor: `${feature.color}20`,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div className={styles.featureInfo}>
                      <h4 className={styles.featureTitle}>{feature.title}</h4>
                      <p className={styles.featureDesc}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        // 聊天界面
        <div className={styles.chatContainer}>
          {/* 聊天头部 */}
          <div className={styles.chatHeader}>
            <Button
              size="small"
              icon={<Arrow direction="left" />}
              onClick={backToWelcome}
              className={styles.backButton}
            >
              返回
            </Button>
            <div className={styles.chatHeaderInfo}>
              <h2 className={styles.chatTitle}>AI植物助手</h2>
              <p className={styles.chatSubtitle}>专业植物养护咨询</p>
            </div>
          </div>

          {/* 消息区域 */}
          <div className={styles.messagesContainer}>
            <div className={styles.messagesList}>
              {messages.length === 0 ? (
                <div className={styles.emptyChat}>
                  <div className={styles.emptyChatIcon}>💬</div>
                  <p className={styles.emptyChatText}>
                    开始您的植物养护咨询吧！
                  </p>
                  <div className={styles.quickQuestionsInChat}>
                    <h4 className={styles.quickTitleInChat}>常见问题：</h4>
                    <div className={styles.questionsGridInChat}>
                      {quickQuestions.slice(0, 4).map((question, index) => (
                        <Button
                          key={index}
                          size="small"
                          type="primary"
                          plain
                          className={styles.quickButtonInChat}
                          onClick={() => handleQuickQuestion(question)}
                          disabled={!apiConfig.hasAnyKey}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.messageItem} ${
                        message.role === "user"
                          ? styles.userMessage
                          : styles.assistantMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <div className={styles.messageText}>
                          {message.content}
                        </div>
                        <div className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {isLoading && (
                <div
                  className={`${styles.messageItem} ${styles.assistantMessage}`}
                >
                  <div className={styles.messageContent}>
                    <div className={styles.loadingMessage}>
                      <Loading size="small" color="#4CAF50">
                        正在思考...
                      </Loading>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 输入区域 */}
          <div className={styles.inputSection}>
            <div className={styles.inputContainer}>
              <Field
                value={inputValue}
                onChange={setInputValue}
                placeholder="输入您的问题..."
                className={styles.messageInput}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="primary"
                size="small"
                icon={<Arrow />}
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={
                  !inputValue.trim() || isLoading || !apiConfig.hasAnyKey
                }
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPage;
