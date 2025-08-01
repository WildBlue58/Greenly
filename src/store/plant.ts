import type { Plant } from "./types";

// 植物状态管理
export const plantStore = (set: any, get: any) => ({
  plants: [] as Plant[],
  currentPlant: null as Plant | null,
  plantsLoading: false,

  // 获取植物列表
  fetchPlants: async () => {
    set({ plantsLoading: true });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/plants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取植物列表失败");
      }

      const data = await response.json();
      set({ plants: data.plants, plantsLoading: false });
    } catch (error) {
      console.error("获取植物列表失败:", error);
      set({ plantsLoading: false });
      throw error;
    }
  },

  // 添加植物
  addPlant: async (plantData: Partial<Plant>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plantData),
      });

      if (!response.ok) {
        throw new Error("添加植物失败");
      }

      const newPlant = await response.json();
      set((state: any) => ({ 
        plants: [...state.plants, newPlant] 
      }));
      
      return newPlant;
    } catch (error) {
      console.error("添加植物失败:", error);
      throw error;
    }
  },

  // 更新植物
  updatePlant: async (id: string, plantData: Partial<Plant>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plantData),
      });

      if (!response.ok) {
        throw new Error("更新植物失败");
      }

      const updatedPlant = await response.json();
      set((state: any) => ({
        plants: state.plants.map((plant: Plant) =>
          plant.id === id ? updatedPlant : plant
        ),
        currentPlant: state.currentPlant?.id === id ? updatedPlant : state.currentPlant,
      }));
    } catch (error) {
      console.error("更新植物失败:", error);
      throw error;
    }
  },

  // 删除植物
  deletePlant: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("删除植物失败");
      }

      set((state: any) => ({
        plants: state.plants.filter((plant: Plant) => plant.id !== id),
        currentPlant: state.currentPlant?.id === id ? null : state.currentPlant,
      }));
    } catch (error) {
      console.error("删除植物失败:", error);
      throw error;
    }
  },

  // 设置当前植物
  setCurrentPlant: (plant: Plant | null) => {
    set({ currentPlant: plant });
  },

  // 获取单个植物详情
  fetchPlantById: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取植物详情失败");
      }

      const plant = await response.json();
      set({ currentPlant: plant });
      return plant;
    } catch (error) {
      console.error("获取植物详情失败:", error);
      throw error;
    }
  },

  // 浇水
  waterPlant: async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plants/${id}/water`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("浇水失败");
      }

      const updatedPlant = await response.json();
      set((state: any) => ({
        plants: state.plants.map((plant: Plant) =>
          plant.id === id ? updatedPlant : plant
        ),
        currentPlant: state.currentPlant?.id === id ? updatedPlant : state.currentPlant,
      }));
    } catch (error) {
      console.error("浇水失败:", error);
      throw error;
    }
  },

  // 更新植物健康状态
  updatePlantHealth: async (id: string, health: Plant["health"]) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/plants/${id}/health`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ health }),
      });

      if (!response.ok) {
        throw new Error("更新健康状态失败");
      }

      const updatedPlant = await response.json();
      set((state: any) => ({
        plants: state.plants.map((plant: Plant) =>
          plant.id === id ? updatedPlant : plant
        ),
        currentPlant: state.currentPlant?.id === id ? updatedPlant : state.currentPlant,
      }));
    } catch (error) {
      console.error("更新健康状态失败:", error);
      throw error;
    }
  },
});
