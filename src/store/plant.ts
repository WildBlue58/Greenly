import type { Plant } from "./types";

// 模拟植物数据
const mockPlants: Plant[] = [
  {
    id: "1",
    name: "绿萝",
    species: "绿萝属",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
    status: "healthy",
    health: "good",
    location: "客厅",
    wateringFrequency: 7,
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextWatering: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "生长良好，叶子翠绿",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "多肉植物",
    species: "景天科",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
    status: "needs_care",
    health: "warning",
    location: "阳台",
    wateringFrequency: 14,
    lastWatered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextWatering: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "需要浇水，叶子有些干瘪",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "君子兰",
    species: "石蒜科",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
    status: "healthy",
    health: "good",
    location: "书房",
    wateringFrequency: 5,
    lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "开花期，需要适当施肥",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 植物状态管理
export const plantStore = (set: any, get: any) => ({
  plants: [] as Plant[],
  currentPlant: null as Plant | null,
  plantsLoading: false,

  // 获取植物列表
  fetchPlants: async () => {
    set({ plantsLoading: true });
    try {
      // 首先尝试从localStorage获取数据
      const storedPlants = localStorage.getItem("plants");
      if (storedPlants) {
        const plants = JSON.parse(storedPlants);
        set({ plants, plantsLoading: false });
        return;
      }

      // 如果没有存储的数据，使用模拟数据
      console.log("使用模拟植物数据");
      localStorage.setItem("plants", JSON.stringify(mockPlants));
      set({ plants: mockPlants, plantsLoading: false });
      
      // 注释掉原来的API调用，避免错误
      /*
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
      */
    } catch (error) {
      console.error("获取植物列表失败:", error);
      // 如果出错，使用模拟数据
      set({ plants: mockPlants, plantsLoading: false });
    }
  },

  // 添加植物
  addPlant: async (plantData: Partial<Plant>) => {
    try {
      const newPlant: Plant = {
        id: Date.now().toString(),
        name: plantData.name || "新植物",
        species: plantData.species || "未知",
        image: plantData.image || "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
        status: plantData.status || "healthy",
        health: plantData.health || "good",
        location: plantData.location || "客厅",
        wateringFrequency: plantData.wateringFrequency || 7,
        lastWatered: new Date().toISOString(),
        nextWatering: new Date(Date.now() + (plantData.wateringFrequency || 7) * 24 * 60 * 60 * 1000).toISOString(),
        notes: plantData.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state: any) => {
        const newPlants = [...state.plants, newPlant];
        localStorage.setItem("plants", JSON.stringify(newPlants));
        return { plants: newPlants };
      });
      
      return newPlant;
    } catch (error) {
      console.error("添加植物失败:", error);
      throw error;
    }
  },

  // 更新植物
  updatePlant: async (id: string, plantData: Partial<Plant>) => {
    try {
      set((state: any) => {
        const updatedPlants = state.plants.map((plant: Plant) =>
          plant.id === id ? { ...plant, ...plantData, updatedAt: new Date().toISOString() } : plant
        );
        localStorage.setItem("plants", JSON.stringify(updatedPlants));
        return {
          plants: updatedPlants,
          currentPlant: state.currentPlant?.id === id ? { ...state.currentPlant, ...plantData, updatedAt: new Date().toISOString() } : state.currentPlant,
        };
      });
    } catch (error) {
      console.error("更新植物失败:", error);
      throw error;
    }
  },

  // 删除植物
  deletePlant: async (id: string) => {
    try {
      set((state: any) => {
        const filteredPlants = state.plants.filter((plant: Plant) => plant.id !== id);
        localStorage.setItem("plants", JSON.stringify(filteredPlants));
        return {
          plants: filteredPlants,
          currentPlant: state.currentPlant?.id === id ? null : state.currentPlant,
        };
      });
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
      const state = get();
      const plant = state.plants.find((p: Plant) => p.id === id);
      if (plant) {
        set({ currentPlant: plant });
        return plant;
      } else {
        throw new Error("植物不存在");
      }
    } catch (error) {
      console.error("获取植物详情失败:", error);
      throw error;
    }
  },

  // 浇水
  waterPlant: async (id: string) => {
    try {
      set((state: any) => {
        const updatedPlants = state.plants.map((plant: Plant) => {
          if (plant.id === id) {
            const nextWatering = new Date(Date.now() + plant.wateringFrequency * 24 * 60 * 60 * 1000);
            return {
              ...plant,
              lastWatered: new Date().toISOString(),
              nextWatering: nextWatering.toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          return plant;
        });
        localStorage.setItem("plants", JSON.stringify(updatedPlants));
        return {
          plants: updatedPlants,
          currentPlant: state.currentPlant?.id === id ? updatedPlants.find((p: Plant) => p.id === id) : state.currentPlant,
        };
      });
    } catch (error) {
      console.error("浇水失败:", error);
      throw error;
    }
  },

  // 更新植物健康状态
  updatePlantHealth: async (id: string, health: Plant["health"]) => {
    try {
      set((state: any) => {
        const updatedPlants = state.plants.map((plant: Plant) =>
          plant.id === id ? { ...plant, health, updatedAt: new Date().toISOString() } : plant
        );
        localStorage.setItem("plants", JSON.stringify(updatedPlants));
        return {
          plants: updatedPlants,
          currentPlant: state.currentPlant?.id === id ? { ...state.currentPlant, health, updatedAt: new Date().toISOString() } : state.currentPlant,
        };
      });
    } catch (error) {
      console.error("更新健康状态失败:", error);
      throw error;
    }
  },
});
