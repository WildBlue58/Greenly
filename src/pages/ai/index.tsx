import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Field, Loading, Toast } from "react-vant";
import { PhotoO, Search, Setting, Arrow, Add } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { useTitle } from "../../hooks";
import styles from "./ai.module.css";

const AIPage: React.FC = () => {
  useTitle();
  const chatMessages = useStore((s) => s.chatMessages);
  const aiLoading = useStore((s) => s.aiLoading);
  const sendChatMessage = useStore((s) => s.sendChatMessage);
  const clearChat = useStore((s) => s.clearChat);
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
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState<"welcome" | "chat">("welcome");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Search />,
      title: "植物识别",
      description: "拍照识别植物种类，获取专业养护建议",
      action: () => navigate("/ai/recognition"),
      color: "var(--info)",
    },
    {
      icon: <PhotoO />,
      title: "图片生成",
      description: "根据描述生成植物相关的图片",
      action: () => Toast.info("图片生成功能即将上线！"),
      color: "var(--warning)",
    },
    {
      icon: <Setting />,
      title: "AI设置",
      description: "配置AI模型和个性化选项",
      action: () => Toast.info("AI设置功能即将上线！"),
      color: "var(--primary)",
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
  }, [chatMessages, chatMode]);

  // 发送消息：消息流由 store 统一维护（含流式输出与错误提示）
  const handleSend = async (text: string) => {
    const content = text.trim();
    if (!content || aiLoading || !apiConfig.hasAnyKey) return;

    setInputValue("");
    if (chatMode === "welcome") {
      setChatMode("chat");
    }

    try {
      await sendChatMessage(content);
    } catch (error) {
      // 错误信息已由 store 写入对话流，这里仅记录日志
      console.error("聊天发送失败:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
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

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  const startNewChat = () => {
    setChatMode("chat");
  };

  const backToWelcome = () => {
    setChatMode("welcome");
    clearChat();
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
                        backgroundColor: `color-mix(in srgb, ${feature.color} 14%, transparent)`,
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
              {chatMessages.length === 0 ? (
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
                  {chatMessages.map((message) => (
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
              {aiLoading && (
                <div
                  className={`${styles.messageItem} ${styles.assistantMessage}`}
                >
                  <div className={styles.messageContent}>
                    <div className={styles.loadingMessage}>
                      <Loading size="small" color="var(--primary)">
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
                onClick={() => handleSend(inputValue)}
                disabled={
                  !inputValue.trim() || aiLoading || !apiConfig.hasAnyKey
                }
                loading={aiLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPage;
