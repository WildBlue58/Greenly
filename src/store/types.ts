// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// 植物相关类型
export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  health: "excellent" | "good" | "fair" | "poor" | "warning";
  status: "healthy" | "needs_care" | "sick";
  lastWatered: string;
  nextWatering: string;
  location: string;
  wateringFrequency: number; // 浇水频率（天数）
  notes?: string;
  description?: string; // 植物描述

  // 养护信息
  careLevel?: "easy" | "medium" | "hard"; // 养护难度
  lightNeeds?: "low" | "medium" | "high"; // 光照需求
  waterNeeds?: "low" | "medium" | "high"; // 浇水需求
  temperature?: {
    min: number;
    max: number;
  }; // 适宜温度范围
  humidity?: number; // 湿度要求（百分比）
  careTips?: string[]; // 养护技巧

  createdAt: string;
  updatedAt: string;
}

// 养护相关类型
export interface CareTask {
  id: string;
  plantId: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "repot" | "other";
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export interface CarePlan {
  id: string;
  plantId: string;
  plantName: string;
  tasks: CareTask[];
  nextTask?: CareTask;
  progress: number;
  createdAt: string;
}

export interface CareRecord {
  id: string;
  plantId: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "repot" | "other";
  title: string;
  description: string;
  completedAt: string;
  notes?: string;
  images?: string[];
}

// AI相关类型
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
}
