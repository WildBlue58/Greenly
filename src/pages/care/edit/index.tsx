import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  NavBar,
  Form,
  Field,
  Button,
  Picker,
  Popup,
  DatetimePicker,
  Toast,
  Loading,
} from "react-vant";
import { Arrow, CalendarO, Delete } from "@react-vant/icons";
import { useCare, useTitle } from "../../../hooks";
import { usePlant } from "../../../hooks/usePlant";
import type { CareTask } from "../../../store/types";
import { formatCareReminderTime } from "../../../utils/date";
import styles from "./edit.module.css";

/**
 * 编辑养护任务页面
 * 提供完整的任务编辑功能
 */
const EditCareTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 设置页面标题
  useTitle();
  
  const {
    careTasks,
    updateCareTask,
    deleteCareTask,
    careLoading,
    fetchCareTasks,
  } = useCare();
  const { plants, fetchPlants } = usePlant();

  // 当前编辑的任务
  const [currentTask, setCurrentTask] = useState<CareTask | null>(null);
  const [loading, setLoading] = useState(true);

  // 表单数据
  const [formData, setFormData] = useState({
    plantId: "",
    plantName: "",
    type: "water" as CareTask["type"],
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as CareTask["priority"],
  });

  // 弹窗状态
  const [showPlantPicker, setShowPlantPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 任务类型选项
  const taskTypes = [
    {
      value: "water",
      label: "浇水",
      icon: "💧",
      description: "给植物浇水，保持适当湿度",
    },
    {
      value: "fertilize",
      label: "施肥",
      icon: "🌱",
      description: "为植物提供营养",
    },
    {
      value: "prune",
      label: "修剪",
      icon: "✂️",
      description: "修剪枝叶，保持植物形状",
    },
    {
      value: "repot",
      label: "换盆",
      icon: "🪴",
      description: "更换更大的花盆",
    },
    { value: "other", label: "其他", icon: "📝", description: "其他养护活动" },
  ];

  // 优先级选项
  const priorities = [
    {
      value: "high",
      label: "高优先级",
      color: "#F44336",
      description: "紧急需要处理",
    },
    {
      value: "medium",
      label: "中优先级",
      color: "#FF9800",
      description: "正常优先级",
    },
    {
      value: "low",
      label: "低优先级",
      color: "#4CAF50",
      description: "不紧急，可延后",
    },
  ];

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCareTasks(), fetchPlants()]);
      } catch (error) {
        console.error("初始化数据失败:", error);
        Toast.fail("加载数据失败");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchCareTasks, fetchPlants]);

  // 查找并设置当前任务
  useEffect(() => {
    if (id && careTasks.length > 0) {
      const task = careTasks.find((t: any) => t.id === id);
      if (task) {
        setCurrentTask(task);
        setFormData({
          plantId: task.plantId,
          plantName: task.plantName,
          type: task.type,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
        });
      } else {
        Toast.fail("任务不存在");
        navigate("/care", { replace: true });
      }
    }
  }, [id, careTasks, navigate]);

  // 准备植物选择器数据
  const plantPickerColumns = useMemo(() => {
    return [
      plants.map((plant: any) => ({
        text: plant.name,
        value: plant.id,
        plantData: plant,
      })),
    ];
  }, [plants]);

  // 准备任务类型选择器数据
  const typePickerColumns = useMemo(() => {
    return [
      taskTypes.map((type) => ({
        text: `${type.icon} ${type.label}`,
        value: type.value,
        typeData: type,
      })),
    ];
  }, []);

  // 准备优先级选择器数据
  const priorityPickerColumns = useMemo(() => {
    return [
      priorities.map((priority) => ({
        text: priority.label,
        value: priority.value,
        priorityData: priority,
      })),
    ];
  }, []);

  // 获取当前选中的任务类型信息
  const currentTaskType = useMemo(() => {
    return (
      taskTypes.find((type) => type.value === formData.type) || taskTypes[0]
    );
  }, [formData.type]);

  // 获取当前选中的优先级信息
  const currentPriority = useMemo(() => {
    return (
      priorities.find((priority) => priority.value === formData.priority) ||
      priorities[1]
    );
  }, [formData.priority]);

  // 获取当前选中的植物信息
  const currentPlant = useMemo(() => {
    return plants.find((plant: any) => plant.id === formData.plantId);
  }, [plants, formData.plantId]);

  // 检查是否有变更
  const hasChanges = useMemo(() => {
    if (!currentTask) return false;

    return (
      formData.plantId !== currentTask.plantId ||
      formData.type !== currentTask.type ||
      formData.title !== currentTask.title ||
      formData.description !== currentTask.description ||
      formData.dueDate !== currentTask.dueDate ||
      formData.priority !== currentTask.priority
    );
  }, [formData, currentTask]);

  // 更新表单数据
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // 处理植物选择
  const handlePlantSelect = useCallback(
    (values: string[]) => {
      const selectedPlant = plants.find((plant: any) => plant.id === values[0]);
      if (selectedPlant) {
        updateFormData({
          plantId: selectedPlant.id,
          plantName: selectedPlant.name,
        });
      }
      setShowPlantPicker(false);
    },
    [plants, updateFormData]
  );

  // 处理任务类型选择
  const handleTypeSelect = useCallback(
    (values: string[]) => {
      const selectedType = taskTypes.find((type) => type.value === values[0]);
      if (selectedType) {
        updateFormData({
          type: selectedType.value as CareTask["type"],
        });
      }
      setShowTypePicker(false);
    },
    [updateFormData]
  );

  // 处理优先级选择
  const handlePrioritySelect = useCallback(
    (values: string[]) => {
      updateFormData({
        priority: values[0] as CareTask["priority"],
      });
      setShowPriorityPicker(false);
    },
    [updateFormData]
  );

  // 处理日期选择
  const handleDateSelect = useCallback(
    (value: Date) => {
      updateFormData({
        dueDate: value.toISOString(),
      });
      setShowDatePicker(false);
    },
    [updateFormData]
  );

  // 格式化显示日期
  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return "请选择截止日期";

    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (targetDate.getTime() === today.getTime()) {
      return `今天 ${date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (targetDate.getTime() === tomorrow.getTime()) {
      return `明天 ${date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    if (!formData.plantId) {
      Toast.fail("请选择植物");
      return false;
    }
    if (!formData.title.trim()) {
      Toast.fail("请输入任务标题");
      return false;
    }
    if (!formData.dueDate) {
      Toast.fail("请选择截止日期");
      return false;
    }
    return true;
  }, [formData]);

  // 保存更新
  const handleSave = useCallback(async () => {
    if (!currentTask || !validateForm()) return;

    try {
      const result = await updateCareTask(currentTask.id, {
        ...formData,
        plantName: currentPlant?.name || formData.plantName,
      });

      if (result.success) {
        Toast.success("更新任务成功");
        navigate("/care", { replace: true });
      } else {
        Toast.fail(result.error || "更新任务失败");
      }
    } catch (error) {
      console.error("更新任务失败:", error);
      Toast.fail("更新任务失败");
    }
  }, [
    currentTask,
    validateForm,
    updateCareTask,
    formData,
    currentPlant,
    navigate,
  ]);

  // 删除任务
  const handleDelete = useCallback(async () => {
    if (!currentTask) return;

    // 使用原生确认对话框，避免react-vant Dialog的潜在问题
    const confirmed = window.confirm(
      "确定要删除这个养护任务吗？删除后无法恢复。"
    );
    if (!confirmed) return;

    try {
      const result = await deleteCareTask(currentTask.id);
      if (result.success) {
        Toast.success("删除任务成功");
        navigate("/care", { replace: true });
      } else {
        Toast.fail(result.error || "删除任务失败");
      }
    } catch (error) {
      console.error("删除任务失败:", error);
      Toast.fail("删除任务失败");
    }
  }, [currentTask, deleteCareTask, navigate]);

  // 取消编辑
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      // 使用原生确认对话框，避免react-vant Dialog的潜在问题
      const confirmed = window.confirm("当前有未保存的更改，确定要离开吗？");
      if (confirmed) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [hasChanges, navigate]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="24px" />
        <div className={styles.loadingText}>加载中...</div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>任务不存在</div>
        <Button type="primary" onClick={() => navigate("/care")}>
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.editTaskPage}>
      {/* 导航栏 */}
      <NavBar
        title="编辑养护任务"
        leftArrow
        onClickLeft={handleCancel}
        rightText={hasChanges ? "保存" : ""}
        onClickRight={hasChanges ? handleSave : undefined}
        className={styles.navbar}
      />

      <div className={styles.content}>
        {/* 任务状态 */}
        {currentTask.completed && (
          <div className={styles.completedBanner}>
            <div className={styles.bannerText}>
              ✅ 此任务已完成于{" "}
              {formatCareReminderTime(currentTask.completedAt || "")}
            </div>
          </div>
        )}

        <Form className={styles.form}>
          {/* 选择植物 */}
          <Field
            label="选择植物"
            value={currentPlant ? currentPlant.name : "请选择植物"}
            placeholder="请选择植物"
            rightIcon={<Arrow />}
            readOnly
            required
            onClick={() => setShowPlantPicker(true)}
            className={styles.fieldItem}
          />

          {/* 任务类型 */}
          <Field
            label="任务类型"
            value={`${currentTaskType.icon} ${currentTaskType.label}`}
            placeholder="请选择任务类型"
            rightIcon={<Arrow />}
            readOnly
            required
            onClick={() => setShowTypePicker(true)}
            className={styles.fieldItem}
          />

          {/* 任务标题 */}
          <Field
            label="任务标题"
            value={formData.title}
            placeholder="请输入任务标题"
            onChange={(value) => updateFormData({ title: value })}
            required
            className={styles.fieldItem}
          />

          {/* 任务描述 */}
          <Field
            label="任务描述"
            value={formData.description}
            placeholder="请输入任务描述（可选）"
            type="textarea"
            rows={3}
            onChange={(value) => updateFormData({ description: value })}
            className={styles.fieldItem}
          />

          {/* 截止日期 */}
          <Field
            label="截止日期"
            value={formatDisplayDate(formData.dueDate)}
            placeholder="请选择截止日期"
            rightIcon={<CalendarO />}
            readOnly
            required
            onClick={() => setShowDatePicker(true)}
            className={styles.fieldItem}
          />

          {/* 优先级 */}
          <Field
            label="优先级"
            value={currentPriority.label}
            placeholder="请选择优先级"
            rightIcon={<Arrow />}
            readOnly
            onClick={() => setShowPriorityPicker(true)}
            className={styles.fieldItem}
          >
            <div
              className={styles.priorityIndicator}
              style={{ backgroundColor: currentPriority.color }}
            />
          </Field>
        </Form>

        {/* 任务信息 */}
        <div className={styles.taskInfo}>
          <div className={styles.infoTitle}>任务信息</div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>创建时间：</span>
            <span className={styles.infoValue}>
              {formatDisplayDate(currentTask.createdAt)}
            </span>
          </div>
          {currentTask.completedAt && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>完成时间：</span>
              <span className={styles.infoValue}>
                {formatCareReminderTime(currentTask.completedAt)}
              </span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <Button
            type="danger"
            size="large"
            icon={<Delete />}
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            删除任务
          </Button>
          <Button
            type="default"
            size="large"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            取消
          </Button>
          <Button
            type="primary"
            size="large"
            loading={careLoading}
            onClick={handleSave}
            disabled={!hasChanges}
            className={styles.saveButton}
          >
            保存更改
          </Button>
        </div>
      </div>

      {/* 植物选择器 */}
      <Popup
        visible={showPlantPicker}
        position="bottom"
        onClose={() => setShowPlantPicker(false)}
      >
        <Picker
          title="选择植物"
          columns={plantPickerColumns}
          value={[formData.plantId]}
          onConfirm={handlePlantSelect}
          onCancel={() => setShowPlantPicker(false)}
        />
      </Popup>

      {/* 任务类型选择器 */}
      <Popup
        visible={showTypePicker}
        position="bottom"
        onClose={() => setShowTypePicker(false)}
      >
        <Picker
          title="选择任务类型"
          columns={typePickerColumns}
          value={[formData.type]}
          onConfirm={handleTypeSelect}
          onCancel={() => setShowTypePicker(false)}
        />
      </Popup>

      {/* 优先级选择器 */}
      <Popup
        visible={showPriorityPicker}
        position="bottom"
        onClose={() => setShowPriorityPicker(false)}
      >
        <Picker
          title="选择优先级"
          columns={priorityPickerColumns}
          value={[formData.priority]}
          onConfirm={handlePrioritySelect}
          onCancel={() => setShowPriorityPicker(false)}
        />
      </Popup>

      {/* 日期时间选择器 */}
      <Popup
        visible={showDatePicker}
        position="bottom"
        onClose={() => setShowDatePicker(false)}
      >
        <DatetimePicker
          title="选择截止日期"
          type="datetime"
          value={formData.dueDate ? new Date(formData.dueDate) : new Date()}
          onConfirm={handleDateSelect}
          onCancel={() => setShowDatePicker(false)}
          minDate={new Date()}
        />
      </Popup>
    </div>
  );
};

export default EditCareTask;
