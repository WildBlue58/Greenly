import type { CarePlan, CareRecord, CareTask } from "./types";

// 模拟养护数据
const mockCareTasks: CareTask[] = [
  {
    id: "1",
    plantId: "1",
    plantName: "绿萝",
    type: "water",
    title: "给绿萝浇水",
    description: "绿萝需要定期浇水，保持土壤湿润",
    dueDate: new Date().toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    plantId: "2",
    plantName: "多肉植物",
    type: "water",
    title: "给多肉浇水",
    description: "多肉植物需要浇水，叶子有些干瘪",
    dueDate: new Date().toISOString(),
    completed: false,
    priority: "medium",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    plantId: "3",
    plantName: "君子兰",
    type: "fertilize",
    title: "给君子兰施肥",
    description: "君子兰开花期，需要适当施肥",
    dueDate: new Date().toISOString(),
    completed: false,
    priority: "low",
    createdAt: new Date().toISOString(),
  },
];

const mockCareRecords: CareRecord[] = [
  {
    id: "1",
    plantId: "1",
    plantName: "绿萝",
    type: "water",
    title: "浇水记录",
    description: "给绿萝浇水，土壤湿润",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: "生长良好",
  },
];

const mockCarePlans: CarePlan[] = [
  {
    id: "1",
    plantId: "1",
    plantName: "绿萝",
    tasks: mockCareTasks.filter(task => task.plantId === "1"),
    nextTask: mockCareTasks.find(task => task.plantId === "1" && !task.completed),
    progress: 67,
    createdAt: new Date().toISOString(),
  },
];

// 养护状态管理
export const careStore = (set: any, get: any) => ({
  carePlans: [] as CarePlan[],
  careRecords: [] as CareRecord[],
  careTasks: [] as CareTask[],
  careLoading: false,

  // 获取养护计划
  fetchCarePlans: async () => {
    set({ careLoading: true });
    try {
      // 首先尝试从localStorage获取数据
      const storedPlans = localStorage.getItem("carePlans");
      if (storedPlans) {
        const plans = JSON.parse(storedPlans);
        set({ carePlans: plans, careLoading: false });
        return;
      }

      // 如果没有存储的数据，使用模拟数据
      console.log("使用模拟养护计划数据");
      localStorage.setItem("carePlans", JSON.stringify(mockCarePlans));
      set({ carePlans: mockCarePlans, careLoading: false });
    } catch (error) {
      console.error("获取养护计划失败:", error);
      set({ carePlans: mockCarePlans, careLoading: false });
    }
  },

  // 获取养护记录
  fetchCareRecords: async () => {
    set({ careLoading: true });
    try {
      // 首先尝试从localStorage获取数据
      const storedRecords = localStorage.getItem("careRecords");
      if (storedRecords) {
        const records = JSON.parse(storedRecords);
        set({ careRecords: records, careLoading: false });
        return;
      }

      // 如果没有存储的数据，使用模拟数据
      console.log("使用模拟养护记录数据");
      localStorage.setItem("careRecords", JSON.stringify(mockCareRecords));
      set({ careRecords: mockCareRecords, careLoading: false });
    } catch (error) {
      console.error("获取养护记录失败:", error);
      set({ careRecords: mockCareRecords, careLoading: false });
    }
  },

  // 获取养护任务
  fetchCareTasks: async () => {
    set({ careLoading: true });
    try {
      // 首先尝试从localStorage获取数据
      const storedTasks = localStorage.getItem("careTasks");
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        set({ careTasks: tasks, careLoading: false });
        return;
      }

      // 如果没有存储的数据，使用模拟数据
      console.log("使用模拟养护任务数据");
      localStorage.setItem("careTasks", JSON.stringify(mockCareTasks));
      set({ careTasks: mockCareTasks, careLoading: false });
    } catch (error) {
      console.error("获取养护任务失败:", error);
      set({ careTasks: mockCareTasks, careLoading: false });
    }
  },

  // 添加养护任务
  addCareTask: async (taskData: Partial<CareTask>) => {
    try {
      const newTask: CareTask = {
        id: Date.now().toString(),
        plantId: taskData.plantId || "",
        plantName: taskData.plantName || "",
        type: taskData.type || "water",
        title: taskData.title || "新任务",
        description: taskData.description || "",
        dueDate: taskData.dueDate || new Date().toISOString(),
        completed: false,
        priority: taskData.priority || "medium",
        createdAt: new Date().toISOString(),
      };

      set((state: any) => {
        const newTasks = [...state.careTasks, newTask];
        localStorage.setItem("careTasks", JSON.stringify(newTasks));
        return { careTasks: newTasks };
      });
      
      return newTask;
    } catch (error) {
      console.error("添加养护任务失败:", error);
      throw error;
    }
  },

  // 更新养护任务
  updateCareTask: async (id: string, taskData: Partial<CareTask>) => {
    try {
      set((state: any) => {
        const updatedTasks = state.careTasks.map((task: CareTask) =>
          task.id === id ? { ...task, ...taskData } : task
        );
        localStorage.setItem("careTasks", JSON.stringify(updatedTasks));
        return { careTasks: updatedTasks };
      });
    } catch (error) {
      console.error("更新养护任务失败:", error);
      throw error;
    }
  },

  // 完成养护任务
  completeCareTask: async (id: string) => {
    try {
      set((state: any) => {
        const updatedTasks = state.careTasks.map((task: CareTask) =>
          task.id === id ? { ...task, completed: true, completedAt: new Date().toISOString() } : task
        );
        localStorage.setItem("careTasks", JSON.stringify(updatedTasks));
        return { careTasks: updatedTasks };
      });
    } catch (error) {
      console.error("完成任务失败:", error);
      throw error;
    }
  },

  // 删除养护任务
  deleteCareTask: async (id: string) => {
    try {
      set((state: any) => {
        const filteredTasks = state.careTasks.filter((task: CareTask) => task.id !== id);
        localStorage.setItem("careTasks", JSON.stringify(filteredTasks));
        return { careTasks: filteredTasks };
      });
    } catch (error) {
      console.error("删除养护任务失败:", error);
      throw error;
    }
  },

  // 添加养护记录
  addCareRecord: async (recordData: Partial<CareRecord>) => {
    try {
      const newRecord: CareRecord = {
        id: Date.now().toString(),
        plantId: recordData.plantId || "",
        plantName: recordData.plantName || "",
        type: recordData.type || "water",
        title: recordData.title || "养护记录",
        description: recordData.description || "",
        completedAt: new Date().toISOString(),
        notes: recordData.notes,
        images: recordData.images,
      };

      set((state: any) => {
        const newRecords = [...state.careRecords, newRecord];
        localStorage.setItem("careRecords", JSON.stringify(newRecords));
        return { careRecords: newRecords };
      });
      
      return newRecord;
    } catch (error) {
      console.error("添加养护记录失败:", error);
      throw error;
    }
  },

  // 生成养护计划
  generateCarePlan: async (plantId: string) => {
    try {
      const state = get();
      const plant = state.plants?.find((p: any) => p.id === plantId);
      if (!plant) {
        throw new Error("植物不存在");
      }

      const newPlan: CarePlan = {
        id: Date.now().toString(),
        plantId,
        plantName: plant.name,
        tasks: [],
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      set((state: any) => {
        const newPlans = [...state.carePlans, newPlan];
        localStorage.setItem("carePlans", JSON.stringify(newPlans));
        return { carePlans: newPlans };
      });
      
      return newPlan;
    } catch (error) {
      console.error("生成养护计划失败:", error);
      throw error;
    }
  },

  // 获取今日任务
  getTodayTasks: () => {
    const { careTasks } = get();
    const today = new Date().toISOString().split('T')[0];
    
    return careTasks.filter((task: CareTask) => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === today && !task.completed;
    });
  },

  // 获取逾期任务
  getOverdueTasks: () => {
    const { careTasks } = get();
    const today = new Date();
    
    return careTasks.filter((task: CareTask) => {
      const taskDate = new Date(task.dueDate);
      return taskDate < today && !task.completed;
    });
  },
});
