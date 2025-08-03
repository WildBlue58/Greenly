import type { CarePlan, CareRecord, CareTask } from "./types";

// 清空的初始数据 - 不使用模拟数据

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

      // 如果没有存储的数据，使用空数组
      console.log("初始化空的养护计划数据");
      localStorage.setItem("carePlans", JSON.stringify([]));
      set({ carePlans: [], careLoading: false });
    } catch (error) {
      console.error("获取养护计划失败:", error);
      set({ carePlans: [], careLoading: false });
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

      // 如果没有存储的数据，使用空数组
      console.log("初始化空的养护记录数据");
      localStorage.setItem("careRecords", JSON.stringify([]));
      set({ careRecords: [], careLoading: false });
    } catch (error) {
      console.error("获取养护记录失败:", error);
      set({ careRecords: [], careLoading: false });
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

      // 如果没有存储的数据，使用空数组
      console.log("初始化空的养护任务数据");
      localStorage.setItem("careTasks", JSON.stringify([]));
      set({ careTasks: [], careLoading: false });
    } catch (error) {
      console.error("获取养护任务失败:", error);
      set({ careTasks: [], careLoading: false });
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
      
      return { success: true, data: newTask };
    } catch (error) {
      console.error("添加养护任务失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '添加任务失败' };
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
      return { success: true };
    } catch (error) {
      console.error("更新养护任务失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '更新任务失败' };
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
      return { success: true };
    } catch (error) {
      console.error("完成任务失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '完成任务失败' };
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
      return { success: true };
    } catch (error) {
      console.error("删除养护任务失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '删除任务失败' };
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
      
      return { success: true, data: newRecord };
    } catch (error) {
      console.error("添加养护记录失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '添加记录失败' };
    }
  },

  // 删除养护记录
  deleteCareRecord: async (id: string) => {
    try {
      set((state: any) => {
        const filteredRecords = state.careRecords.filter((record: CareRecord) => record.id !== id);
        localStorage.setItem("careRecords", JSON.stringify(filteredRecords));
        return { careRecords: filteredRecords };
      });
      return { success: true };
    } catch (error) {
      console.error("删除养护记录失败:", error);
      return { success: false, error: error instanceof Error ? error.message : '删除记录失败' };
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
      return { success: false, error: error instanceof Error ? error.message : '生成计划失败' };
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
