import type { CarePlan, CareRecord, CareTask } from "./types";

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
      const token = localStorage.getItem("token");
      const response = await fetch("/api/care/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取养护计划失败");
      }

      const data = await response.json();
      set({ carePlans: data.plans, careLoading: false });
    } catch (error) {
      console.error("获取养护计划失败:", error);
      set({ careLoading: false });
      throw error;
    }
  },

  // 获取养护记录
  fetchCareRecords: async () => {
    set({ careLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/care/records", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取养护记录失败");
      }

      const data = await response.json();
      set({ careRecords: data.records, careLoading: false });
    } catch (error) {
      console.error("获取养护记录失败:", error);
      set({ careLoading: false });
      throw error;
    }
  },

  // 获取养护任务
  fetchCareTasks: async () => {
    set({ careLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/care/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取养护任务失败");
      }

      const data = await response.json();
      set({ careTasks: data.tasks, careLoading: false });
    } catch (error) {
      console.error("获取养护任务失败:", error);
      set({ careLoading: false });
      throw error;
    }
  },

  // 添加养护任务
  addCareTask: async (taskData: Partial<CareTask>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/care/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("添加养护任务失败");
      }

      const newTask = await response.json();
      set((state: any) => ({ 
        careTasks: [...state.careTasks, newTask] 
      }));
      
      return newTask;
    } catch (error) {
      console.error("添加养护任务失败:", error);
      throw error;
    }
  },

  // 更新养护任务
  updateCareTask: async (id: string, taskData: Partial<CareTask>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/care/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("更新养护任务失败");
      }

      const updatedTask = await response.json();
      set((state: any) => ({
        careTasks: state.careTasks.map((task: CareTask) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error("更新养护任务失败:", error);
      throw error;
    }
  },

  // 完成养护任务
  completeCareTask: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/care/tasks/${id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("完成任务失败");
      }

      const updatedTask = await response.json();
      set((state: any) => ({
        careTasks: state.careTasks.map((task: CareTask) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error("完成任务失败:", error);
      throw error;
    }
  },

  // 删除养护任务
  deleteCareTask: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/care/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("删除养护任务失败");
      }

      set((state: any) => ({
        careTasks: state.careTasks.filter((task: CareTask) => task.id !== id),
      }));
    } catch (error) {
      console.error("删除养护任务失败:", error);
      throw error;
    }
  },

  // 添加养护记录
  addCareRecord: async (recordData: Partial<CareRecord>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/care/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error("添加养护记录失败");
      }

      const newRecord = await response.json();
      set((state: any) => ({ 
        careRecords: [...state.careRecords, newRecord] 
      }));
      
      return newRecord;
    } catch (error) {
      console.error("添加养护记录失败:", error);
      throw error;
    }
  },

  // 生成养护计划
  generateCarePlan: async (plantId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/care/plans/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plantId }),
      });

      if (!response.ok) {
        throw new Error("生成养护计划失败");
      }

      const newPlan = await response.json();
      set((state: any) => ({ 
        carePlans: [...state.carePlans, newPlan] 
      }));
      
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
