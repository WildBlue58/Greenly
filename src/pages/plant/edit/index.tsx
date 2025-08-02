import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Field,
  CellGroup,
  Uploader,
  Picker,
  Popup,
  Toast,
} from "react-vant";
import { ArrowLeft, PhotoO } from "@react-vant/icons";
import { useStore } from "../../../store";
import styles from "./edit.module.css";

const EditPlant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, updatePlant } = useStore() as any;

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
  const [loading, setLoading] = useState(true);

  const locationOptions = [["客厅", "卧室", "阳台", "书房", "厨房", "卫生间"]];

  const frequencyOptions = [
    ["每天浇水", "每2天浇水", "每3天浇水", "每周浇水", "每2周浇水", "每月浇水"],
  ];

  const frequencyValues = [1, 2, 3, 7, 14, 30];

  useEffect(() => {
    // 根据ID从store中获取植物数据
    if (id && plants.length > 0) {
      const plant = plants.find((p: any) => p.id === id);
      if (plant) {
        setFormData({
          name: plant.name || "",
          species: plant.species || "",
          location: plant.location || "",
          wateringFrequency: plant.wateringFrequency || 7,
          description: plant.description || plant.notes || "",
          image: plant.image || "",
        });
        setLoading(false);
      } else {
        Toast.fail("植物不存在");
        navigate("/plant/list");
      }
    } else if (plants.length === 0) {
      // 如果植物数据还未加载，等待一下
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [id, plants, navigate]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: any[]) => {
    if (files.length > 0) {
      const file = files[0];
      const fileObject = file.file || file;

      if (fileObject) {
        // 将图片转换为base64格式存储，确保持久化
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          handleInputChange("image", base64);
        };
        reader.readAsDataURL(fileObject);
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Toast.fail("请输入植物名称");
      return false;
    }
    if (!formData.species.trim()) {
      Toast.fail("请输入植物种类");
      return false;
    }
    if (!formData.location.trim()) {
      Toast.fail("请选择放置位置");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updatedPlant = {
        id: id!,
        name: formData.name.trim(),
        species: formData.species.trim(),
        location: formData.location,
        wateringFrequency: formData.wateringFrequency,
        description: formData.description.trim(),
        notes: formData.description.trim(),
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
        updatedAt: new Date().toISOString(),
      };

      // 更新植物信息
      updatePlant && updatePlant(id!, updatedPlant);

      Toast.success("植物信息更新成功！");
      navigate(`/plant/detail/${id}`);
    } catch (error) {
      console.error("更新植物失败:", error);
      Toast.fail("更新植物失败，请重试");
    }
  };

  if (loading) {
    return (
      <div className={styles.editPlant}>
        <div className={styles.header}>
          <Button
            icon={<ArrowLeft />}
            className={styles.backButton}
            onClick={() => navigate(-1)}
          />
          <h1 className={styles.title}>编辑植物</h1>
          <div className={styles.placeholder} />
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingText}>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editPlant}>
      {/* 头部 */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeft />}
          className={styles.backButton}
          onClick={() => navigate(-1)}
        />
        <h1 className={styles.title}>编辑植物</h1>
        <div className={styles.placeholder} />
      </div>

      <div className={styles.content}>
        {/* 植物照片 */}
        <Card className={styles.imageCard}>
          <div className={styles.imageSection}>
            <h3 className={styles.sectionTitle}>植物照片</h3>
            <Uploader
              value={
                formData.image ? [{ url: formData.image, status: "done" }] : []
              }
              onChange={handleImageUpload}
              maxCount={1}
              accept="image/*"
              className={styles.uploader}
            >
              <div className={styles.uploadArea}>
                <PhotoO />
                <span className={styles.uploadText}>
                  {formData.image ? "更换照片" : "添加照片"}
                </span>
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
              placeholder="请选择放置位置"
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
                frequencyOptions[0][
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
              type="textarea"
              placeholder="添加一些关于这株植物的描述..."
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              autoSize={{ minHeight: 80 }}
              maxLength={200}
              showWordLimit
            />
          </CellGroup>
        </Card>

        {/* 保存按钮 */}
        <div className={styles.submitSection}>
          <Button
            type="primary"
            size="large"
            block
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            保存修改
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

export default EditPlant;
