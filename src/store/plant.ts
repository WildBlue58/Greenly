import type { Plant } from "./types";
import type { SliceCreator, PlantSlice } from "./slices";
import { seedPlants } from "../mocks/seed";

const DAY = 24 * 60 * 60 * 1000;

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `plant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createPlantSlice: SliceCreator<PlantSlice> = (set) => ({
  plants: seedPlants,
  currentPlant: null,
  plantsLoading: false,

  // 保留页面提交的全部字段，仅为缺失字段补默认值
  addPlant: async (plantData: Partial<Plant>) => {
    const now = new Date().toISOString();
    const wateringFrequency = plantData.wateringFrequency ?? 7;
    const newPlant: Plant = {
      name: "新植物",
      species: "未知",
      image:
        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
      status: "healthy",
      health: "good",
      location: "客厅",
      wateringFrequency,
      lastWatered: now,
      nextWatering: new Date(
        Date.now() + wateringFrequency * DAY,
      ).toISOString(),
      notes: "",
      ...plantData,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ plants: [...state.plants, newPlant] }));
    return newPlant;
  },

  updatePlant: async (id: string, plantData: Partial<Plant>) => {
    set((state) => ({
      plants: state.plants.map((plant) =>
        plant.id === id
          ? { ...plant, ...plantData, updatedAt: new Date().toISOString() }
          : plant,
      ),
      currentPlant:
        state.currentPlant?.id === id
          ? {
              ...state.currentPlant,
              ...plantData,
              updatedAt: new Date().toISOString(),
            }
          : state.currentPlant,
    }));
  },

  deletePlant: async (id: string) => {
    set((state) => ({
      plants: state.plants.filter((plant) => plant.id !== id),
      currentPlant: state.currentPlant?.id === id ? null : state.currentPlant,
    }));
  },

  setCurrentPlant: (plant: Plant | null) => {
    set({ currentPlant: plant });
  },
});
