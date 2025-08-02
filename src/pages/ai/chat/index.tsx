import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Field, Loading, Empty } from "react-vant";
import { useAI, useTitle } from "../../../hooks";
import styles from "./chat.module.css";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image";
}

const AIChat: React.FC = () => {
  useTitle();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "你好！我是小养的AI助手，有什么植物养护问题可以问我哦 🌱",
      role: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendChatMessage, aiLoading } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage(inputValue);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.success
          ? "消息发送成功"
          : result.error || "抱歉，我现在无法回答您的问题。",
        role: "assistant",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("发送消息失败:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "抱歉，网络连接出现问题，请稍后重试。",
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
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.chatContainer}>
      {/* 聊天消息区域 */}
      <div className={styles.messagesContainer}>
        {messages.length > 1 ? (
          <div className={styles.messagesList}>
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
                  <div className={styles.messageText}>{message.content}</div>
                  <div className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
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
        ) : (
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeIcon}>🌱</div>
              <h2 className={styles.welcomeTitle}>AI植物助手</h2>
              <p className={styles.welcomeDesc}>
                我是您的专属植物养护顾问，可以帮您解答各种植物相关问题
              </p>

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
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className={styles.inputSection}>
        <div className={styles.inputContainer}>
          <div className={styles.inputActions}>
            <Button size="small" className={styles.actionButton}>
              图片
            </Button>
            <Button size="small" className={styles.actionButton}>
              语音
            </Button>
            <Button size="small" className={styles.actionButton}>
              表情
            </Button>
          </div>

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
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
