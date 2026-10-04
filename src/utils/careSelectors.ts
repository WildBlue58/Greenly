import type { CareTask } from "../store/types";

/**
 * 养护任务的纯派生计算，供页面 selector 使用。
 * 输入来自 store 的 careTasks，输出为 useMemo 友好的新数组。
 */

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const selectPendingTasks = (tasks: CareTask[]): CareTask[] =>
  tasks.filter((task) => !task.completed);

export const selectCompletedTasks = (tasks: CareTask[]): CareTask[] =>
  tasks.filter((task) => task.completed);

export const selectTodayTasks = (tasks: CareTask[]): CareTask[] => {
  const now = new Date();
  return tasks.filter((task) => isSameDay(new Date(task.dueDate), now));
};

export const selectTodayPendingTasks = (tasks: CareTask[]): CareTask[] =>
  selectTodayTasks(tasks).filter((task) => !task.completed);

export const selectOverdueTasks = (tasks: CareTask[]): CareTask[] => {
  const now = new Date();
  return tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < now
  );
};

/** 今日养护进度：今天到期的任务总数与其中已完成数 */
export const selectTodayProgress = (
  tasks: CareTask[]
): { total: number; completed: number; rate: number } => {
  const todayTasks = selectTodayTasks(tasks);
  const completed = todayTasks.filter((task) => task.completed).length;
  return {
    total: todayTasks.length,
    completed,
    rate: todayTasks.length > 0 ? (completed / todayTasks.length) * 100 : 0,
  };
};

export interface CareStatsSummary {
  totalTasks: number;
  completedCount: number;
  pendingCount: number;
  overdueCount: number;
  completionRate: number;
}

export const computeCareStats = (tasks: CareTask[]): CareStatsSummary => {
  const completedCount = selectCompletedTasks(tasks).length;
  const pendingCount = tasks.length - completedCount;
  const overdueCount = selectOverdueTasks(tasks).length;

  return {
    totalTasks: tasks.length,
    completedCount,
    pendingCount,
    overdueCount,
    completionRate:
      tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0,
  };
};
