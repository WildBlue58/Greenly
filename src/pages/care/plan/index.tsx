import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Progress, Calendar, Empty } from "react-vant";
import { ClockO, StarO, Checked, Plus } from "@react-vant/icons";
import { useStore } from "../../../store";
import type { Plant } from "../../../store/types";
import styles from "./plan.module.css";

interface CareTask {
  id: string;
  title: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "repot";
  status: "pending" | "completed" | "overdue";
  dueDate: Date;
  priority: "low" | "medium" | "high";
}

const CarePlan: React.FC = () => {
  const { plants } = useStore() as any;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");

  useEffect(() => {
    // 模拟生成养护任务
    generateCareTasks();
  }, [plants]);

  const generateCareTasks = () => {
    const mockTasks: CareTask[] = [
      {
        id: "1",
        title: "给绿萝浇水",
        plantName: "绿萝",
        type: "water",
        status: "pending",
        dueDate: new Date(),
        priority: "high",
      },
      {
        id: "2",
        title: "给多肉施肥",
        plantName: "多肉",
        type: "fertilize",
        status: "completed",
        dueDate: new Date(Date.now() - 86400000),
        priority: "medium",
      },
      {
        id: "3",
        title: "修剪君子兰",
        plantName: "君子兰",
        type: "prune",
        status: "overdue",
        dueDate: new Date(Date.now() - 172800000),
        priority: "high",
      },
    ];
    setTasks(mockTasks);
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "water":
        return "💧";
      case "fertilize":
        return "🌱";
      case "prune":
        return "✂️";
      case "repot":
        return "🪴";
      default:
        return "📝";
    }
  };

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case "water":
        return "浇水";
      case "fertilize":
        return "施肥";
      case "prune":
        return "修剪";
      case "repot":
        return "换盆";
      default:
        return "其他";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "overdue":
        return "#F44336";
      case "pending":
        return "#FF9800";
      default:
        return "#999";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "overdue":
        return "已逾期";
      case "pending":
        return "待完成";
      default:
        return "未知";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "completed" as const } : task
      )
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.carePlan}>
      {/* 统计概览 */}
      <div className={styles.statsSection}>
        <Card className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{totalTasks}</div>
              <div className={styles.statLabel}>总任务</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{completedTasks}</div>
              <div className={styles.statLabel}>已完成</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {tasks.filter((t) => t.status === "overdue").length}
              </div>
              <div className={styles.statLabel}>已逾期</div>
            </div>
          </div>
          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span>完成进度</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress
              percentage={completionRate}
              color="#4CAF50"
              strokeWidth={8}
            />
          </div>
        </Card>
      </div>

      {/* 筛选按钮 */}
      <div className={styles.filterSection}>
        <Button
          size="small"
          type={filterStatus === "all" ? "primary" : "default"}
          onClick={() => setFilterStatus("all")}
        >
          全部
        </Button>
        <Button
          size="small"
          type={filterStatus === "pending" ? "primary" : "default"}
          onClick={() => setFilterStatus("pending")}
        >
          待完成
        </Button>
        <Button
          size="small"
          type={filterStatus === "completed" ? "primary" : "default"}
          onClick={() => setFilterStatus("completed")}
        >
          已完成
        </Button>
      </div>

      {/* 任务列表 */}
      <div className={styles.tasksSection}>
        {filteredTasks.length > 0 ? (
          <div className={styles.tasksList}>
            {filteredTasks.map((task) => (
              <Card key={task.id} className={styles.taskCard}>
                <div className={styles.taskContent}>
                  <div className={styles.taskHeader}>
                    <div className={styles.taskIcon}>
                      {getTaskTypeIcon(task.type)}
                    </div>
                    <div className={styles.taskInfo}>
                      <h3 className={styles.taskTitle}>{task.title}</h3>
                      <p className={styles.taskPlant}>{task.plantName}</p>
                    </div>
                    <div className={styles.taskActions}>
                      {task.status === "pending" && (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleTaskComplete(task.id)}
                        >
                          <Checked />
                          完成
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={styles.taskDetails}>
                    <div className={styles.taskMeta}>
                      <Tag
                        color={
                          getTaskTypeText(task.type) === "浇水"
                            ? "#2196F3"
                            : "#4CAF50"
                        }
                        className={styles.taskType}
                      >
                        {getTaskTypeText(task.type)}
                      </Tag>
                      <Tag
                        color={getPriorityColor(task.priority)}
                        className={styles.taskPriority}
                      >
                        {task.priority === "high"
                          ? "高"
                          : task.priority === "medium"
                          ? "中"
                          : "低"}
                        优先级
                      </Tag>
                      <Tag
                        color={getStatusColor(task.status)}
                        className={styles.taskStatus}
                      >
                        {getStatusText(task.status)}
                      </Tag>
                    </div>

                    <div className={styles.taskDate}>
                      <ClockO />
                      <span>{task.dueDate.toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description={
              filterStatus !== "all" ? "没有符合条件的任务" : "还没有养护任务"
            }
            className={styles.emptyState}
          >
            <Button
              type="primary"
              onClick={() => {
                /* 添加任务逻辑 */
              }}
              className={styles.addButton}
            >
              <Plus />
              添加养护任务
            </Button>
          </Empty>
        )}
      </div>

      {/* 悬浮添加按钮 */}
      <Button
        type="primary"
        size="large"
        className={styles.fab}
        onClick={() => {
          /* 添加任务逻辑 */
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default CarePlan;
