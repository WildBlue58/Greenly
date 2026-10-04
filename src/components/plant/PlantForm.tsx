import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CellGroup, Field, Picker, Popup, Toast } from "react-vant";
import { ArrowLeft, PhotoO } from "@react-vant/icons";
import type { Plant } from "../../store/types";
import styles from "./PlantForm.module.css";

/** 表单可编辑的植物字段集合 */
export interface PlantFormValues {
  name: string;
  species: string;
  location: string;
  wateringFrequency: number;
  description: string;
  image: string;
  careLevel: NonNullable<Plant["careLevel"]>;
  lightNeeds: NonNullable<Plant["lightNeeds"]>;
  waterNeeds: NonNullable<Plant["waterNeeds"]>;
  temperatureMin: number;
  temperatureMax: number;
  humidity: number;
  careTips: string[];
  status: Plant["status"];
}

interface PlantFormProps {
  title: string;
  submitText: string;
  /** 编辑模式下传入现有植物；添加模式不传 */
  initialValues?: Plant;
  /** 提交回调：抛出异常时组件统一 toast 失败提示 */
  onSubmit: (values: PlantFormValues) => Promise<void> | void;
}

const LOCATION_OPTIONS = ["客厅", "卧室", "阳台", "书房", "厨房", "卫生间"];

const WATERING_OPTIONS = [
  { label: "每天浇水", value: 1 },
  { label: "每2天浇水", value: 2 },
  { label: "每3天浇水", value: 3 },
  { label: "每周浇水", value: 7 },
  { label: "每2周浇水", value: 14 },
  { label: "每月浇水", value: 30 },
];

const STATUS_OPTIONS = [
  { label: "健康", value: "healthy" },
  { label: "需要养护", value: "needs_care" },
  { label: "生病", value: "sick" },
] as const;

const CARE_LEVEL_OPTIONS = [
  { label: "简单", value: "easy" },
  { label: "中等", value: "medium" },
  { label: "困难", value: "hard" },
] as const;

const LIGHT_OPTIONS = [
  { label: "低光照", value: "low" },
  { label: "中等光照", value: "medium" },
  { label: "高光照", value: "high" },
] as const;

const WATER_NEED_OPTIONS = [
  { label: "少浇水", value: "low" },
  { label: "适中浇水", value: "medium" },
  { label: "多浇水", value: "high" },
] as const;

const DEFAULT_CARE_TIPS = [
  "保持土壤适度湿润",
  "提供适当的光照",
  "定期检查植物状态",
];

/** 通用选择字段：只读 Field + 底部弹出 Picker */
interface PickerFieldProps<T extends string | number> {
  label: string;
  title: string;
  value: T;
  options: readonly { label: string; value: T }[];
  onChange: (value: T) => void;
}

function PickerField<T extends string | number>({
  label,
  title,
  value,
  options,
  onChange,
}: PickerFieldProps<T>) {
  const [visible, setVisible] = useState(false);
  const current = options.find((option) => option.value === value);

  return (
    <>
      <Field
        label={label}
        placeholder="请选择"
        value={current?.label ?? ""}
        readOnly
        isLink
        onClick={() => setVisible(true)}
        required
      />
      <Popup visible={visible} position="bottom" onClose={() => setVisible(false)}>
        <Picker
          title={title}
          columns={[options.map((option) => ({ text: option.label, value: String(option.value) }))]}
          value={String(value)}
          onConfirm={(selected: string) => {
            const matched = options.find(
              (option) => String(option.value) === selected
            );
            if (matched) {
              onChange(matched.value);
            }
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        />
      </Popup>
    </>
  );
}

/**
 * 植物添加/编辑共用表单。
 * 页面只提供标题、初始值与提交回调，字段渲染与校验全部收敛在此。
 */
export const PlantForm: React.FC<PlantFormProps> = ({
  title,
  submitText,
  initialValues,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PlantFormValues>(() => ({
    name: initialValues?.name ?? "",
    species: initialValues?.species ?? "",
    location: initialValues?.location ?? "客厅",
    wateringFrequency: initialValues?.wateringFrequency ?? 7,
    description: initialValues?.description ?? initialValues?.notes ?? "",
    image: initialValues?.image ?? "",
    careLevel: initialValues?.careLevel ?? "easy",
    lightNeeds: initialValues?.lightNeeds ?? "medium",
    waterNeeds: initialValues?.waterNeeds ?? "medium",
    temperatureMin: initialValues?.temperature?.min ?? 15,
    temperatureMax: initialValues?.temperature?.max ?? 30,
    humidity: initialValues?.humidity ?? 60,
    careTips: initialValues?.careTips ?? DEFAULT_CARE_TIPS,
    status: initialValues?.status ?? "healthy",
  }));
  const [submitting, setSubmitting] = useState(false);

  const updateField = useCallback(
    (field: keyof PlantFormValues, value: string | number | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCareTipChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      careTips: prev.careTips.map((tip, i) => (i === index ? value : tip)),
    }));
  };

  const addCareTip = () => {
    setFormData((prev) => ({ ...prev, careTips: [...prev.careTips, ""] }));
  };

  const removeCareTip = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      careTips: prev.careTips.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
    // 允许连续选择同一文件
    event.target.value = "";
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Toast.fail("请输入植物名称");
      return;
    }
    if (!formData.species.trim()) {
      Toast.fail("请输入植物种类");
      return;
    }
    if (!formData.location) {
      Toast.fail("请选择植物位置");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        species: formData.species.trim(),
        description: formData.description.trim(),
        careTips: formData.careTips.filter((tip) => tip.trim()),
      });
    } catch (error) {
      console.error("保存植物失败:", error);
      Toast.fail("保存失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.plantForm}>
      {/* 头部 */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeft />}
          className={styles.backButton}
          onClick={() => navigate(-1)}
        />
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.placeholder} />
      </div>

      {/* 表单内容 */}
      <div className={styles.content}>
        {/* 植物图片上传 */}
        <Card className={styles.imageCard}>
          <div className={styles.imageSection}>
            <h3 className={styles.sectionTitle}>植物照片</h3>
            <label className={styles.uploader}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {formData.image ? (
                <div className={styles.uploadPlaceholder}>
                  <img
                    src={formData.image}
                    alt="植物照片"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <p>点击更换照片</p>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <PhotoO />
                  <p>点击上传植物照片</p>
                </div>
              )}
            </label>
          </div>
        </Card>

        {/* 基本信息 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>基本信息</h3>
          <CellGroup>
            <Field
              label="植物名称"
              placeholder="请输入植物名称"
              value={formData.name}
              onChange={(value) => updateField("name", value)}
              required
            />
            <Field
              label="植物种类"
              placeholder="请输入植物种类"
              value={formData.species}
              onChange={(value) => updateField("species", value)}
              required
            />
            <PickerField
              label="放置位置"
              title="选择位置"
              value={formData.location}
              options={LOCATION_OPTIONS.map((location) => ({
                label: location,
                value: location,
              }))}
              onChange={(value) => updateField("location", value)}
            />
            <PickerField
              label="浇水频率"
              title="选择浇水频率"
              value={formData.wateringFrequency}
              options={WATERING_OPTIONS}
              onChange={(value) => updateField("wateringFrequency", value)}
            />
          </CellGroup>
        </Card>

        {/* 养护信息 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>养护信息</h3>
          <CellGroup>
            <PickerField
              label="植物状态"
              title="选择植物状态"
              value={formData.status}
              options={STATUS_OPTIONS}
              onChange={(value) => updateField("status", value)}
            />
            <PickerField
              label="养护难度"
              title="选择养护难度"
              value={formData.careLevel}
              options={CARE_LEVEL_OPTIONS}
              onChange={(value) => updateField("careLevel", value)}
            />
            <PickerField
              label="光照需求"
              title="选择光照需求"
              value={formData.lightNeeds}
              options={LIGHT_OPTIONS}
              onChange={(value) => updateField("lightNeeds", value)}
            />
            <PickerField
              label="浇水需求"
              title="选择浇水需求"
              value={formData.waterNeeds}
              options={WATER_NEED_OPTIONS}
              onChange={(value) => updateField("waterNeeds", value)}
            />
            <Field
              label="最低温度"
              type="number"
              placeholder="请输入最低温度"
              value={formData.temperatureMin.toString()}
              onChange={(value) =>
                updateField("temperatureMin", Number(value) || 0)
              }
              required
            />
            <Field
              label="最高温度"
              type="number"
              placeholder="请输入最高温度"
              value={formData.temperatureMax.toString()}
              onChange={(value) =>
                updateField("temperatureMax", Number(value) || 0)
              }
              required
            />
            <Field
              label="湿度要求"
              type="number"
              placeholder="请输入湿度百分比"
              value={formData.humidity.toString()}
              onChange={(value) => updateField("humidity", Number(value) || 0)}
              required
            />
          </CellGroup>
        </Card>

        {/* 养护技巧 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>养护技巧</h3>
          <CellGroup>
            {formData.careTips.map((tip, index) => (
              <Field
                key={index}
                label={`技巧 ${index + 1}`}
                placeholder="请输入养护技巧"
                value={tip}
                onChange={(value) => handleCareTipChange(index, value)}
                rightIcon={
                  formData.careTips.length > 1 ? (
                    <Button
                      size="mini"
                      type="danger"
                      onClick={() => removeCareTip(index)}
                    >
                      删除
                    </Button>
                  ) : undefined
                }
              />
            ))}
            <Button
              type="primary"
              size="small"
              onClick={addCareTip}
              style={{ margin: "16px" }}
            >
              添加技巧
            </Button>
          </CellGroup>
        </Card>

        {/* 植物描述 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>植物描述</h3>
          <CellGroup>
            <Field
              label="备注信息"
              type="textarea"
              placeholder="添加一些关于这株植物的描述..."
              value={formData.description}
              onChange={(value) => updateField("description", value)}
              autoSize={{ minHeight: 80 }}
              maxLength={200}
              showWordLimit
            />
          </CellGroup>
        </Card>

        {/* 提交按钮 */}
        <div className={styles.submitSection}>
          <Button
            type="primary"
            size="large"
            className={styles.submitButton}
            loading={submitting}
            onClick={handleSubmit}
          >
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlantForm;
