import { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import type { CareRecord, CareTask } from '../store/types';

/**
 * 养护相关Hook
 * 提供养护计划、任务、记录管理等功能
 */
export const useCare = () => {
  const store = useStore();

  const carePlans = store.carePlans;
  const careRecords = store.careRecords;
  const careTasks = store.careTasks;

  /**
   * 添加养护任务
   */
  const handleAddCareTask = useCallback(async (taskData: Partial<CareTask>) => {
    return store.addCareTask(taskData);
  }, [store]);

  /**
   * 更新养护任务
   */
  const handleUpdateCareTask = useCallback(async (id: string, taskData: Partial<CareTask>) => {
    return store.updateCareTask(id, taskData);
  }, [store]);

  /**
   * 删除养护任务
   */
  const handleDeleteCareTask = useCallback(async (id: string) => {
    return store.deleteCareTask(id);
  }, [store]);

  /**
   * 完成养护任务
   */
  const handleCompleteCareTask = useCallback(async (id: string) => {
    return store.completeCareTask(id);
  }, [store]);

  /**
   * 添加养护记录
   */
  const handleAddCareRecord = useCallback(async (recordData: Partial<CareRecord>) => {
    return store.addCareRecord(recordData);
  }, [store]);

  /**
   * 删除养护记录
   */
  const handleDeleteCareRecord = useCallback(async (id: string) => {
    return store.deleteCareRecord(id);
  }, [store]);

  /**
   * 获取待完成的任务
   */
  const pendingTasks = useMemo(() => {
    return careTasks.filter((task) => !task.completed);
  }, [careTasks]);

  /**
   * 获取已完成的任务
   */
  const completedTasks = useMemo(() => {
    return careTasks.filter((task) => task.completed);
  }, [careTasks]);

  /**
   * 获取高优先级任务
   */
  const highPriorityTasks = useMemo(() => {
    return careTasks.filter((task) => task.priority === 'high' && !task.completed);
  }, [careTasks]);

  /**
   * 获取今日任务
   */
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return careTasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });
  }, [careTasks]);

  /**
   * 获取逾期任务
   */
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return careTasks.filter((task) => {
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

    // 方法
    addCareTask: handleAddCareTask,
    updateCareTask: handleUpdateCareTask,
    deleteCareTask: handleDeleteCareTask,
    completeCareTask: handleCompleteCareTask,
    addCareRecord: handleAddCareRecord,
    deleteCareRecord: handleDeleteCareRecord,

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
