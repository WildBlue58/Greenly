import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import type { CarePlan, CareRecord, CareTask } from '../store/types';

/**
 * 养护相关Hook
 * 提供养护计划、任务、记录管理等功能
 */
export const useCare = () => {
  const store = useStore() as any;
  
  // 从store中提取养护相关状态和方法
  const carePlans = store.carePlans || [];
  const careRecords = store.careRecords || [];
  const careTasks = store.careTasks || [];
  const careLoading = store.careLoading;
  const fetchCarePlans = store.fetchCarePlans;
  const fetchCareRecords = store.fetchCareRecords;
  const fetchCareTasks = store.fetchCareTasks;
  const addCareTask = store.addCareTask;
  const updateCareTask = store.updateCareTask;
  const deleteCareTask = store.deleteCareTask;
  const completeCareTask = store.completeCareTask;
  const addCareRecord = store.addCareRecord;
  const generateCarePlan = store.generateCarePlan;

  /**
   * 获取养护计划
   */
  const handleFetchCarePlans = useCallback(async () => {
    try {
      await fetchCarePlans();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取养护计划失败' };
    }
  }, [fetchCarePlans]);

  /**
   * 获取养护记录
   */
  const handleFetchCareRecords = useCallback(async () => {
    try {
      await fetchCareRecords();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取养护记录失败' };
    }
  }, [fetchCareRecords]);

  /**
   * 获取养护任务
   */
  const handleFetchCareTasks = useCallback(async () => {
    try {
      await fetchCareTasks();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '获取养护任务失败' };
    }
  }, [fetchCareTasks]);

  /**
   * 添加养护任务
   */
  const handleAddCareTask = useCallback(async (taskData: Partial<CareTask>) => {
    try {
      const newTask = await addCareTask(taskData);
      return { success: true, data: newTask };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '添加养护任务失败' };
    }
  }, [addCareTask]);

  /**
   * 更新养护任务
   */
  const handleUpdateCareTask = useCallback(async (id: string, taskData: Partial<CareTask>) => {
    try {
      await updateCareTask(id, taskData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '更新养护任务失败' };
    }
  }, [updateCareTask]);

  /**
   * 删除养护任务
   */
  const handleDeleteCareTask = useCallback(async (id: string) => {
    try {
      await deleteCareTask(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '删除养护任务失败' };
    }
  }, [deleteCareTask]);

  /**
   * 完成养护任务
   */
  const handleCompleteCareTask = useCallback(async (id: string) => {
    try {
      await completeCareTask(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '完成养护任务失败' };
    }
  }, [completeCareTask]);

  /**
   * 添加养护记录
   */
  const handleAddCareRecord = useCallback(async (recordData: Partial<CareRecord>) => {
    try {
      const newRecord = await addCareRecord(recordData);
      return { success: true, data: newRecord };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '添加养护记录失败' };
    }
  }, [addCareRecord]);

  /**
   * 生成养护计划
   */
  const handleGenerateCarePlan = useCallback(async (plantId: string) => {
    try {
      const plan = await generateCarePlan(plantId);
      return { success: true, data: plan };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '生成养护计划失败' };
    }
  }, [generateCarePlan]);

  /**
   * 获取待完成的任务
   */
  const pendingTasks = useMemo(() => {
    return careTasks.filter((task: CareTask) => !task.completed);
  }, [careTasks]);

  /**
   * 获取已完成的任务
   */
  const completedTasks = useMemo(() => {
    return careTasks.filter((task: CareTask) => task.completed);
  }, [careTasks]);

  /**
   * 获取高优先级任务
   */
  const highPriorityTasks = useMemo(() => {
    return careTasks.filter((task: CareTask) => task.priority === 'high' && !task.completed);
  }, [careTasks]);

  /**
   * 获取今日任务
   */
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return careTasks.filter((task: CareTask) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }, [careTasks]);

  /**
   * 获取逾期任务
   */
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return careTasks.filter((task: CareTask) => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && !task.completed;
    });
  }, [careTasks]);

  /**
   * 获取养护统计信息
   */
  const careStats = useMemo(() => {
    const totalTasks = careTasks.length;
    const completedCount = completedTasks.length;
    const pendingCount = pendingTasks.length;
    const overdueCount = overdueTasks.length;
    const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedCount,
      pendingCount,
      overdueCount,
      completionRate,
      highPriorityCount: highPriorityTasks.length,
      todayCount: todayTasks.length,
    };
  }, [careTasks, completedTasks, pendingTasks, overdueTasks, highPriorityTasks, todayTasks]);

  return {
    // 状态
    carePlans,
    careRecords,
    careTasks,
    careLoading,
    
    // 方法
    fetchCarePlans: handleFetchCarePlans,
    fetchCareRecords: handleFetchCareRecords,
    fetchCareTasks: handleFetchCareTasks,
    addCareTask: handleAddCareTask,
    updateCareTask: handleUpdateCareTask,
    deleteCareTask: handleDeleteCareTask,
    completeCareTask: handleCompleteCareTask,
    addCareRecord: handleAddCareRecord,
    generateCarePlan: handleGenerateCarePlan,
    
    // 筛选数据
    pendingTasks,
    completedTasks,
    highPriorityTasks,
    todayTasks,
    overdueTasks,
    
    // 统计信息
    careStats,
  };
};
