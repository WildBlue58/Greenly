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
  Dialog,
} from "react-vant";
import { Arrow, CalendarO, Delete } from "@react-vant/icons";
import { useStore } from "../../../store";
import { useTitle } from "../../../hooks";
import type { CareTask, Plant } from "../../../store/types";
import { formatCareReminderTime } from "../../../utils/date";
import styles from "./edit.module.css";

// 任务类型选项
const taskTypes = [
  { value: "water", label: "浇水", icon: "💧", description: "给植物浇水，保持适当湿度" },
  { value: "fertilize", label: "施肥", icon: "🌱", description: "为植物提供营养" },
  { value: "prune", label: "修剪", icon: "✂️", description: "修剪枝叶，保持植物形状" },
  { value: "repot", label: "换盆", icon: "🪴", description: "更换更大的花盆" },
  { value: "other", label: "其他", icon: "📝", description: "其他养护活动" },
] as const;

// 优先级选项
const priorities = [
  { value: "high", label: "高优先级", color: "#F44336", description: "紧急需要处理" },
  { value: "medium", label: "中优先级", color: "#FF9800", description: "正常优先级" },
  { value: "low", label: "低优先级", color: "#4CAF50", description: "不紧急，可延后" },
] as const;

/**
 * 编辑养护任务页面
 * 提供完整的任务编辑功能
 */
const EditCareTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 设置页面标题
  useTitle();

  const careTasks = useStore((s) => s.careTasks);
  const updateCareTask = useStore((s) => s.updateCareTask);
  const deleteCareTask = useStore((s) => s.deleteCareTask);
  const plants = useStore((s) => s.plants);

  // 当前编辑的任务（store 数据启动时已同步恢复，直接派生即可）
  const currentTask = useMemo(
    () => (id ? careTasks.find((t) => t.id === id) ?? null : null),
    [id, careTasks]
  );

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

  // 表单数据跟随当前任务初始化/同步
  useEffect(() => {
    if (!currentTask) return;
    setFormData({
      plantId: currentTask.plantId || "",
      plantName: currentTask.plantName || "",
      type: currentTask.type || "water",
      title: currentTask.title || "",
      description: currentTask.description || "",
      dueDate: currentTask.dueDate || "",
      priority: currentTask.priority || "medium",
    });
  }, [currentTask]);

  // 准备植物选择器数据
  const plantPickerColumns = useMemo(() => {
    if (plants.length === 0) {
      return [[{ text: "无植物", value: "", plantData: null as Plant | null }]];
    }
    return [
      plants.map((plant) => ({
        text: plant.name || "未知植物",
        value: plant.id,
        plantData: plant as Plant | null,
      })),
    ];
  }, [plants]);

  // 准备任务类型选择器数据
  const typePickerColumns = useMemo(
    () => [
      taskTypes.map((type) => ({
        text: `${type.icon} ${type.label}`,
        value: type.value,
      })),
    ],
    []
  );
  // 准备优先级选择器数据
  const priorityPickerColumns = useMemo(
    () => [
      priorities.map((priority) => ({
        text: priority.label,
        value: priority.value,
      })),
    ],
    []
  );

  // 获取当前选中的任务类型信息
  const currentTaskType = useMemo(() => {
    const found = taskTypes.find((type) => type.value === formData.type);
    return found || taskTypes[0] || null;
  }, [formData.type]);

  // 获取当前选中的优先级信息
  const currentPriority = useMemo(() => {
    const found = priorities.find(
      (priority) => priority.value === formData.priority
    );
    return found || priorities[1] || priorities[0] || null;
  }, [formData.priority]);

  // 获取当前选中的植物信息
  const currentPlant = useMemo(() => {
    if (!formData.plantId || !plants || plants.length === 0) return null;
    return plants.find((plant) => plant.id === formData.plantId) || null;
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
      const selectedPlant = plants.find((plant) => plant.id === values[0]);
      if (selectedPlant) {
        updateFormData({
          plantId: selectedPlant.id,
          plantName: selectedPlant.name,
        });
      }
      setShowPlantPicker(false);
    },
    [plants, updateFormData, setShowPlantPicker]
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
    [updateFormData, setShowTypePicker]
  );

  // 处理优先级选择
  const handlePrioritySelect = useCallback(
    (values: string[]) => {
      updateFormData({
        priority: values[0] as CareTask["priority"],
      });
      setShowPriorityPicker(false);
    },
    [updateFormData, setShowPriorityPicker]
  );

  // 处理日期选择
  const handleDateSelect = useCallback(
    (value: Date) => {
      updateFormData({
        dueDate: value.toISOString(),
      });
      setShowDatePicker(false);
    },
    [updateFormData, setShowDatePicker]
  );

  // 格式化显示日期
  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString || dateString.trim() === "") return "请选择截止日期";
    try {
      return formatCareReminderTime(dateString);
    } catch (error) {
      console.error("日期格式化失败:", error);
      return "日期格式错误";
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

    const confirmed = await Dialog.confirm({
      title: "删除任务",
      message: "确定要删除这个养护任务吗？删除后无法恢复。",
    });
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
  const handleCancel = useCallback(async () => {
    if (hasChanges) {
      const confirmed = await Dialog.confirm({
        title: "离开编辑",
        message: "当前有未保存的更改，确定要离开吗？",
      });
      if (confirmed) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [hasChanges, navigate]);

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

  // 兜底 currentTaskType
  const safeTaskType = currentTaskType || { icon: "", label: "未知类型" };
  // 兜底 currentPriority
  const safePriority = currentPriority || {
    label: "未知优先级",
    color: "#ccc",
  };
  // 兜底 currentPlant
  const safePlant = currentPlant || { name: "未知植物" };

  return (
    <div className={styles.editTaskPage}>
      {/* 导航栏 */}
      <NavBar
        title="编辑养护任务"
        left-arrow
        onClickLeft={handleCancel}
        rightText={hasChanges ? "保存" : ""}
        {...(hasChanges ? { onClickRight: handleSave } : {})}
        className={styles.navbar}
      />

      <div className={styles.content}>
        {/* 任务状态横幅 */}
        {currentTask.completed && currentTask.completedAt && (
          <div className={styles.completedBanner}>
            <div className={styles.bannerText}>
              ✅ 此任务已完成于{" "}
              {formatCareReminderTime(currentTask.completedAt)}
            </div>
          </div>
        )}

        <Form className={styles.form}>
          {/* 选择植物 */}
          <Field
            label="选择植物"
            value={safePlant.name}
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
            value={`${safeTaskType.icon} ${safeTaskType.label}`}
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
            value={formData.title || ""}
            placeholder="请输入任务标题"
            onChange={(value) => updateFormData({ title: value })}
            required
            className={styles.fieldItem}
          />

          {/* 任务描述 */}
          <Field
            label="任务描述"
            value={formData.description || ""}
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
            value={safePriority.label}
            placeholder="请选择优先级"
            rightIcon={<Arrow />}
            readOnly
            onClick={() => setShowPriorityPicker(true)}
            className={styles.fieldItem}
          >
            <div
              className={styles.priorityIndicator}
              style={{ backgroundColor: safePriority.color }}
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
