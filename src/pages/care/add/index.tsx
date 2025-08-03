import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavBar,
  Form,
  Field,
  Button,
  Picker,
  Popup,
  DatetimePicker,
} from "react-vant";
import { Arrow, CalendarO } from "@react-vant/icons";
import { useCare } from "../../../hooks/useCare";
import { usePlant } from "../../../hooks/usePlant";
import type { CareTask, Plant } from "../../../store/types";
import { formatCareReminderTime } from "../../../utils/date";
import styles from "./add.module.css";
import { useTitle } from "../../../hooks";

/**
 * 添加养护任务页面
 * 提供完整的任务创建功能
 */
const AddCareTask: React.FC = () => {
  useTitle();
  const navigate = useNavigate();
  const { addCareTask } = useCare();
  const { plants, fetchPlants } = usePlant();

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
    fetchPlants();
  }, [fetchPlants]);

  // 准备植物选择器数据
  const plantPickerColumns = useMemo(() => {
    return [
      plants.map((plant: Plant) => ({
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
    return plants.find((plant: Plant) => plant.id === formData.plantId);
  }, [plants, formData.plantId]);

  // 更新表单数据
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  // 处理植物选择
  const handlePlantSelect = useCallback(
    (values: string[]) => {
      const selectedPlant = plants.find(
        (plant: Plant) => plant.id === values[0]
      );
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
          title:
            formData.title || `给${formData.plantName}${selectedType.label}`,
        });
      }
      setShowTypePicker(false);
    },
    [updateFormData, formData.title, formData.plantName]
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
    return formatCareReminderTime(dateString);
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

  // 保存任务
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const result = await addCareTask({
        ...formData,
        plantName: currentPlant?.name || formData.plantName,
      });

      if (result.success) {
        alert("添加任务成功");
        navigate("/care", { replace: true });
      } else {
        alert(`添加任务失败: ${result.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("添加任务失败:", error);
      alert("添加任务失败");
    }
  }, [validateForm, addCareTask, formData, currentPlant, navigate]);

  // 取消添加
  const handleCancel = useCallback(() => {
    if (formData.title || formData.description || formData.plantId) {
      // 使用原生确认对话框，避免react-vant Dialog的潜在问题
      const confirmed = window.confirm("当前有未保存的内容，确定要离开吗？");
      if (confirmed) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [formData, navigate]);

  // 快速填充
  const handleQuickFill = useCallback(
    (type: CareTask["type"]) => {
      const taskType = taskTypes.find((t) => t.value === type);
      if (taskType && currentPlant) {
        updateFormData({
          type,
          title: `给${currentPlant.name}${taskType.label}`,
          description: taskType.description,
        });
      }
    },
    [currentPlant, updateFormData]
  );

  return (
    <div className={styles.addTaskPage}>
      {/* 导航栏 */}
      <NavBar
        title="添加养护任务"
        leftText="取消"
        rightText="保存"
        onClickLeft={handleCancel}
        onClickRight={handleSave}
        className={styles.navbar}
      />

      <div className={styles.content}>
        <Form className={styles.form}>
          {/* 植物选择 */}
          <Field
            label="选择植物"
            value={currentPlant?.name || "请选择植物"}
            placeholder="请选择植物"
            required
            readOnly
            rightIcon={<Arrow />}
            onClick={() => setShowPlantPicker(true)}
          />

          {/* 任务类型 */}
          <Field
            label="任务类型"
            value={`${currentTaskType.icon} ${currentTaskType.label}`}
            placeholder="请选择任务类型"
            required
            readOnly
            rightIcon={<Arrow />}
            onClick={() => setShowTypePicker(true)}
          />

          {/* 任务标题 */}
          <Field
            label="任务标题"
            value={formData.title}
            onChange={(value) => updateFormData({ title: value })}
            placeholder="请输入任务标题"
            required
          />

          {/* 任务描述 */}
          <Field
            label="任务描述"
            value={formData.description}
            onChange={(value) => updateFormData({ description: value })}
            placeholder="请输入任务描述"
            type="textarea"
            rows={3}
          />

          {/* 截止日期 */}
          <Field
            label="截止日期"
            value={formatDisplayDate(formData.dueDate)}
            placeholder="请选择截止日期"
            required
            readOnly
            rightIcon={<CalendarO />}
            onClick={() => setShowDatePicker(true)}
          />

          {/* 优先级 */}
          <Field
            label="优先级"
            value={currentPriority.label}
            placeholder="请选择优先级"
            required
            readOnly
            rightIcon={<Arrow />}
            onClick={() => setShowPriorityPicker(true)}
          />
        </Form>

        {/* 快速填充按钮 */}
        {currentPlant && (
          <div className={styles.quickFillSection}>
            <h3 className={styles.quickFillTitle}>快速创建</h3>
            <div className={styles.quickFillButtons}>
              {taskTypes.map((type) => (
                <Button
                  key={type.value}
                  size="small"
                  onClick={() =>
                    handleQuickFill(type.value as CareTask["type"])
                  }
                  className={styles.quickFillButton}
                >
                  {type.icon} {type.label}
                </Button>
              ))}
            </div>
          </div>
        )}
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
          onConfirm={handlePrioritySelect}
          onCancel={() => setShowPriorityPicker(false)}
        />
      </Popup>

      {/* 日期选择器 */}
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

export default AddCareTask;
