import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Toast } from "react-vant";
import { Add } from "@react-vant/icons";
import {
  CarePlanComponent,
  CareRecordComponent,
  CareReminder,
  CareStats,
  CareForm,
} from "../../components/care";
import { Loading, Empty } from "../../components/common";
import { useCare } from "../../hooks/useCare";
import { usePlant } from "../../hooks/usePlant";
import type { CareTask } from "../../store/types";
import styles from "./care.module.css";

/**
 * 养护页面主组件
 * 包含养护计划、任务管理、记录查看等功能
 */
const CarePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plan");
  const [showAddForm, setShowAddForm] = useState(false);

  // 使用养护相关hooks
  const {
    careRecords,
    careTasks,
    careLoading,
    fetchCarePlans,
    fetchCareRecords,
    fetchCareTasks,
    addCareTask,
    deleteCareTask,
    completeCareTask,
    deleteCareRecord,
    todayTasks,
    overdueTasks,
    careStats,
  } = useCare();

  // 使用植物相关hooks
  const { plants, fetchPlants } = usePlant();

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCarePlans(),
          fetchCareRecords(),
          fetchCareTasks(),
          fetchPlants(),
        ]);
      } catch (error) {
        console.error("加载数据失败:", error);
        alert("加载数据失败");
      }
    };
    loadData();
  }, [fetchCarePlans, fetchCareRecords, fetchCareTasks, fetchPlants]);

  // 添加养护任务
  const handleAddTask = useCallback(
    async (taskData: Partial<CareTask>) => {
      try {
        const result = await addCareTask(taskData);
        if (result.success) {
          // 测试：使用alert替代Toast
          alert("添加任务成功");
          setShowAddForm(false);
          // 重新获取数据
          await fetchCareTasks();
        } else {
          alert(`添加任务失败: ${result.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("添加任务失败:", error);
        alert("添加任务失败");
      }
    },
    [addCareTask, fetchCareTasks]
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
        alert("任务信息错误");
        return;
      }

      try {
        const result = await deleteCareTask(task.id);
        if (result?.success) {
          alert("删除任务成功");
          // 重新获取数据
          await fetchCareTasks();
        } else {
          alert(`删除任务失败: ${result?.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("删除任务失败:", error);
        alert("删除任务失败");
      }
    },
    [deleteCareTask, fetchCareTasks]
  );

  // 完成养护任务
  const handleCompleteTask = useCallback(
    async (task: CareTask) => {
      if (!task?.id) {
        alert("任务信息错误");
        return;
      }

      try {
        const result = await completeCareTask(task.id);
        if (result?.success) {
          alert("任务已完成");
          // 重新获取数据
          await fetchCareTasks();
        } else {
          alert(`操作失败: ${result?.error || "未知错误"}`);
        }
      } catch (error) {
        console.error("完成任务失败:", error);
        alert("操作失败");
      }
    },
    [completeCareTask, fetchCareTasks]
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
  const handleEditRecord = useCallback((record: any) => {
    // TODO: 实现记录编辑功能，暂时显示提示
    Toast.info("记录编辑功能开发中...");
    console.log("编辑记录:", record);
  }, []);

  // 删除养护记录
  const handleDeleteRecord = useCallback(
    async (record: any) => {
      try {
        // 显示确认对话框
        const confirmed = window.confirm(
          `确定要删除"${record.title}"记录吗？删除后无法恢复。`
        );
        if (!confirmed) return;

        const result = await deleteCareRecord(record.id);
        if (result.success) {
          Toast.success("删除记录成功");
          // 重新获取数据
          await fetchCareRecords();
        } else {
          Toast.fail(result.error || "删除记录失败");
        }
      } catch (error) {
        console.error("删除记录失败:", error);
        Toast.fail("删除记录失败");
      }
    },
    [deleteCareRecord, fetchCareRecords]
  );

  // 过滤待完成的任务
  const pendingTasks = useMemo(() => {
    if (!Array.isArray(careTasks)) return [];
    return careTasks.filter((task: any) => task && task.id && !task.completed);
  }, [careTasks]);

  // 过滤已完成的任务
  const completedTasks = useMemo(() => {
    if (!Array.isArray(careTasks)) return [];
    return careTasks.filter((task: any) => task && task.id && task.completed);
  }, [careTasks]);

  // 按植物分组待完成任务
  const groupedPendingTasks = useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (Array.isArray(pendingTasks)) {
      pendingTasks.forEach((task: any) => {
        // 防御性编程：检查task是否有效
        if (task && task.plantId && task.id) {
          if (!groups[task.plantId]) {
            groups[task.plantId] = [];
          }
          groups[task.plantId].push(task);
        }
      });
    }
    return groups;
  }, [pendingTasks]);

  // 按植物分组已完成任务
  const groupedCompletedTasks = useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (Array.isArray(completedTasks)) {
      completedTasks.forEach((task: any) => {
        // 防御性编程：检查task是否有效
        if (task && task.plantId && task.id) {
          if (!groups[task.plantId]) {
            groups[task.plantId] = [];
          }
          groups[task.plantId].push(task);
        }
      });
    }
    return groups;
  }, [completedTasks]);

  // 准备植物选项数据
  const plantOptions = useMemo(() => {
    if (!Array.isArray(plants)) return [];
    return plants
      .filter((plant: any) => plant && plant.id && plant.name) // 过滤无效数据
      .map((plant: any) => ({
        id: plant.id,
        name: plant.name,
      }));
  }, [plants]);

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

  if (careLoading && careTasks.length === 0) {
    return <Loading visible />;
  }

  return (
    <div className={styles.carePage}>
      <div className={styles.pageContent}>
        {/* 今日提醒 */}
        {Array.isArray(todayTasks) && todayTasks.length > 0 && (
          <div className={styles.reminderSection}>
            <CareReminder
              reminders={todayTasks.filter((task: any) => task && task.id)} // 过滤无效任务
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
              totalPlants: Array.isArray(plants) ? plants.length : 0,
              totalTasks: Array.isArray(careTasks) ? careTasks.length : 0,
              completedTasks: completedTasks.length,
              overdueTasks: Array.isArray(overdueTasks)
                ? overdueTasks.length
                : 0,
              thisWeekTasks: pendingTasks.length,
              completionRate: Math.round(careStats?.completionRate || 0),
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
                      const plantTasks =
                        (tasks as any[])?.filter((task) => task && task.id) ||
                        [];
                      if (plantTasks.length === 0) return null;

                      const firstTask = plantTasks[0];
                      const sortedTasks = plantTasks.sort(
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
                      const plantTasks =
                        (tasks as any[])?.filter((task) => task && task.id) ||
                        [];
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
                {Array.isArray(careRecords) && careRecords.length > 0 ? (
                  careRecords
                    .filter((record: any) => record && record.id) // 过滤无效记录
                    .map((record: any) => (
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
        loading={careLoading}
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
