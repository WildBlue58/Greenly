import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import type { Plant } from '../store/types';

/**
 * 植物相关Hook
 * 提供植物列表管理、添加、更新、删除等功能
 */
export const usePlant = () => {
  const store = useStore();

  const plants = store.plants;
  const currentPlant = store.currentPlant;
  const plantsLoading = store.plantsLoading;

  /**
   * 添加植物
   */
  const handleAddPlant = useCallback(async (plantData: Partial<Plant>) => {
    try {
      const newPlant = await store.addPlant(plantData);
      return { success: true, data: newPlant };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '添加植物失败' };
    }
  }, [store]);

  /**
   * 更新植物
   */
  const handleUpdatePlant = useCallback(async (id: string, plantData: Partial<Plant>) => {
    try {
      await store.updatePlant(id, plantData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '更新植物失败' };
    }
  }, [store]);

  /**
   * 删除植物
   */
  const handleDeletePlant = useCallback(async (id: string) => {
    try {
      await store.deletePlant(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除植物失败' };
    }
  }, [store]);

  /**
   * 设置当前选中的植物
   */
  const handleSetCurrentPlant = useCallback((plant: Plant | null) => {
    store.setCurrentPlant(plant);
  }, [store]);

  /**
   * 获取需要浇水的植物
   */
  const getPlantsNeedingWater = useMemo(() => {
    const now = new Date();
    return plants.filter((plant) => {
      const nextWatering = new Date(plant.nextWatering);
      return nextWatering <= now;
    });
  }, [plants]);

  /**
   * 获取植物统计信息
   */
  const plantStats = useMemo(() => {
    const total = plants.length;
    const healthy = plants.filter((p) => p.status === 'healthy').length;
    const needsCare = plants.filter((p) => p.status === 'needs_care').length;
    const sick = plants.filter((p) => p.status === 'sick').length;

    return {
      total,
      healthy,
      needsCare,
      sick,
      healthRate: total > 0 ? (healthy / total) * 100 : 0,
    };
  }, [plants]);

  return {
    // 状态
    plants,
    currentPlant,
    plantsLoading,

    // 方法
    addPlant: handleAddPlant,
    updatePlant: handleUpdatePlant,
    deletePlant: handleDeletePlant,
    setCurrentPlant: handleSetCurrentPlant,

    // 筛选方法
    getPlantsNeedingWater,

    // 统计信息
    plantStats,
  };
};
