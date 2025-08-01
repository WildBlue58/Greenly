import type { CarePlan, CareTask, CareRecord, PaginatedResponse } from '../src/store/types';

// 模拟养护计划数据
export const mockCarePlans: CarePlan[] = [
  {
    id: '1',
    plantId: '1',
    plantName: '绿萝',
    tasks: [
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
        plantId: '1',
        plantName: '绿萝',
        type: 'fertilize',
        title: '给绿萝施肥',
        description: '使用稀释的液体肥料',
        dueDate: '2024-01-25T10:30:00Z',
        completed: false,
        priority: 'low',
        createdAt: '2024-01-15T10:30:00Z',
      },
    ],
    nextTask: {
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
    progress: 0,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    plantId: '2',
    plantName: '多肉植物',
    tasks: [
      {
        id: '3',
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
    ],
    nextTask: {
      id: '3',
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
    progress: 0,
    createdAt: '2024-01-10T14:20:00Z',
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
  {
    id: '5',
    plantId: '1',
    plantName: '绿萝',
    type: 'water',
    title: '给绿萝浇水',
    description: '检查土壤湿度，适量浇水',
    dueDate: '2024-01-15T10:30:00Z',
    completed: true,
    completedAt: '2024-01-15T10:30:00Z',
    priority: 'medium',
    createdAt: '2024-01-12T10:30:00Z',
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
  {
    id: '4',
    plantId: '4',
    plantName: '发财树',
    type: 'prune',
    title: '修剪记录',
    description: '修剪过长的新枝',
    completedAt: '2024-01-12T16:45:00Z',
    notes: '修剪后生长更旺盛',
    images: ['https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400'],
  },
];

// 模拟养护统计数据
export const mockCareStats = {
  totalTasks: 12,
  completedTasks: 8,
  overdueTasks: 2,
  completionRate: 66.7,
  averageCompletionTime: 2.5,
  taskTypeDistribution: [
    { type: 'water', count: 6, percentage: 50 },
    { type: 'fertilize', count: 3, percentage: 25 },
    { type: 'prune', count: 2, percentage: 16.7 },
    { type: 'repot', count: 1, percentage: 8.3 },
  ],
};

// 模拟养护趋势数据
export const mockCareTrend = {
  dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
  completedTasks: [2, 3, 1, 4, 2],
  totalTasks: [5, 6, 4, 7, 5],
};

// 模拟养护提醒数据
export const mockCareReminders = {
  reminders: [
    {
      id: '1',
      taskId: '1',
      plantId: '1',
      plantName: '绿萝',
      taskTitle: '给绿萝浇水',
      dueDate: '2024-01-18T10:30:00Z',
      isOverdue: false,
      priority: 'medium',
    },
    {
      id: '2',
      taskId: '2',
      plantId: '2',
      plantName: '多肉植物',
      taskTitle: '给多肉植物浇水',
      dueDate: '2024-01-20T14:20:00Z',
      isOverdue: false,
      priority: 'low',
    },
    {
      id: '3',
      taskId: '3',
      plantId: '3',
      plantName: '君子兰',
      taskTitle: '给君子兰施肥',
      dueDate: '2024-01-16T09:15:00Z',
      isOverdue: false,
      priority: 'high',
    },
  ],
};

// 模拟养护模板数据
export const mockCareTemplates = {
  templates: [
    {
      id: '1',
      name: '绿萝养护模板',
      description: '适合绿萝的日常养护计划',
      plantType: '绿萝',
      tasks: [
        {
          id: '1',
          plantId: '',
          plantName: '绿萝',
          type: 'water',
          title: '浇水',
          description: '每周浇水2-3次',
          dueDate: '',
          completed: false,
          priority: 'medium',
          createdAt: '',
        },
        {
          id: '2',
          plantId: '',
          plantName: '绿萝',
          type: 'fertilize',
          title: '施肥',
          description: '每月施肥1次',
          dueDate: '',
          completed: false,
          priority: 'low',
          createdAt: '',
        },
      ],
    },
    {
      id: '2',
      name: '多肉植物养护模板',
      description: '适合多肉植物的养护计划',
      plantType: '多肉植物',
      tasks: [
        {
          id: '3',
          plantId: '',
          plantName: '多肉植物',
          type: 'water',
          title: '浇水',
          description: '每两周浇水1次',
          dueDate: '',
          completed: false,
          priority: 'low',
          createdAt: '',
        },
      ],
    },
  ],
  total: 2,
};

// 模拟今日任务
export const mockTodayTasks: CareTask[] = [
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
];

// 模拟逾期任务
export const mockOverdueTasks: CareTask[] = [
  {
    id: '4',
    plantId: '4',
    plantName: '发财树',
    type: 'prune',
    title: '修剪发财树',
    description: '修剪过长的新枝',
    dueDate: '2024-01-10T16:45:00Z',
    completed: false,
    priority: 'medium',
    createdAt: '2024-01-05T16:45:00Z',
  },
];

// 模拟即将到期的任务
export const mockUpcomingTasks: CareTask[] = [
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
];

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
