import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  Progress,
  Tag,
  Button,
  Cell,
  Popup,
  Form,
  Field,
  Toast,
} from "react-vant";
import {
  Clock,
  Checked,
  Close,
  Plus,
  Edit,
  Delete,
  CalendarO,
} from "@react-vant/icons";
import {
  Card as CustomCard,
  Button as CustomButton,
  Loading,
  Empty,
  Tag as CustomTag,
  showToast,
} from "../common";
import styles from "./care.module.css";

// 养护类型定义
interface CareTask {
  id: string;
  plantId: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "repot" | "other";
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

interface CarePlan {
  id: string;
  plantId: string;
  plantName: string;
  tasks: CareTask[];
  nextTask?: CareTask;
  progress: number;
  createdAt: string;
}

interface CareRecord {
  id: string;
  plantId: string;
  plantName: string;
  type: "water" | "fertilize" | "prune" | "repot" | "other";
  title: string;
  description: string;
  completedAt: string;
  notes?: string;
  images?: string[];
}

// CarePlan 组件
interface CarePlanProps {
  plan: CarePlan;
  onTaskComplete?: (task: CareTask) => void;
  onTaskEdit?: (task: CareTask) => void;
  onTaskDelete?: (task: CareTask) => void;
  className?: string;
}

export const CarePlanComponent: React.FC<CarePlanProps> = ({
  plan,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  className = "",
}) => {
  const completedTasks = useMemo(
    () => plan.tasks.filter((task) => task.completed),
    [plan.tasks]
  );

  const pendingTasks = useMemo(
    () => plan.tasks.filter((task) => !task.completed),
    [plan.tasks]
  );

  const priorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "primary";
      default:
        return "primary";
    }
  }, []);

  const priorityText = useCallback((priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "中";
    }
  }, []);

  const taskTypeIcon = useCallback((type: string) => {
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
  }, []);

  return (
    <div className={`${styles.carePlan} ${className}`}>
      <div className={styles.planHeader}>
        <div className={styles.planTitle}>
          <h3 className={styles.plantName}>{plan.plantName}</h3>
          <p className={styles.planSubtitle}>养护计划</p>
        </div>
        <div className={styles.planProgress}>
          <Progress
            percentage={plan.progress}
            strokeWidth={8}
            color="var(--primary-color)"
            className={styles.progress}
          />
          <span className={styles.progressText}>{plan.progress}%</span>
        </div>
      </div>

      {plan.nextTask && (
        <div className={styles.nextTask}>
          <h4 className={styles.nextTaskTitle}>下一个任务</h4>
          <div className={styles.nextTaskCard}>
            <div className={styles.taskIcon}>
              {taskTypeIcon(plan.nextTask.type)}
            </div>
            <div className={styles.taskContent}>
              <h5 className={styles.taskTitle}>{plan.nextTask.title}</h5>
              <p className={styles.taskDescription}>
                {plan.nextTask.description}
              </p>
              <div className={styles.taskMeta}>
                <span className={styles.taskDue}>
                  截止: {plan.nextTask.dueDate}
                </span>
                <CustomTag
                  type={priorityColor(plan.nextTask.priority)}
                  size="small"
                >
                  {priorityText(plan.nextTask.priority)}优先级
                </CustomTag>
              </div>
            </div>
            <CustomButton
              size="small"
              type="primary"
              onClick={() => onTaskComplete?.(plan.nextTask!)}
              className={styles.completeButton}
            >
              完成
            </CustomButton>
          </div>
        </div>
      )}

      <div className={styles.taskList}>
        <h4 className={styles.taskListTitle}>所有任务</h4>

        {pendingTasks.length > 0 && (
          <div className={styles.taskSection}>
            <h5 className={styles.sectionTitle}>
              待完成 ({pendingTasks.length})
            </h5>
            {pendingTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskIcon}>{taskTypeIcon(task.type)}</div>
                <div className={styles.taskContent}>
                  <h6 className={styles.taskTitle}>{task.title}</h6>
                  <p className={styles.taskDescription}>{task.description}</p>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskDue}>截止: {task.dueDate}</span>
                    <CustomTag type={priorityColor(task.priority)} size="small">
                      {priorityText(task.priority)}优先级
                    </CustomTag>
                  </div>
                </div>
                <div className={styles.taskActions}>
                  <CustomButton
                    size="small"
                    onClick={() => onTaskComplete?.(task)}
                    className={styles.actionButton}
                  >
                    <Checked />
                  </CustomButton>
                  <CustomButton
                    size="small"
                    onClick={() => onTaskEdit?.(task)}
                    className={styles.actionButton}
                  >
                    <Edit />
                  </CustomButton>
                  <CustomButton
                    size="small"
                    type="danger"
                    onClick={() => onTaskDelete?.(task)}
                    className={styles.actionButton}
                  >
                    <Delete />
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className={styles.taskSection}>
            <h5 className={styles.sectionTitle}>
              已完成 ({completedTasks.length})
            </h5>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className={`${styles.taskItem} ${styles.completed}`}
              >
                <div className={styles.taskIcon}>{taskTypeIcon(task.type)}</div>
                <div className={styles.taskContent}>
                  <h6 className={styles.taskTitle}>{task.title}</h6>
                  <p className={styles.taskDescription}>{task.description}</p>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskCompleted}>
                      完成于: {task.completedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// CareRecord 组件
interface CareRecordProps {
  record: CareRecord;
  onEdit?: (record: CareRecord) => void;
  onDelete?: (record: CareRecord) => void;
  className?: string;
}

export const CareRecordComponent: React.FC<CareRecordProps> = ({
  record,
  onEdit,
  onDelete,
  className = "",
}) => {
  const typeIcon = useMemo(() => {
    switch (record.type) {
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
  }, [record.type]);

  const typeText = useMemo(() => {
    switch (record.type) {
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
  }, [record.type]);

  return (
    <div className={`${styles.careRecord} ${className}`}>
      <div className={styles.recordHeader}>
        <div className={styles.recordIcon}>{typeIcon}</div>
        <div className={styles.recordInfo}>
          <h4 className={styles.recordTitle}>{record.title}</h4>
          <p className={styles.recordPlant}>{record.plantName}</p>
          <span className={styles.recordType}>{typeText}</span>
        </div>
        <div className={styles.recordActions}>
          <CustomButton
            size="small"
            onClick={() => onEdit?.(record)}
            className={styles.actionButton}
          >
            <Edit />
          </CustomButton>
          <CustomButton
            size="small"
            type="danger"
            onClick={() => onDelete?.(record)}
            className={styles.actionButton}
          >
            <Delete />
          </CustomButton>
        </div>
      </div>

      <div className={styles.recordContent}>
        <p className={styles.recordDescription}>{record.description}</p>
        {record.notes && (
          <div className={styles.recordNotes}>
            <span className={styles.notesLabel}>备注:</span>
            <p className={styles.notesText}>{record.notes}</p>
          </div>
        )}
        {record.images && record.images.length > 0 && (
          <div className={styles.recordImages}>
            {record.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`记录图片 ${index + 1}`}
                className={styles.recordImage}
              />
            ))}
          </div>
        )}
        <div className={styles.recordTime}>
          <Clock />
          <span>{record.completedAt}</span>
        </div>
      </div>
    </div>
  );
};

// CareReminder 组件
interface CareReminderProps {
  reminders: CareTask[];
  onComplete?: (task: CareTask) => void;
  onSnooze?: (task: CareTask) => void;
  onDismiss?: (task: CareTask) => void;
  className?: string;
}

export const CareReminder: React.FC<CareReminderProps> = ({
  reminders,
  onComplete,
  onSnooze,
  onDismiss,
  className = "",
}) => {
  if (reminders.length === 0) {
    return (
      <Empty
        text="暂无提醒"
        image="/images/empty-reminders.png"
        className={styles.emptyReminders}
      />
    );
  }

  return (
    <div className={`${styles.careReminder} ${className}`}>
      <h3 className={styles.reminderTitle}>今日提醒</h3>
      <div className={styles.reminderList}>
        {reminders.map((reminder) => (
          <div key={reminder.id} className={styles.reminderItem}>
            <div className={styles.reminderContent}>
              <div className={styles.reminderIcon}>
                {reminder.type === "water" ? "💧" : "🌱"}
              </div>
              <div className={styles.reminderInfo}>
                <h4 className={styles.reminderTask}>{reminder.title}</h4>
                <p className={styles.reminderPlant}>{reminder.plantName}</p>
                <span className={styles.reminderTime}>{reminder.dueDate}</span>
              </div>
            </div>
            <div className={styles.reminderActions}>
              <CustomButton
                size="small"
                type="primary"
                onClick={() => onComplete?.(reminder)}
                className={styles.reminderAction}
              >
                完成
              </CustomButton>
              <CustomButton
                size="small"
                onClick={() => onSnooze?.(reminder)}
                className={styles.reminderAction}
              >
                稍后
              </CustomButton>
              <CustomButton
                size="small"
                type="danger"
                onClick={() => onDismiss?.(reminder)}
                className={styles.reminderAction}
              >
                <Close />
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CareStats 组件
interface CareStatsProps {
  stats: {
    totalPlants: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    thisWeekTasks: number;
    completionRate: number;
  };
  className?: string;
}

export const CareStats: React.FC<CareStatsProps> = ({
  stats,
  className = "",
}) => {
  return (
    <div className={`${styles.careStats} ${className}`}>
      <h3 className={styles.statsTitle}>养护统计</h3>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🪴</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalPlants}</span>
            <span className={styles.statLabel}>植物总数</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalTasks}</span>
            <span className={styles.statLabel}>总任务数</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.completedTasks}</span>
            <span className={styles.statLabel}>已完成</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.overdueTasks}</span>
            <span className={styles.statLabel}>已逾期</span>
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>完成率</span>
          <span className={styles.progressValue}>{stats.completionRate}%</span>
        </div>
        <Progress
          percentage={stats.completionRate}
          strokeWidth={6}
          color="var(--primary-color)"
          className={styles.progress}
        />
      </div>

      <div className={styles.weeklySection}>
        <h4 className={styles.weeklyTitle}>本周任务</h4>
        <div className={styles.weeklyStats}>
          <span className={styles.weeklyValue}>{stats.thisWeekTasks}</span>
          <span className={styles.weeklyLabel}>个任务待完成</span>
        </div>
      </div>
    </div>
  );
};

// CareForm 组件
interface CareFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<CareTask>) => void;
  task?: CareTask;
  plants: Array<{ id: string; name: string }>;
  loading?: boolean;
  className?: string;
}

export const CareForm: React.FC<CareFormProps> = ({
  visible,
  onClose,
  onSubmit,
  task,
  plants,
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    plantId: task?.plantId || "",
    type: task?.type || "water",
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate || "",
    priority: task?.priority || "medium",
  });

  const taskTypes = [
    { value: "water", label: "浇水", icon: "💧" },
    { value: "fertilize", label: "施肥", icon: "🌱" },
    { value: "prune", label: "修剪", icon: "✂️" },
    { value: "repot", label: "换盆", icon: "🪴" },
    { value: "other", label: "其他", icon: "📝" },
  ];

  const priorities = [
    { value: "high", label: "高优先级", color: "danger" },
    { value: "medium", label: "中优先级", color: "warning" },
    { value: "low", label: "低优先级", color: "primary" },
  ];

  const handleSubmit = useCallback(() => {
    if (!formData.plantId) {
      showToast("请选择植物");
      return;
    }
    if (!formData.title.trim()) {
      showToast("请输入任务标题");
      return;
    }
    if (!formData.dueDate) {
      showToast("请选择截止日期");
      return;
    }

    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      position="bottom"
      round
      className={`${styles.formPopup} ${className}`}
    >
      <div className={styles.formContent}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {task ? "编辑任务" : "添加养护任务"}
          </h2>
        </div>

        <Form className={styles.form}>
          <Field
            label="选择植物"
            value={formData.plantId}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, plantId: value }))
            }
            placeholder="请选择植物"
            required
            readOnly
            onClick={() => {
              // 这里应该打开植物选择器
            }}
          />

          <Field
            label="任务类型"
            value={formData.type}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value as any }))
            }
            placeholder="请选择任务类型"
            required
            readOnly
            onClick={() => {
              // 这里应该打开类型选择器
            }}
          />

          <Field
            label="任务标题"
            value={formData.title}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, title: value }))
            }
            placeholder="请输入任务标题"
            required
          />

          <Field
            label="任务描述"
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            placeholder="请输入任务描述"
            type="textarea"
            rows={3}
          />

          <Field
            label="截止日期"
            value={formData.dueDate}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, dueDate: value }))
            }
            placeholder="请选择截止日期"
            required
            readOnly
            onClick={() => {
              // 这里应该打开日期选择器
            }}
          />

          <Field
            label="优先级"
            value={formData.priority}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value as any }))
            }
            placeholder="请选择优先级"
            required
            readOnly
            onClick={() => {
              // 这里应该打开优先级选择器
            }}
          />
        </Form>

        <div className={styles.formActions}>
          <CustomButton
            type="default"
            onClick={onClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            取消
          </CustomButton>
          <CustomButton
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className={styles.submitButton}
          >
            {task ? "更新" : "添加"}
          </CustomButton>
        </div>
      </div>
    </Popup>
  );
};
