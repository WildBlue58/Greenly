import type { Plant, CareTask, CareRecord, PaginatedResponse } from '../src/store/types';

// 模拟植物数据
export const mockPlants: Plant[] = [
  {
    id: '1',
    name: '绿萝',
    species: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
    health: 'excellent',
    status: 'healthy',
    lastWatered: '2024-01-15T10:30:00Z',
    nextWatering: '2024-01-18T10:30:00Z',
    location: '客厅',
    notes: '生长良好，叶子翠绿',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '多肉植物',
    species: 'Echeveria elegans',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
    health: 'good',
    status: 'needs_care',
    lastWatered: '2024-01-10T14:20:00Z',
    nextWatering: '2024-01-20T14:20:00Z',
    location: '阳台',
    notes: '需要适量浇水，避免积水',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    name: '君子兰',
    species: 'Clivia miniata',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400',
    health: 'fair',
    status: 'sick',
    lastWatered: '2024-01-08T09:15:00Z',
    nextWatering: '2024-01-16T09:15:00Z',
    location: '书房',
    notes: '叶子有些发黄，需要检查土壤湿度',
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
  },
  {
    id: '4',
    name: '发财树',
    species: 'Pachira aquatica',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400',
    health: 'excellent',
    status: 'healthy',
    lastWatered: '2024-01-12T16:45:00Z',
    nextWatering: '2024-01-19T16:45:00Z',
    location: '办公室',
    notes: '生长旺盛，定期修剪',
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    name: '芦荟',
    species: 'Aloe vera',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
    health: 'good',
    status: 'healthy',
    lastWatered: '2024-01-14T11:30:00Z',
    nextWatering: '2024-01-21T11:30:00Z',
    location: '卧室',
    notes: '耐旱植物，控制浇水量',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
  },
];

// 模拟养护任务数据
export const mockCareTasks: CareTask[] = [
  {
    id: '1',
    plantId: '1',
    plantName: '绿萝',
    type: 'water',
    title: '给绿萝浇水',
    description: '检查土壤湿度，适量浇水',
    dueDate: '2024-01-18T10:30:00Z',
    completed: false,
    priority: 'medium',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    plantId: '2',
    plantName: '多肉植物',
    type: 'water',
    title: '给多肉植物浇水',
    description: '少量浇水，避免积水',
    dueDate: '2024-01-20T14:20:00Z',
    completed: false,
    priority: 'low',
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    plantId: '3',
    plantName: '君子兰',
    type: 'fertilize',
    title: '给君子兰施肥',
    description: '使用稀释的液体肥料',
    dueDate: '2024-01-16T09:15:00Z',
    completed: false,
    priority: 'high',
    createdAt: '2024-01-08T09:15:00Z',
  },
  {
    id: '4',
    plantId: '4',
    plantName: '发财树',
    type: 'prune',
    title: '修剪发财树',
    description: '修剪过长的新枝',
    dueDate: '2024-01-25T16:45:00Z',
    completed: false,
    priority: 'medium',
    createdAt: '2024-01-12T16:45:00Z',
  },
];

// 模拟养护记录数据
export const mockCareRecords: CareRecord[] = [
  {
    id: '1',
    plantId: '1',
    plantName: '绿萝',
    type: 'water',
    title: '浇水记录',
    description: '土壤微干，适量浇水',
    completedAt: '2024-01-15T10:30:00Z',
    notes: '生长良好，叶子翠绿',
    images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400'],
  },
  {
    id: '2',
    plantId: '2',
    plantName: '多肉植物',
    type: 'water',
    title: '浇水记录',
    description: '少量浇水，土壤微湿',
    completedAt: '2024-01-10T14:20:00Z',
    notes: '避免积水，保持通风',
    images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400'],
  },
  {
    id: '3',
    plantId: '3',
    plantName: '君子兰',
    type: 'water',
    title: '浇水记录',
    description: '检查土壤湿度后浇水',
    completedAt: '2024-01-08T09:15:00Z',
    notes: '叶子有些发黄，需要关注',
    images: ['https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400'],
  },
];

// 模拟植物统计数据
export const mockPlantStats = {
  totalPlants: 5,
  healthyPlants: 3,
  needsCarePlants: 1,
  sickPlants: 1,
  averageHealth: 75,
};

// 模拟植物健康趋势数据
export const mockHealthTrend = {
  dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
  healthScores: [80, 82, 85, 83, 87],
};

// 模拟浇水历史数据
export const mockWateringHistory = {
  waterings: [
    {
      id: '1',
      amount: 200,
      notes: '土壤微干，适量浇水',
      wateredAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      amount: 150,
      notes: '少量浇水，避免积水',
      wateredAt: '2024-01-10T14:20:00Z',
    },
    {
      id: '3',
      amount: 180,
      notes: '检查土壤湿度后浇水',
      wateredAt: '2024-01-08T09:15:00Z',
    },
  ],
  total: 3,
};

// 模拟植物种类数据
export const mockPlantSpecies = {
  species: [
    { name: '绿萝', count: 1 },
    { name: '多肉植物', count: 1 },
    { name: '君子兰', count: 1 },
    { name: '发财树', count: 1 },
    { name: '芦荟', count: 1 },
  ],
};

// 模拟植物位置数据
export const mockPlantLocations = {
  locations: [
    { name: '客厅', count: 1 },
    { name: '阳台', count: 1 },
    { name: '书房', count: 1 },
    { name: '办公室', count: 1 },
    { name: '卧室', count: 1 },
  ],
};

// 模拟植物提醒数据
export const mockPlantReminders = {
  reminders: [
    {
      id: '1',
      plantId: '1',
      plantName: '绿萝',
      type: 'water',
      dueDate: '2024-01-18T10:30:00Z',
      isOverdue: false,
    },
    {
      id: '2',
      plantId: '2',
      plantName: '多肉植物',
      type: 'water',
      dueDate: '2024-01-20T14:20:00Z',
      isOverdue: false,
    },
    {
      id: '3',
      plantId: '3',
      plantName: '君子兰',
      type: 'fertilize',
      dueDate: '2024-01-16T09:15:00Z',
      isOverdue: false,
    },
  ],
};

// 模拟API响应
export const createMockResponse = <T>(data: T, success = true, message = '') => ({
  success,
  data,
  message,
});

export const createMockPaginatedResponse = <T>(
  data: T[],
  page = 1,
  pageSize = 10,
  total = data.length
): PaginatedResponse<T> => ({
  data,
  total,
  page,
  pageSize,
  totalPages: Math.ceil(total / pageSize),
});

// 模拟延迟
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));
