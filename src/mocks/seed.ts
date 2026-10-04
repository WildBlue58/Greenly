import type {
  User,
  Plant,
  CarePlan,
  CareRecord,
  CareTask,
} from "../store/types";

/**
 * 应用种子数据（首次运行时的演示数据）
 *
 * 作为 store 的初始状态存在：localStorage 中没有持久化数据时
 * 用户看到的就是这份数据；一旦用户产生自己的数据，persist 中间件
 * 会整体覆盖，种子数据不会再被写入（只初始化、不覆盖）。
 */

const DAY = 24 * 60 * 60 * 1000;

export const seedUser: User = {
  id: "user-1",
  name: "植物爱好者",
  email: "user@example.com",
  avatar: "",
  phone: "13800138000",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

export const seedPlants: Plant[] = [
  {
    id: "plant-1",
    name: "绿萝",
    species: "绿萝属",
    image:
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
    status: "healthy",
    health: "good",
    location: "客厅",
    wateringFrequency: 7,
    lastWatered: new Date(Date.now() - 2 * DAY).toISOString(),
    nextWatering: new Date(Date.now() + 5 * DAY).toISOString(),
    notes: "生长良好，叶子翠绿",
    description:
      "绿萝是一种常见的室内观叶植物，具有较强的净化空气能力，易于养护，适合新手种植。",
    careLevel: "easy",
    lightNeeds: "medium",
    waterNeeds: "medium",
    temperature: { min: 15, max: 30 },
    humidity: 60,
    careTips: [
      "保持土壤适度湿润",
      "提供散射光照射",
      "定期擦拭叶片保持清洁",
      "春秋季节可适当施肥",
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "plant-2",
    name: "多肉植物",
    species: "景天科",
    image:
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop",
    status: "needs_care",
    health: "warning",
    location: "阳台",
    wateringFrequency: 14,
    lastWatered: new Date(Date.now() - 10 * DAY).toISOString(),
    nextWatering: new Date(Date.now() + 4 * DAY).toISOString(),
    notes: "需要浇水，叶子有些干瘪",
    description:
      "多肉植物具有厚实的叶片和茎部，能够储存水分，耐旱性强，喜欢阳光充足的环境。",
    careLevel: "easy",
    lightNeeds: "high",
    waterNeeds: "low",
    temperature: { min: 10, max: 35 },
    humidity: 40,
    careTips: [
      "避免积水，宁干勿湿",
      "提供充足的阳光照射",
      "注意冬季保温",
      "使用排水良好的土壤",
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "plant-3",
    name: "君子兰",
    species: "石蒜科",
    image:
      "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=400&fit=crop",
    status: "healthy",
    health: "good",
    location: "书房",
    wateringFrequency: 5,
    lastWatered: new Date(Date.now() - 3 * DAY).toISOString(),
    nextWatering: new Date(Date.now() + 2 * DAY).toISOString(),
    notes: "开花期，需要适当施肥",
    description:
      "君子兰是著名的观花植物，花朵艳丽，叶片挺拔，具有很高的观赏价值，需要细心养护。",
    careLevel: "medium",
    lightNeeds: "medium",
    waterNeeds: "medium",
    temperature: { min: 18, max: 25 },
    humidity: 70,
    careTips: [
      "保持适宜的温度和湿度",
      "避免阳光直射",
      "花期适当增加施肥",
      "定期转动花盆保持株型美观",
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const seedCareTasks: CareTask[] = [
  {
    id: "task-1",
    plantId: "plant-2",
    plantName: "多肉植物",
    type: "water",
    title: "给多肉浇水",
    description: "叶子有些干瘪，需要补充水分",
    dueDate: new Date(Date.now() - 1 * DAY).toISOString(),
    completed: false,
    priority: "high",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "task-2",
    plantId: "plant-3",
    plantName: "君子兰",
    type: "fertilize",
    title: "君子兰花期施肥",
    description: "开花期适当增加施肥",
    dueDate: new Date(Date.now() + 1 * DAY).toISOString(),
    completed: false,
    priority: "medium",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "task-3",
    plantId: "plant-1",
    plantName: "绿萝",
    type: "prune",
    title: "修剪绿萝过长新枝",
    description: "定期修剪促进生长",
    dueDate: new Date(Date.now() - 2 * DAY).toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 2 * DAY).toISOString(),
    priority: "low",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export const seedCarePlans: CarePlan[] = [
  {
    id: "plan-1",
    plantId: "plant-1",
    plantName: "绿萝",
    tasks: [],
    nextTask: seedCareTasks[2],
    progress: 40,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export const seedCareRecords: CareRecord[] = [
  {
    id: "record-1",
    plantId: "plant-1",
    plantName: "绿萝",
    type: "prune",
    title: "修剪绿萝过长新枝",
    description: "剪掉了花盆边缘的几根过长枝条",
    completedAt: new Date(Date.now() - 2 * DAY).toISOString(),
  },
];
