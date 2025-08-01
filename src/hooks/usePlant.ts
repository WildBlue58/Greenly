import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import type { Plant } from '../store/types';

/**
 * 植物相关Hook
 * 提供植物列表管理、添加、更新、删除等功能
 */
export const usePlant = () => {
  const store = useStore() as any;
  
  // 从store中提取植物相关状态和方法
  const plants = store.plants || [];
  const currentPlant = store.currentPlant;
  const plantsLoading = store.plantsLoading;
  const fetchPlants = store.fetchPlants;
  const addPlant = store.addPlant;
  const updatePlant = store.updatePlant;
  const deletePlant = store.deletePlant;
  const setCurrentPlant = store.setCurrentPlant;

  /**
   * 获取植物列表
   */
  const handleFetchPlants = useCallback(async () => {
    try {
      await fetchPlants();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取植物列表失败' };
    }
  }, [fetchPlants]);

  /**
   * 添加植物
   */
  const handleAddPlant = useCallback(async (plantData: Partial<Plant>) => {
    try {
      const newPlant = await addPlant(plantData);
      return { success: true, data: newPlant };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '添加植物失败' };
    }
  }, [addPlant]);

  /**
   * 更新植物
   */
  const handleUpdatePlant = useCallback(async (id: string, plantData: Partial<Plant>) => {
    try {
      await updatePlant(id, plantData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '更新植物失败' };
    }
  }, [updatePlant]);

  /**
   * 删除植物
   */
  const handleDeletePlant = useCallback(async (id: string) => {
    try {
      await deletePlant(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除植物失败' };
    }
  }, [deletePlant]);

  /**
   * 设置当前选中的植物
   */
  const handleSetCurrentPlant = useCallback((plant: Plant | null) => {
    setCurrentPlant(plant);
  }, [setCurrentPlant]);

  /**
   * 根据健康状态筛选植物
   */
  const getPlantsByHealth = useCallback((health: Plant['health']) => {
    return plants.filter((plant: Plant) => plant.health === health);
  }, [plants]);

  /**
   * 根据状态筛选植物
   */
  const getPlantsByStatus = useCallback((status: Plant['status']) => {
    return plants.filter((plant: Plant) => plant.status === status);
  }, [plants]);

  /**
   * 获取需要浇水的植物
   */
  const getPlantsNeedingWater = useMemo(() => {
    const now = new Date();
    return plants.filter((plant: Plant) => {
      const nextWatering = new Date(plant.nextWatering);
      return nextWatering <= now;
    });
  }, [plants]);

  /**
   * 获取植物统计信息
   */
  const plantStats = useMemo(() => {
    const total = plants.length;
    const healthy = plants.filter((p: Plant) => p.status === 'healthy').length;
    const needsCare = plants.filter((p: Plant) => p.status === 'needs_care').length;
    const sick = plants.filter((p: Plant) => p.status === 'sick').length;

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
    fetchPlants: handleFetchPlants,
    addPlant: handleAddPlant,
    updatePlant: handleUpdatePlant,
    deletePlant: handleDeletePlant,
    setCurrentPlant: handleSetCurrentPlant,
    
    // 筛选方法
    getPlantsByHealth,
    getPlantsByStatus,
    getPlantsNeedingWater,
    
    // 统计信息
    plantStats,
  };
};
