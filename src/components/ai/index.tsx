import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Input, Image, Tag } from "react-vant";
import { ChatO, UserO, PhotoO } from "@react-vant/icons";
import {
  Button as CustomButton,
  Loading as CustomLoading,
  showToast,
} from "../common";
import styles from "./ai.module.css";

// AI 类型定义
interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
}

interface PlantRecognitionResult {
  plantName: string;
  species: string;
  confidence: number;
  careTips: string[];
  image: string;
}

interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: Date;
}

// ChatBot 组件
interface ChatBotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, model?: string) => void;
  loading?: boolean;
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  messages,
  onSendMessage,
  loading = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("deepseek");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { value: "deepseek", label: "DeepSeek", color: "primary" as const },
    { value: "kimi", label: "Kimi", color: "primary" as const },
    { value: "doubao", label: "豆包", color: "primary" as const },
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    onSendMessage(inputValue.trim(), selectedModel);
    setInputValue("");
  }, [inputValue, selectedModel, onSendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={`${styles.chatBot} ${className}`}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>
          <ChatO />
          <span>AI 植物助手</span>
        </div>
        <div className={styles.modelSelector}>
          {models.map((model) => (
            <CustomButton
              key={model.value}
              size="small"
              type={selectedModel === model.value ? model.color : "default"}
              onClick={() => setSelectedModel(model.value)}
              className={styles.modelButton}
            >
              {model.label}
            </CustomButton>
          ))}
        </div>
      </div>

      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <div className={styles.emptyChat}>
            <ChatO />
            <h3>欢迎使用小养AI助手</h3>
            <p>我可以帮您解答植物养护问题，识别植物品种，生成养护建议等</p>
            <div className={styles.suggestions}>
              <CustomButton
                size="small"
                onClick={() =>
                  onSendMessage("如何给多肉植物浇水？", selectedModel)
                }
                className={styles.suggestionButton}
              >
                如何给多肉植物浇水？
              </CustomButton>
              <CustomButton
                size="small"
                onClick={() =>
                  onSendMessage("绿萝叶子发黄怎么办？", selectedModel)
                }
                className={styles.suggestionButton}
              >
                绿萝叶子发黄怎么办？
              </CustomButton>
              <CustomButton
                size="small"
                onClick={() =>
                  onSendMessage("推荐适合新手养的植物", selectedModel)
                }
                className={styles.suggestionButton}
              >
                推荐适合新手养的植物
              </CustomButton>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.role]}`}
            >
              <div className={styles.messageAvatar}>
                {message.role === "user" ? <UserO /> : <ChatO />}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageMeta}>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.model && <Tag type="primary">{message.model}</Tag>}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageAvatar}>
              <ChatO />
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <CustomLoading visible={true} size="small" />
                <span>AI正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <div className={styles.inputWrapper}>
          <Input
            value={inputValue}
            onChange={setInputValue}
            placeholder="输入您的问题..."
            onKeyPress={handleKeyPress}
            className={styles.messageInput}
          />
          <CustomButton
            type="primary"
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={styles.sendButton}
          >
            <ChatO />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

// PlantRecognition 组件
interface PlantRecognitionProps {
  onRecognize: (image: File) => void;
  result?: PlantRecognitionResult;
  loading?: boolean;
  className?: string;
}

export const PlantRecognition: React.FC<PlantRecognitionProps> = ({
  onRecognize,
  result,
  loading = false,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRecognize = useCallback(() => {
    if (selectedImage) {
      onRecognize(selectedImage);
    }
  }, [selectedImage, onRecognize]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl("");
  }, []);

  return (
    <div className={`${styles.plantRecognition} ${className}`}>
      <div className={styles.recognitionHeader}>
        <h2 className={styles.recognitionTitle}>植物识别</h2>
        <p className={styles.recognitionDesc}>
          拍照或上传图片，AI将帮您识别植物品种并提供养护建议
        </p>
      </div>

      <div className={styles.recognitionArea}>
        {previewUrl ? (
          <div className={styles.previewContainer}>
            <Image
              src={previewUrl}
              width="100%"
              height="300px"
              fit="cover"
              radius={12}
            />
            <div className={styles.previewActions}>
              <CustomButton
                type="primary"
                onClick={handleRecognize}
                loading={loading}
                disabled={!selectedImage}
                className={styles.recognizeButton}
              >
                开始识别
              </CustomButton>
              <CustomButton
                type="default"
                onClick={handleReset}
                className={styles.resetButton}
              >
                重新选择
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className={styles.uploadArea}>
            <div className={styles.uploadPlaceholder}>
              <PhotoO />
              <span>点击拍照或选择图片</span>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
              className={styles.fileInput}
            />
          </div>
        )}
      </div>

      {result && (
        <div className={styles.recognitionResult}>
          <h3 className={styles.resultTitle}>识别结果</h3>
          <div className={styles.resultCard}>
            <div className={styles.resultImage}>
              <Image
                src={result.image}
                width="100%"
                height="200px"
                fit="cover"
                radius={8}
              />
            </div>
            <div className={styles.resultInfo}>
              <h4 className={styles.plantName}>{result.plantName}</h4>
              <p className={styles.plantSpecies}>{result.species}</p>
              <div className={styles.confidence}>
                <span>识别置信度: </span>
                <span className={styles.confidenceValue}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {result.careTips.length > 0 && (
            <div className={styles.careTips}>
              <h4 className={styles.tipsTitle}>养护建议</h4>
              <ul className={styles.tipsList}>
                {result.careTips.map((tip, index) => (
                  <li key={index} className={styles.tipItem}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ImageGenerator 组件
interface ImageGeneratorProps {
  onGenerate: (prompt: string, model?: string) => void;
  results?: ImageGenerationResult[];
  loading?: boolean;
  className?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onGenerate,
  results = [],
  loading = false,
  className = "",
}) => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("dall-e-3");

  const models = [
    { value: "dall-e-3", label: "DALL-E 3", color: "primary" as const },
    { value: "midjourney", label: "Midjourney", color: "primary" as const },
    {
      value: "stable-diffusion",
      label: "Stable Diffusion",
      color: "primary" as const,
    },
  ];

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      showToast("请输入生成描述");
      return;
    }

    onGenerate(prompt.trim(), selectedModel);
  }, [prompt, selectedModel, onGenerate]);

  return (
    <div className={`${styles.imageGenerator} ${className}`}>
      <div className={styles.generatorHeader}>
        <h2 className={styles.generatorTitle}>AI 图像生成</h2>
        <p className={styles.generatorDesc}>
          输入描述，AI将为您生成精美的植物相关图像
        </p>
      </div>

      <div className={styles.generatorForm}>
        <div className={styles.modelSelector}>
          {models.map((model) => (
            <CustomButton
              key={model.value}
              size="small"
              type={selectedModel === model.value ? model.color : "default"}
              onClick={() => setSelectedModel(model.value)}
              className={styles.modelButton}
            >
              {model.label}
            </CustomButton>
          ))}
        </div>

        <div className={styles.promptInput}>
          <Input
            value={prompt}
            onChange={setPrompt}
            placeholder="描述您想要生成的图像，例如：一只可爱的小猫在花园里玩耍"
            className={styles.promptField}
          />
          <CustomButton
            type="primary"
            onClick={handleGenerate}
            loading={loading}
            disabled={!prompt.trim()}
            className={styles.generateButton}
          >
            <PhotoO />
            生成图像
          </CustomButton>
        </div>
      </div>

      {results.length > 0 && (
        <div className={styles.generationResults}>
          <h3 className={styles.resultsTitle}>生成结果</h3>
          <div className={styles.resultsGrid}>
            {results.map((result, index) => (
              <div key={index} className={styles.resultCard}>
                <Image
                  src={result.imageUrl}
                  width="100%"
                  height="200px"
                  fit="cover"
                  radius={8}
                />
                <div className={styles.resultInfo}>
                  <p className={styles.resultPrompt}>{result.prompt}</p>
                  <div className={styles.resultMeta}>
                    <span className={styles.resultModel}>{result.model}</span>
                    <span className={styles.resultTime}>
                      {result.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// PlantDiagnosis 组件
interface PlantDiagnosisProps {
  onDiagnose: (image: File, symptoms: string) => void;
  result?: {
    diagnosis: string;
    severity: "low" | "medium" | "high";
    solutions: string[];
    prevention: string[];
  };
  loading?: boolean;
  className?: string;
}

export const PlantDiagnosis: React.FC<PlantDiagnosisProps> = ({
  onDiagnose,
  result,
  loading = false,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [symptoms, setSymptoms] = useState("");

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDiagnose = useCallback(() => {
    if (!selectedImage) {
      showToast("请选择植物图片");
      return;
    }
    if (!symptoms.trim()) {
      showToast("请描述症状");
      return;
    }

    onDiagnose(selectedImage, symptoms.trim());
  }, [selectedImage, symptoms, onDiagnose]);

  const severityColor = useMemo(() => {
    if (!result) return "primary";
    switch (result.severity) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      default:
        return "primary";
    }
  }, [result]);

  const severityText = useMemo(() => {
    if (!result) return "";
    switch (result.severity) {
      case "low":
        return "轻微";
      case "medium":
        return "中等";
      case "high":
        return "严重";
      default:
        return "未知";
    }
  }, [result]);

  return (
    <div className={`${styles.plantDiagnosis} ${className}`}>
      <div className={styles.diagnosisHeader}>
        <h2 className={styles.diagnosisTitle}>植物诊断</h2>
        <p className={styles.diagnosisDesc}>
          上传植物图片并描述症状，AI将为您诊断问题并提供解决方案
        </p>
      </div>

      <div className={styles.diagnosisForm}>
        <div className={styles.imageSection}>
          <h3 className={styles.sectionTitle}>上传植物图片</h3>
          {previewUrl ? (
            <div className={styles.previewContainer}>
              <Image
                src={previewUrl}
                width="100%"
                height="200px"
                fit="cover"
                radius={8}
              />
              <CustomButton
                size="small"
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl("");
                }}
                className={styles.resetButton}
              >
                重新选择
              </CustomButton>
            </div>
          ) : (
            <div className={styles.uploadArea}>
              <div className={styles.uploadPlaceholder}>
                <PhotoO />
                <span>点击上传植物图片</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(file);
                }}
                className={styles.fileInput}
              />
            </div>
          )}
        </div>

        <div className={styles.symptomsSection}>
          <h3 className={styles.sectionTitle}>描述症状</h3>
          <Input
            value={symptoms}
            onChange={setSymptoms}
            placeholder="请详细描述植物的症状，例如：叶子发黄、有斑点、枯萎等"
            className={styles.symptomsInput}
          />
        </div>

        <CustomButton
          type="primary"
          onClick={handleDiagnose}
          loading={loading}
          disabled={!selectedImage || !symptoms.trim()}
          className={styles.diagnoseButton}
        >
          开始诊断
        </CustomButton>
      </div>

      {result && (
        <div className={styles.diagnosisResult}>
          <h3 className={styles.resultTitle}>诊断结果</h3>
          <div className={styles.resultCard}>
            <div className={styles.diagnosisInfo}>
              <h4 className={styles.diagnosisText}>{result.diagnosis}</h4>
              <Tag type={severityColor}>严重程度: {severityText}</Tag>
            </div>

            {result.solutions.length > 0 && (
              <div className={styles.solutions}>
                <h5 className={styles.solutionsTitle}>解决方案</h5>
                <ul className={styles.solutionsList}>
                  {result.solutions.map((solution, index) => (
                    <li key={index} className={styles.solutionItem}>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.prevention.length > 0 && (
              <div className={styles.prevention}>
                <h5 className={styles.preventionTitle}>预防措施</h5>
                <ul className={styles.preventionList}>
                  {result.prevention.map((item, index) => (
                    <li key={index} className={styles.preventionItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
