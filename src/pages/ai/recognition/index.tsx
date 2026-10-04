import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Field, Loading, Image, Toast } from "react-vant";
import { PhotoO, Arrow, Delete, ArrowLeft } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import { streamPlantCareChat, recognizePlantImage } from "../../../utils/llm";
import styles from "./recognition.module.css";
import { useTitle } from "../../../hooks";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type: "text" | "image" | "recognition";
}

interface RecognitionResult {
  plantName: string;
  scientificName: string;
  confidence: number;
  careAdvice: string;
  description: string;
}

const PlantRecognition: React.FC = () => {
  useTitle();
  const navigate = useNavigate();

  // 状态管理
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [recognitionResult, setRecognitionResult] =
    useState<RecognitionResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 检查API配置
  const checkAPIConfig = () => {
    const kimiKey = import.meta.env.VITE_KIMI_API_KEY;
    return !!kimiKey;
  };

  const hasAPIKey = checkAPIConfig();

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // 植物识别提示词已内聚在 utils/llm 的 recognizePlantImage 中

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      Toast.fail("请选择图片文件");
      return;
    }

    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      Toast.fail("图片大小不能超过10MB");
      return;
    }

    setImageFile(file);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 执行植物识别（AI 调用统一走 utils/llm）
  const recognizePlant = async () => {
    if (!imageFile || !hasAPIKey) {
      Toast.fail("请先上传图片并确保API密钥已配置");
      return;
    }

    setIsRecognizing(true);
    setRecognitionResult(null);

    try {
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("图片读取失败"));
        reader.readAsDataURL(imageFile);
      });

      const response = await recognizePlantImage(imageBase64);

      if (response.code !== 0 || !response.data) {
        throw new Error(response.msg || "识别失败，请重试");
      }

      const result = response.data;
      setRecognitionResult(result);

      // 添加格式化的识别结果到消息列表
      const formattedContent = `🌿 **植物识别成功！**

📋 **基本信息**
• 植物名称：${result.plantName}
• 学名：${result.scientificName}
• 识别置信度：${(result.confidence * 100).toFixed(1)}%

📖 **植物描述**
${result.description}

🌱 **专业养护建议**
${result.careAdvice}`;

      setMessages([
        {
          id: Date.now().toString(),
          content: formattedContent,
          role: "assistant",
          timestamp: new Date(),
          type: "recognition",
        },
      ]);
      Toast.success("识别成功！");
    } catch (error) {
      console.error("植物识别失败:", error);
      Toast.fail(error instanceof Error ? error.message : "识别失败，请重试");
    } finally {
      setIsRecognizing(false);
    }
  };

  // 发送聊天消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isChatting || !hasAPIKey) return;

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
    setIsChatting(true);
    setStreamingText("");

    try {
      // 构建聊天历史
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 添加植物识别上下文
      let contextMessage = currentInput;
      if (recognitionResult) {
        contextMessage = `基于之前识别的植物：${recognitionResult.plantName}（${recognitionResult.scientificName}），用户问：${currentInput}`;
      }

      // 创建助手消息占位符
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 使用流式聊天
      const response = await streamPlantCareChat(
        contextMessage,
        (chunk: string) => {
          // 实时更新流式文本
          setStreamingText((prev) => prev + chunk);
        },
        chatHistory,
        "kimi",
      );

      if (response.code === 0 && response.data) {
        // 更新最终消息内容
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: response.data!.content }
              : msg,
          ),
        );
        setStreamingText("");
      } else {
        // 如果流式输出失败，显示错误消息
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content:
                    response.msg ||
                    "抱歉，我现在无法回答您的问题。请检查API配置后重试。",
                }
              : msg,
          ),
        );
        setStreamingText("");
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
      setIsChatting(false);
    }
  };

  // 键盘事件处理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清除图片
  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRecognitionResult(null);
    setMessages([]);
    setStreamingText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.recognitionPage}>
      {/* 头部 */}
      <div className={styles.header}>
        <Button
          size="small"
          icon={<ArrowLeft />}
          onClick={() => navigate("/ai")}
          className={styles.backButton}
        >
          返回
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>🔍</div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>植物识别</h1>
            <p className={styles.subtitle}>
              拍照识别植物种类，获取专业养护建议
            </p>
          </div>
        </div>
      </div>

      {/* API配置提示 */}
      {!hasAPIKey && (
        <div className={styles.configWarning}>
          <Card className={styles.warningCard}>
            <div className={styles.warningContent}>
              <div className={styles.warningIcon}>⚠️</div>
              <div className={styles.warningText}>
                <h3>需要配置KIMI API密钥</h3>
                <p>
                  请在项目根目录创建 <code>.env.local</code> 文件并添加：
                </p>
                <div className={styles.codeBlock}>
                  <pre>VITE_KIMI_API_KEY=sk-your-kimi-key</pre>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 图片上传区域 */}
      <div className={styles.uploadSection}>
        <Card className={styles.uploadCard}>
          {!imagePreview ? (
            <div
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIcon}>
                <PhotoO />
              </div>
              <div className={styles.uploadText}>
                <h3>上传植物照片</h3>
                <p>点击选择照片或拖拽图片到此处</p>
                <p className={styles.uploadHint}>
                  支持 JPG、PNG 格式，文件大小不超过 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.imagePreview}>
              <div className={styles.imageContainer}>
                <Image
                  src={imagePreview}
                  alt="植物照片"
                  fit="cover"
                  width="100%"
                  height="200"
                  radius="8"
                />
                <Button
                  size="small"
                  type="danger"
                  icon={<Delete />}
                  className={styles.deleteButton}
                  onClick={clearImage}
                >
                  重新选择
                </Button>
              </div>

              <div className={styles.recognizeActions}>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isRecognizing}
                  disabled={!hasAPIKey}
                  onClick={recognizePlant}
                  className={styles.recognizeButton}
                >
                  {isRecognizing ? "识别中..." : "开始识别"}
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </Card>
      </div>

      {/* 识别结果和聊天区域 */}
      {messages.length > 0 && (
        <div className={styles.chatSection}>
          <Card className={styles.chatCard}>
            <div className={styles.chatHeader}>
              <h3>识别结果与养护咨询</h3>
            </div>

            <div className={styles.messagesContainer}>
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
                      <div
                        className={`${styles.messageText} ${
                          message.type === "recognition"
                            ? styles.recognitionText
                            : ""
                        }`}
                      >
                        {message.type === "recognition" ? (
                          <div className={styles.recognitionContent}>
                            {/* 解析和格式化识别结果 */}
                            {message.content.split("\n").map((line, index) => {
                              if (
                                line.startsWith("🌿") ||
                                line.startsWith("📋") ||
                                line.startsWith("📖") ||
                                line.startsWith("🌱") ||
                                line.startsWith("💡")
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className={styles.sectionTitle}
                                  >
                                    {line.replace(/\*\*/g, "")}
                                  </div>
                                );
                              } else if (line.startsWith("•")) {
                                return (
                                  <div key={index} className={styles.listItem}>
                                    {line.replace("•", "").trim()}
                                  </div>
                                );
                              } else if (line.trim()) {
                                return (
                                  <div
                                    key={index}
                                    className={styles.contentLine}
                                  >
                                    {line}
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={index}
                                  className={styles.spacer}
                                ></div>
                              );
                            })}
                            <div className={styles.recognitionBadge}>
                              <span>🔍 植物识别结果</span>
                            </div>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className={styles.messageTime}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 流式输出显示 */}
                {streamingText && (
                  <div
                    className={`${styles.messageItem} ${styles.assistantMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>
                        {streamingText}
                        <span className={styles.cursor}>|</span>
                      </div>
                    </div>
                  </div>
                )}

                {isChatting && !streamingText && (
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
                  placeholder="有任何养护问题都可以问我..."
                  className={styles.messageInput}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="primary"
                  size="small"
                  icon={<Arrow />}
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isChatting || !hasAPIKey}
                  loading={isChatting}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlantRecognition;
