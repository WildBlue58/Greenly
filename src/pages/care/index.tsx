import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Toast, Dialog } from "react-vant";
import { Add } from "@react-vant/icons";
import {
  CarePlanComponent,
  CareRecordComponent,
  CareReminder,
  CareStats,
  CareForm,
} from "../../components/care";
import { Empty } from "../../components/common";
import { useStore } from "../../store";
import { useTitle } from "../../hooks";
import {
  selectPendingTasks,
  selectCompletedTasks,
  selectTodayPendingTasks,
  selectOverdueTasks,
  computeCareStats,
} from "../../utils/careSelectors";
import type { CareRecord, CareTask } from "../../store/types";
import styles from "./care.module.css";

/** 按 plantId 分组任务 */
const groupTasksByPlant = (tasks: CareTask[]): Record<string, CareTask[]> => {
  const groups: Record<string, CareTask[]> = {};
  for (const task of tasks) {
    if (!groups[task.plantId]) {
      groups[task.plantId] = [];
    }
    groups[task.plantId].push(task);
  }
  return groups;
};

/**
 * 养护页面主组件
 * 包含养护计划、任务管理、记录查看等功能
 */
const CarePage: React.FC = () => {
  const navigate = useNavigate();

  // 设置页面标题
  useTitle();

  const [activeTab, setActiveTab] = useState("plan");
  const [showAddForm, setShowAddForm] = useState(false);

  const plants = useStore((s) => s.plants);
  const careTasks = useStore((s) => s.careTasks);
  const careRecords = useStore((s) => s.careRecords);
  const addCareTask = useStore((s) => s.addCareTask);
  const deleteCareTask = useStore((s) => s.deleteCareTask);
  const completeCareTask = useStore((s) => s.completeCareTask);
  const deleteCareRecord = useStore((s) => s.deleteCareRecord);

  // 添加养护任务
  const handleAddTask = useCallback(
    async (taskData: Partial<CareTask>) => {
      try {
        const result = await addCareTask(taskData);
        if (result.success) {
          Toast.success("添加任务成功");
          setShowAddForm(false);
        } else {
          Toast.fail(`添加任务失败: ${result.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("添加任务失败:", error);
        Toast.fail("添加任务失败");
      }
    },
    [addCareTask]
  );

  // 编辑养护任务
  const handleEditTask = useCallback(
    (task: CareTask) => {
      navigate(`/care/edit/${task.id}`);
    },
    [navigate]
  );

  // 删除养护任务
  const handleDeleteTask = useCallback(
    async (task: CareTask) => {
      if (!task?.id) {
        Toast.fail("任务信息错误");
        return;
      }

      try {
        const result = await deleteCareTask(task.id);
        if (result?.success) {
          Toast.success("删除任务成功");
        } else {
          Toast.fail(`删除任务失败: ${result?.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("删除任务失败:", error);
        Toast.fail("删除任务失败");
      }
    },
    [deleteCareTask]
  );

  // 完成养护任务
  const handleCompleteTask = useCallback(
    async (task: CareTask) => {
      if (!task?.id) {
        Toast.fail("任务信息错误");
        return;
      }

      try {
        const result = await completeCareTask(task.id);
        if (result?.success) {
          Toast.success("任务已完成");
        } else {
          Toast.fail(`操作失败: ${result?.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("完成任务失败:", error);
        Toast.fail("操作失败");
      }
    },
    [completeCareTask]
  );

  // 关闭表单
  const handleCloseForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  // 内联添加任务（使用弹窗）
  const handleInlineAdd = useCallback(() => {
    setShowAddForm(true);
  }, []);

  // 编辑养护记录
  const handleEditRecord = useCallback((record: CareRecord) => {
    Toast.info(`「${record.title}」的编辑功能开发中...`);
  }, []);

  // 删除养护记录
  const handleDeleteRecord = useCallback(
    async (record: CareRecord) => {
      const confirmed = await Dialog.confirm({
        title: "删除记录",
        message: `确定要删除"${record.title}"记录吗？删除后无法恢复。`,
      });
      if (!confirmed) return;

      const result = await deleteCareRecord(record.id);
      if (result.success) {
        Toast.success("删除记录成功");
      } else {
        Toast.fail(result.error || "删除记录失败");
      }
    },
    [deleteCareRecord]
  );

  // 派生数据
  const pendingTasks = useMemo(() => selectPendingTasks(careTasks), [careTasks]);
  const completedTasks = useMemo(
    () => selectCompletedTasks(careTasks),
    [careTasks]
  );
  const todayTasks = useMemo(
    () => selectTodayPendingTasks(careTasks),
    [careTasks]
  );
  const overdueTasks = useMemo(
    () => selectOverdueTasks(careTasks),
    [careTasks]
  );
  const careStats = useMemo(() => computeCareStats(careTasks), [careTasks]);

  // 按植物分组
  const groupedPendingTasks = useMemo(
    () => groupTasksByPlant(pendingTasks),
    [pendingTasks]
  );
  const groupedCompletedTasks = useMemo(
    () => groupTasksByPlant(completedTasks),
    [completedTasks]
  );

  // 准备植物选项数据
  const plantOptions = useMemo(
    () =>
      plants
        .filter((plant) => plant.id && plant.name)
        .map((plant) => ({ id: plant.id, name: plant.name })),
    [plants]
  );

  // 获取当前tab的任务数量
  const getTaskCountForTab = useCallback(
    (tab: string) => {
      switch (tab) {
        case "plan":
          return pendingTasks.length;
        case "completed":
          return completedTasks.length;
        case "records":
          return careRecords.length;
        default:
          return 0;
      }
    },
    [pendingTasks.length, completedTasks.length, careRecords.length]
  );

  return (
    <div className={styles.carePage}>
      <div className={styles.pageContent}>
        {/* 今日提醒 */}
        {todayTasks.length > 0 && (
          <div className={styles.reminderSection}>
            <CareReminder
              reminders={todayTasks}
              onComplete={handleCompleteTask}
              onSnooze={() => {}}
              onDismiss={() => {}}
            />
          </div>
        )}

        {/* 统计信息 */}
        <div className={styles.statsSection}>
          <CareStats
            stats={{
              totalPlants: plants.length,
              totalTasks: careTasks.length,
              completedTasks: completedTasks.length,
              overdueTasks: overdueTasks.length,
              thisWeekTasks: pendingTasks.length,
              completionRate: Math.round(careStats.completionRate),
            }}
          />
        </div>

        {/* 任务列表 */}
        <div className={styles.taskSection}>
          {/* Tab按钮 */}
          <div className={styles.tabButtons}>
            <Button
              type={activeTab === "plan" ? "primary" : "default"}
              size="small"
              onClick={() => setActiveTab("plan")}
            >
              待完成 ({getTaskCountForTab("plan")})
            </Button>
            <Button
              type={activeTab === "completed" ? "primary" : "default"}
              size="small"
              onClick={() => setActiveTab("completed")}
            >
              已完成 ({getTaskCountForTab("completed")})
            </Button>
            <Button
              type={activeTab === "records" ? "primary" : "default"}
              size="small"
              onClick={() => setActiveTab("records")}
            >
              记录 ({getTaskCountForTab("records")})
            </Button>
          </div>

          {/* Tab内容 */}
          <div className={styles.tabContent}>
            {activeTab === "plan" && (
              <div className={styles.taskList}>
                {Object.keys(groupedPendingTasks).length > 0 ? (
                  Object.entries(groupedPendingTasks)
                    .map(([plantId, tasks]) => {
                      const plantTasks = tasks.filter((task) => task.id);
                      if (plantTasks.length === 0) return null;

                      const firstTask = plantTasks[0];
                      const sortedTasks = [...plantTasks].sort(
                        (a, b) =>
                          new Date(a.dueDate || 0).getTime() -
                          new Date(b.dueDate || 0).getTime()
                      );
                      const nextTask = sortedTasks[0];

                      return (
                        <div key={plantId} className={styles.taskItem}>
                          <CarePlanComponent
                            plan={{
                              id: `plan-${plantId}`,
                              plantId: plantId,
                              plantName: firstTask?.plantName || "未知植物",
                              tasks: plantTasks,
                              nextTask: nextTask,
                              progress: 0,
                              createdAt:
                                firstTask?.createdAt ||
                                new Date().toISOString(),
                            }}
                            onTaskComplete={handleCompleteTask}
                            onTaskEdit={handleEditTask}
                            onTaskDelete={handleDeleteTask}
                          />
                        </div>
                      );
                    })
                    .filter(Boolean)
                ) : (
                  <Empty text="暂无待完成任务" className={styles.emptyState} />
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className={styles.taskList}>
                {Object.keys(groupedCompletedTasks).length > 0 ? (
                  Object.entries(groupedCompletedTasks)
                    .map(([plantId, tasks]) => {
                      const plantTasks = tasks.filter((task) => task.id);
                      if (plantTasks.length === 0) return null;

                      const firstTask = plantTasks[0];

                      return (
                        <div key={plantId} className={styles.taskItem}>
                          <CarePlanComponent
                            plan={{
                              id: `plan-completed-${plantId}`,
                              plantId: plantId,
                              plantName: firstTask?.plantName || "未知植物",
                              tasks: plantTasks,
                              progress: 100,
                              createdAt:
                                firstTask?.createdAt ||
                                new Date().toISOString(),
                            }}
                            onTaskEdit={handleEditTask}
                            onTaskDelete={handleDeleteTask}
                          />
                        </div>
                      );
                    })
                    .filter(Boolean)
                ) : (
                  <Empty text="暂无已完成任务" className={styles.emptyState} />
                )}
              </div>
            )}

            {activeTab === "records" && (
              <div className={styles.recordList}>
                {careRecords.length > 0 ? (
                  careRecords.map((record) => (
                      <CareRecordComponent
                        key={record.id}
                        record={record}
                        onEdit={handleEditRecord}
                        onDelete={handleDeleteRecord}
                        className={styles.recordItem}
                      />
                    ))
                ) : (
                  <Empty text="暂无养护记录" className={styles.emptyState} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 添加任务表单（仅用于快速添加） */}
      <CareForm
        visible={showAddForm}
        onClose={handleCloseForm}
        onSubmit={handleAddTask}
        plants={plantOptions}
      />

      {/* 浮动添加按钮 */}
      <Button
        type="primary"
        round
        icon={<Add />}
        className={styles.floatingAddButton}
        onClick={handleInlineAdd}
      />
    </div>
  );
};

export default CarePage;
