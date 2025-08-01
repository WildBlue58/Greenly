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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// 植物相关类型
export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  health: "excellent" | "good" | "fair" | "poor";
  status: "healthy" | "needs_care" | "sick";
  lastWatered: string;
  nextWatering: string;
  location: string;
  notes?: string;
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

export interface PlantRecognitionResult {
  plantName: string;
  species: string;
  confidence: number;
  careTips: string[];
  image: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: Date;
}

// 通知类型
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 