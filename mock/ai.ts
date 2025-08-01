import type { ChatMessage, PlantRecognitionResult, ImageGenerationResult } from '../src/store/types';

// 模拟聊天消息数据
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: '你好，我想了解一下如何养护绿萝',
    role: 'user',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    model: 'gpt-3.5-turbo',
  },
  {
    id: '2',
    content: '你好！绿萝是一种非常适合室内养护的植物。以下是养护要点：\n\n1. **光照**：绿萝喜欢散射光，避免阳光直射\n2. **浇水**：保持土壤微湿，不要积水\n3. **温度**：适宜温度18-25℃\n4. **施肥**：每月施一次稀释的液体肥料\n5. **修剪**：定期修剪过长的新枝\n\n有什么具体问题吗？',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:30:05Z'),
    model: 'gpt-3.5-turbo',
  },
  {
    id: '3',
    content: '我的绿萝叶子有些发黄，这是什么原因？',
    role: 'user',
    timestamp: new Date('2024-01-15T10:32:00Z'),
    model: 'gpt-3.5-turbo',
  },
  {
    id: '4',
    content: '绿萝叶子发黄可能有以下几个原因：\n\n1. **浇水过多**：导致根部腐烂，叶子发黄\n2. **光照不足**：长期处于阴暗环境\n3. **营养不足**：缺乏必要的养分\n4. **温度过低**：低于10℃会影响生长\n\n建议检查土壤湿度，适当减少浇水频率，并确保有足够的光照。',
    role: 'assistant',
    timestamp: new Date('2024-01-15T10:32:05Z'),
    model: 'gpt-3.5-turbo',
  },
];

// 模拟聊天历史数据
export const mockChatHistory = {
  messages: mockChatMessages,
  total: 4,
};

// 模拟聊天模型数据
export const mockChatModels = {
  models: [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: '适合一般对话和问答',
      maxTokens: 4096,
      supportsStreaming: true,
      pricing: {
        input: 0.0015,
        output: 0.002,
      },
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: '更强大的推理能力',
      maxTokens: 8192,
      supportsStreaming: true,
      pricing: {
        input: 0.03,
        output: 0.06,
      },
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: '适合复杂任务',
      maxTokens: 200000,
      supportsStreaming: true,
      pricing: {
        input: 0.003,
        output: 0.015,
      },
    },
  ],
};

// 模拟植物识别结果
export const mockPlantRecognitionResult: PlantRecognitionResult = {
  plantName: '绿萝',
  species: 'Epipremnum aureum',
  confidence: 0.95,
  careTips: [
    '喜欢散射光，避免阳光直射',
    '保持土壤微湿，不要积水',
    '适宜温度18-25℃',
    '每月施一次稀释的液体肥料',
    '定期修剪过长的新枝',
  ],
  image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
};

// 模拟批量植物识别结果
export const mockBatchPlantRecognitionResults: PlantRecognitionResult[] = [
  mockPlantRecognitionResult,
  {
    plantName: '多肉植物',
    species: 'Echeveria elegans',
    confidence: 0.88,
    careTips: [
      '喜欢充足的光照',
      '控制浇水量，避免积水',
      '适宜温度15-25℃',
      '使用疏松透气的土壤',
      '冬季减少浇水频率',
    ],
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
  },
];

// 模拟识别历史数据
export const mockRecognitionHistory = {
  recognitions: [
    {
      id: '1',
      plantName: '绿萝',
      species: 'Epipremnum aureum',
      confidence: 0.95,
      careTips: [
        '喜欢散射光，避免阳光直射',
        '保持土壤微湿，不要积水',
        '适宜温度18-25℃',
        '每月施一次稀释的液体肥料',
        '定期修剪过长的新枝',
      ],
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      plantName: '多肉植物',
      species: 'Echeveria elegans',
      confidence: 0.88,
      careTips: [
        '喜欢充足的光照',
        '控制浇水量，避免积水',
        '适宜温度15-25℃',
        '使用疏松透气的土壤',
        '冬季减少浇水频率',
      ],
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
      createdAt: '2024-01-14T14:20:00Z',
    },
  ],
  total: 2,
};

// 模拟植物信息数据
export const mockPlantInfo = {
  name: '绿萝',
  scientificName: 'Epipremnum aureum',
  family: '天南星科',
  description: '绿萝是一种常见的室内观叶植物，具有净化空气的作用，适合新手养护。',
  careInstructions: {
    watering: '保持土壤微湿，避免积水，夏季可适当增加浇水频率',
    sunlight: '喜欢散射光，避免阳光直射，可放在室内明亮处',
    temperature: '适宜温度18-25℃，冬季不低于10℃',
    soil: '使用疏松透气的营养土，可添加珍珠岩或蛭石',
    fertilizer: '每月施一次稀释的液体肥料，冬季可减少施肥',
  },
  commonProblems: [
    {
      issue: '叶子发黄',
      symptoms: '叶子逐渐变黄，可能从叶尖开始',
      solution: '检查浇水频率，减少浇水，确保排水良好',
    },
    {
      issue: '叶子枯萎',
      symptoms: '叶子软塌，失去光泽',
      solution: '增加浇水频率，检查土壤湿度',
    },
    {
      issue: '生长缓慢',
      symptoms: '新叶生长缓慢，植株整体不旺盛',
      solution: '增加光照，适当施肥，检查温度',
    },
  ],
};

// 模拟图片生成结果
export const mockImageGenerationResult: ImageGenerationResult = {
  imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
  prompt: '一盆健康的绿萝，叶子翠绿，放在室内窗台上',
  model: 'dall-e-3',
  createdAt: new Date('2024-01-15T10:30:00Z'),
};

// 模拟批量图片生成结果
export const mockBatchImageGenerationResults: ImageGenerationResult[] = [
  mockImageGenerationResult,
  {
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
    prompt: '一盆多肉植物，叶片饱满，颜色鲜艳',
    model: 'dall-e-3',
    createdAt: new Date('2024-01-15T10:35:00Z'),
  },
];

// 模拟图片生成历史数据
export const mockGenerationHistory = {
  generations: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
      prompt: '一盆健康的绿萝，叶子翠绿，放在室内窗台上',
      model: 'dall-e-3',
      createdAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
      prompt: '一盆多肉植物，叶片饱满，颜色鲜艳',
      model: 'dall-e-3',
      createdAt: new Date('2024-01-14T14:20:00Z'),
    },
  ],
  total: 2,
};

// 模拟图片生成模型数据
export const mockImageModels = {
  models: [
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      description: '高质量的图片生成模型',
      supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
      pricing: {
        perImage: 0.04,
      },
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: '艺术风格的图片生成',
      supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
      pricing: {
        perImage: 0.08,
      },
    },
  ],
};

// 模拟植物诊断结果
export const mockPlantDiagnosisResult = {
  diagnosis: '叶子发黄可能是由于浇水过多导致的根部问题',
  confidence: 0.85,
  possibleIssues: [
    {
      issue: '浇水过多',
      probability: 0.85,
      symptoms: ['叶子发黄', '根部腐烂', '土壤过湿'],
      solutions: ['减少浇水频率', '改善排水', '检查根部'],
    },
    {
      issue: '光照不足',
      probability: 0.65,
      symptoms: ['叶子发黄', '生长缓慢', '茎部细长'],
      solutions: ['增加光照', '移动到明亮处', '避免阳光直射'],
    },
    {
      issue: '营养不足',
      probability: 0.45,
      symptoms: ['叶子发黄', '生长缓慢', '新叶变小'],
      solutions: ['适当施肥', '更换营养土', '定期补充养分'],
    },
  ],
  recommendations: [
    '立即减少浇水频率',
    '检查土壤排水情况',
    '将植物移到通风良好的地方',
    '观察一周后再次评估',
  ],
  followUpActions: [
    '每天检查土壤湿度',
    '记录叶子颜色变化',
    '一周后重新拍照诊断',
    '如有恶化及时咨询专家',
  ],
};

// 模拟诊断历史数据
export const mockDiagnosisHistory = {
  diagnoses: [
    {
      id: '1',
      plantId: '1',
      plantName: '绿萝',
      diagnosis: '叶子发黄可能是由于浇水过多导致的根部问题',
      confidence: 0.85,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      plantId: '2',
      plantName: '多肉植物',
      diagnosis: '叶片萎缩可能是由于缺水导致的',
      confidence: 0.78,
      createdAt: '2024-01-14T14:20:00Z',
    },
  ],
  total: 2,
};

// 模拟常见植物问题数据
export const mockCommonPlantIssues = {
  issues: [
    {
      name: '叶子发黄',
      description: '植物叶子逐渐变黄，可能从叶尖开始',
      symptoms: ['叶子变黄', '生长缓慢', '可能伴随枯萎'],
      causes: ['浇水过多', '光照不足', '营养不足', '温度过低'],
      solutions: ['调整浇水频率', '增加光照', '适当施肥', '控制温度'],
      prevention: ['定期检查土壤湿度', '确保充足光照', '定期施肥', '保持适宜温度'],
    },
    {
      name: '根部腐烂',
      description: '植物根部变黑腐烂，影响水分吸收',
      symptoms: ['叶子发黄', '植株萎蔫', '根部变黑', '土壤有异味'],
      causes: ['浇水过多', '排水不良', '土壤过湿', '温度过低'],
      solutions: ['减少浇水', '改善排水', '更换土壤', '修剪烂根'],
      prevention: ['控制浇水量', '使用疏松土壤', '确保排水孔通畅', '避免积水'],
    },
    {
      name: '病虫害',
      description: '植物受到害虫或病菌侵害',
      symptoms: ['叶子有斑点', '植株萎蔫', '可见害虫', '叶子变形'],
      causes: ['通风不良', '湿度过高', '植株过密', '土壤带菌'],
      solutions: ['隔离病株', '使用杀虫剂', '改善通风', '更换土壤'],
      prevention: ['保持通风', '控制湿度', '定期检查', '使用干净土壤'],
    },
  ],
};

// 模拟AI工作流数据
export const mockWorkflows = {
  workflows: [
    {
      id: 'plant-care-advisor',
      name: '植物养护顾问',
      description: '根据植物照片和症状提供养护建议',
      category: 'care',
      inputs: [
        {
          name: 'plantImage',
          type: 'image',
          required: true,
          description: '植物照片',
        },
        {
          name: 'symptoms',
          type: 'text',
          required: false,
          description: '症状描述',
        },
      ],
      outputs: [
        {
          name: 'diagnosis',
          type: 'text',
          description: '诊断结果',
        },
        {
          name: 'recommendations',
          type: 'array',
          description: '养护建议',
        },
      ],
    },
    {
      id: 'care-plan-generator',
      name: '养护计划生成器',
      description: '根据植物类型生成个性化养护计划',
      category: 'planning',
      inputs: [
        {
          name: 'plantType',
          type: 'text',
          required: true,
          description: '植物类型',
        },
        {
          name: 'careLevel',
          type: 'select',
          required: false,
          description: '养护难度',
        },
      ],
      outputs: [
        {
          name: 'carePlan',
          type: 'object',
          description: '养护计划',
        },
        {
          name: 'reminders',
          type: 'array',
          description: '提醒设置',
        },
      ],
    },
  ],
};

// 模拟AI设置数据
export const mockAISettings = {
  defaultChatModel: 'gpt-3.5-turbo',
  defaultImageModel: 'dall-e-3',
  maxTokens: 4096,
  temperature: 0.7,
  enableStreaming: true,
  autoSaveHistory: true,
  costLimit: 100,
};

// 模拟AI使用统计数据
export const mockAIUsageStats = {
  totalRequests: 150,
  totalCost: 25.50,
  requestsByModel: {
    'gpt-3.5-turbo': 100,
    'gpt-4': 30,
    'dall-e-3': 20,
  },
  costByModel: {
    'gpt-3.5-turbo': 15.00,
    'gpt-4': 8.50,
    'dall-e-3': 2.00,
  },
  dailyUsage: [
    { date: '2024-01-15', requests: 12, cost: 2.10 },
    { date: '2024-01-14', requests: 8, cost: 1.50 },
    { date: '2024-01-13', requests: 15, cost: 3.20 },
    { date: '2024-01-12', requests: 10, cost: 1.80 },
    { date: '2024-01-11', requests: 6, cost: 1.20 },
  ],
};

// 模拟API响应
export const createMockResponse = <T>(data: T, success = true, message = '') => ({
  success,
  data,
  message,
});

// 模拟延迟
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟流式聊天响应
export const mockStreamChatResponse = (message: string, onMessage: (chunk: string) => void) => {
  const words = message.split(' ');
  let index = 0;
  
  const interval = setInterval(() => {
    if (index < words.length) {
      onMessage(words[index] + ' ');
      index++;
    } else {
      clearInterval(interval);
    }
  }, 100);
};
