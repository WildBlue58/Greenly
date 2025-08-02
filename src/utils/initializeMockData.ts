// 初始化模拟数据的工具函数
import type { CareTask, Plant } from '../store/types';

export const initializeMockCareData = () => {
  // 检查是否已经有数据
  const existingTasks = localStorage.getItem('careTasks');
  const existingPlants = localStorage.getItem('plants');
  
  if (existingTasks && existingPlants) {
    return; // 如果已有数据，不覆盖
  }

  // 模拟植物数据
  const mockPlants: Plant[] = [
    {
      id: '1',
      name: '绿萝',
      species: '绿萝',
      location: '客厅',
      wateringFrequency: 3,
      description: '喜欢散射光，保持土壤微湿',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
      careLevel: 'easy',
      lightNeeds: 'medium',
      waterNeeds: 'medium',
      temperature: {
        min: 15,
        max: 30
      },
      humidity: 60,
      careTips: ['保持土壤微湿', '避免阳光直射', '定期清洁叶片'],
      status: 'healthy',
      health: 'good',
      lastWatered: '2024-01-14T10:30:00Z',
      nextWatering: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: '娃娃菜',
      species: '多肉植物',
      location: '阳台',
      wateringFrequency: 7,
      description: '耐旱多肉，少量浇水',
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
      careLevel: 'easy',
      lightNeeds: 'high',
      waterNeeds: 'low',
      temperature: {
        min: 10,
        max: 35
      },
      humidity: 40,
      careTips: ['少量浇水', '充足光照', '通风良好'],
      status: 'healthy',
      health: 'excellent',
      lastWatered: '2024-01-12T14:00:00Z',
      nextWatering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2024-01-12T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  // 模拟养护任务数据
  const mockCareTasks: CareTask[] = [
    // 绿萝的任务
    {
      id: '1',
      plantId: '1',
      plantName: '绿萝',
      type: 'water',
      title: '给绿萝浇水',
      description: '检查土壤湿度，适量浇水',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 明天
      completed: false,
      priority: 'medium',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      plantId: '1',
      plantName: '绿萝',
      type: 'fertilize',
      title: '给绿萝施肥',
      description: '使用稀释的液体肥料',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 一周后
      completed: false,
      priority: 'low',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      plantId: '1',
      plantName: '绿萝',
      type: 'water',
      title: '给绿萝浇水',
      description: '上次浇水记录',
      dueDate: '2024-01-14T10:00:00Z',
      completed: true,
      completedAt: '2024-01-14T10:30:00Z',
      priority: 'medium',
      createdAt: '2024-01-12T10:00:00Z'
    },
    {
      id: '4',
      plantId: '1',
      plantName: '绿萝',
      type: 'prune',
      title: '修剪绿萝',
      description: '修剪老叶和枯叶',
      dueDate: '2024-01-13T10:00:00Z',
      completed: true,
      completedAt: '2024-01-13T11:00:00Z',
      priority: 'low',
      createdAt: '2024-01-10T10:00:00Z'
    },
    // 娃娃菜的任务
    {
      id: '5',
      plantId: '2',
      plantName: '娃娃菜',
      type: 'water',
      title: '给娃娃菜浇水',
      description: '少量浇水，避免积水',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 三天后
      completed: false,
      priority: 'low',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '6',
      plantId: '2',
      plantName: '娃娃菜',
      type: 'water',
      title: '给娃娃菜浇水',
      description: '上次浇水记录',
      dueDate: '2024-01-12T10:00:00Z',
      completed: true,
      completedAt: '2024-01-12T14:00:00Z',
      priority: 'low',
      createdAt: '2024-01-10T10:00:00Z'
    }
  ];

  // 保存到localStorage
  localStorage.setItem('plants', JSON.stringify(mockPlants));
  localStorage.setItem('careTasks', JSON.stringify(mockCareTasks));
  localStorage.setItem('careRecords', JSON.stringify([]));
  localStorage.setItem('carePlans', JSON.stringify([]));
  
  console.log('初始化模拟数据完成');
};

// 重置数据函数（用于测试）
export const resetMockData = () => {
  localStorage.removeItem('plants');
  localStorage.removeItem('careTasks');
  localStorage.removeItem('careRecords');
  localStorage.removeItem('carePlans');
  console.log('清除模拟数据完成');
};