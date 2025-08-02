import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Field,
  CellGroup,
  Uploader,
  Picker,
  Popup,
} from "react-vant";
import { ArrowLeft, PhotoO } from "@react-vant/icons";
import { useStore } from "../../../store";
// import { showToast } from "../../../components/common"; // 暂时注释掉，使用 alert 替代
import styles from "./add.module.css";

const AddPlant: React.FC = () => {
  const navigate = useNavigate();
  const { addPlant } = useStore() as any;

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    location: "",
    wateringFrequency: 7,
    description: "",
    image: "",
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);

  const locationOptions = ["客厅", "卧室", "阳台", "书房", "厨房", "卫生间"];

  const frequencyOptions = [
    "每天浇水",
    "每2天浇水",
    "每3天浇水",
    "每周浇水",
    "每2周浇水",
    "每月浇水",
  ];

  const frequencyValues = [1, 2, 3, 7, 14, 30];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: any) => {
    if (files.length > 0) {
      const file = files[0];
      const fileObject = file.file || file;

      if (fileObject) {
        // 将图片转换为base64格式存储，确保持久化
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            image: base64,
          }));
        };
        reader.readAsDataURL(fileObject);
      }
    }
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.name.trim()) {
      alert("请输入植物名称");
      return;
    }

    if (!formData.species.trim()) {
      alert("请输入植物种类");
      return;
    }

    if (!formData.location) {
      alert("请选择植物位置");
      return;
    }

    try {
      // 构造新植物数据
      const newPlant = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        species: formData.species.trim(),
        location: formData.location,
        wateringFrequency: formData.wateringFrequency,
        description: formData.description.trim(),
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
        status: "healthy",
        health: "good",
        lastWatered: new Date().toISOString(),
        nextWatering: new Date(
          Date.now() + (formData.wateringFrequency || 7) * 24 * 60 * 60 * 1000
        ).toISOString(),
        notes: formData.description,
        // 默认养护信息
        careLevel: "easy",
        lightNeeds: "medium",
        waterNeeds: "medium",
        temperature: { min: 15, max: 30 },
        humidity: 60,
        careTips: ["保持土壤适度湿润", "提供适当的光照", "定期检查植物状态"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 添加植物到store
      await addPlant(newPlant);

      alert("植物添加成功！");
      navigate("/plant/list");
    } catch (error) {
      console.error("添加植物失败:", error);
      alert("添加植物失败，请重试");
    }
  };

  return (
    <div className={styles.addPlant}>
      {/* 头部 */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeft />}
          className={styles.backButton}
          onClick={() => navigate(-1)}
        />
        <h1 className={styles.title}>添加植物</h1>
        <div className={styles.placeholder} />
      </div>

      {/* 表单内容 */}
      <div className={styles.content}>
        {/* 植物图片上传 */}
        <Card className={styles.imageCard}>
          <div className={styles.imageSection}>
            <h3 className={styles.sectionTitle}>植物照片</h3>
            <Uploader
              maxCount={1}
              onChange={handleImageUpload}
              className={styles.uploader}
            >
              <div className={styles.uploadPlaceholder}>
                <PhotoO />
                <p>点击上传植物照片</p>
              </div>
            </Uploader>
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
              onChange={(value) => handleInputChange("name", value)}
              required
            />
            <Field
              label="植物种类"
              placeholder="请输入植物种类"
              value={formData.species}
              onChange={(value) => handleInputChange("species", value)}
              required
            />
            <Field
              label="放置位置"
              placeholder="请选择位置"
              value={formData.location}
              readOnly
              isLink
              onClick={() => setShowLocationPicker(true)}
              required
            />
            <Field
              label="浇水频率"
              placeholder="请选择浇水频率"
              value={
                frequencyOptions[
                  frequencyValues.indexOf(formData.wateringFrequency)
                ] || ""
              }
              readOnly
              isLink
              onClick={() => setShowFrequencyPicker(true)}
              required
            />
          </CellGroup>
        </Card>

        {/* 植物描述 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>植物描述</h3>
          <CellGroup>
            <Field
              label="备注信息"
              placeholder="添加一些关于这株植物的描述..."
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              type="textarea"
              rows={3}
            />
          </CellGroup>
        </Card>

        {/* 提交按钮 */}
        <div className={styles.submitSection}>
          <Button
            type="primary"
            size="large"
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            添加植物
          </Button>
        </div>
      </div>

      {/* 位置选择器 */}
      <Popup
        visible={showLocationPicker}
        position="bottom"
        onClose={() => setShowLocationPicker(false)}
      >
        <Picker
          title="选择位置"
          columns={locationOptions}
          onConfirm={(values: any) => {
            handleInputChange("location", values[0]);
            setShowLocationPicker(false);
          }}
          onCancel={() => setShowLocationPicker(false)}
        />
      </Popup>

      {/* 浇水频率选择器 */}
      <Popup
        visible={showFrequencyPicker}
        position="bottom"
        onClose={() => setShowFrequencyPicker(false)}
      >
        <Picker
          title="选择浇水频率"
          columns={frequencyOptions}
          onConfirm={(values: any) => {
            const selectedIndex = frequencyOptions[0].indexOf(values[0]);
            const frequencyValue = frequencyValues[selectedIndex];
            handleInputChange("wateringFrequency", frequencyValue);
            setShowFrequencyPicker(false);
          }}
          onCancel={() => setShowFrequencyPicker(false)}
        />
      </Popup>
    </div>
  );
};

export default AddPlant;
