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
        await Promise.all([
          fetchCareTasks().catch((error) => {
            console.error("获取养护任务失败:", error);
            return { success: false, error: error.message };
          }),
          fetchPlants().catch((error) => {
            console.error("获取植物列表失败:", error);
            return { success: false, error: error.message };
          }),
        ]);
      } catch (error) {
        console.error("初始化数据失败:", error);
        alert("加载数据失败");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchCareTasks, fetchPlants]);

  // 查找并设置当前任务
  useEffect(() => {
    if (id && careTasks.length > 0) {
      try {
        const task = careTasks.find((t: any) => t.id === id);
        if (task && task.id && task.createdAt) {
          setCurrentTask(task);
          setFormData({
            plantId: task.plantId || "",
            plantName: task.plantName || "",
            type: task.type || "water",
            title: task.title || "",
            description: task.description || "",
            dueDate: task.dueDate || "",
            priority: task.priority || "medium",
          });
        } else {
          console.error("任务数据不完整:", task);
          alert("任务数据不完整");
          navigate("/care", { replace: true });
        }
      } catch (error) {
        console.error("查找任务失败:", error);
        alert("查找任务失败");
        navigate("/care", { replace: true });
      }
    }
  }, [id, careTasks, navigate]);

  // 准备植物选择器数据
  const plantPickerColumns = useMemo(() => {
    if (!plants || plants.length === 0) return [[]];
    return [
      plants.map((plant: any) => ({
        text: plant.name || "未知植物",
        value: plant.id,
        plantData: plant,
      })),
    ];
  }, [plants]);

  // 准备任务类型选择器数据
  const typePickerColumns = useMemo(() => {
    if (!taskTypes || taskTypes.length === 0) return [[]];
    return [
      taskTypes.map((type) => ({
        text: `${type.icon} ${type.label}`,
        value: type.value,
        typeData: type,
      })),
    ];
  }, [taskTypes]);

  // 准备优先级选择器数据
  const priorityPickerColumns = useMemo(() => {
    if (!priorities || priorities.length === 0) return [[]];
    return [
      priorities.map((priority) => ({
        text: priority.label,
        value: priority.value,
        priorityData: priority,
      })),
    ];
  }, [priorities]);

  // 获取当前选中的任务类型信息
  const currentTaskType = useMemo(() => {
    const found = taskTypes.find((type) => type.value === formData.type);
    return found || taskTypes[0] || null;
  }, [formData.type, taskTypes]);

  // 获取当前选中的优先级信息
  const currentPriority = useMemo(() => {
    const found = priorities.find(
      (priority) => priority.value === formData.priority
    );
    return found || priorities[1] || priorities[0] || null;
  }, [formData.priority, priorities]);

  // 获取当前选中的植物信息
  const currentPlant = useMemo(() => {
    if (!formData.plantId || !plants || plants.length === 0) return null;
    return plants.find((plant: any) => plant.id === formData.plantId) || null;
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
    [updateFormData, taskTypes, setShowTypePicker]
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
      alert("请选择植物");
      return false;
    }
    if (!formData.title.trim()) {
      alert("请输入任务标题");
      return false;
    }
    if (!formData.dueDate) {
      alert("请选择截止日期");
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
        // 使用原生 alert 避免 react-vant Toast 的问题
        alert("更新任务成功");
        navigate("/care", { replace: true });
      } else {
        alert(result.error || "更新任务失败");
      }
    } catch (error) {
      console.error("更新任务失败:", error);
      alert("更新任务失败");
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
        // 使用原生 alert 避免 react-vant Toast 的问题
        alert("删除任务成功");
        navigate("/care", { replace: true });
      } else {
        alert(result.error || "删除任务失败");
      }
    } catch (error) {
      console.error("删除任务失败:", error);
      alert("删除任务失败");
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

  // ====== 调试日志和兜底渲染 ======
  // console.log(
  //   "【调试】currentTask:",
  //   currentTask,
  //   "\ncareTasks:",
  //   careTasks,
  //   "\nplants:",
  //   plants,
  //   "\nloading:",
  //   loading,
  //   "\nid:",
  //   id
  // );

  if (!loading && !currentTask) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>
          任务不存在或数据未加载
          <br />
          当前id: {id}
          <br />
          careTasks: {JSON.stringify(careTasks)}
        </div>
        <Button type="primary" onClick={() => navigate("/care")}>
          返回
        </Button>
      </div>
    );
  }

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

  if (!currentTask.id || !currentTask.createdAt) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>任务数据不完整</div>
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

  // 兜底选择器 columns
  const safePlantPickerColumns =
    plantPickerColumns &&
    plantPickerColumns[0] &&
    plantPickerColumns[0].length > 0
      ? plantPickerColumns
      : [[{ text: "无植物", value: "" }]];
  const safeTypePickerColumns =
    typePickerColumns && typePickerColumns[0] && typePickerColumns[0].length > 0
      ? typePickerColumns
      : [[{ text: "无类型", value: "" }]];
  const safePriorityPickerColumns =
    priorityPickerColumns &&
    priorityPickerColumns[0] &&
    priorityPickerColumns[0].length > 0
      ? priorityPickerColumns
      : [[{ text: "无优先级", value: "" }]];

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
          columns={safePlantPickerColumns}
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
          columns={safeTypePickerColumns}
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
          columns={safePriorityPickerColumns}
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
