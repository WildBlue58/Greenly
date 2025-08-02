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
} from "react-vant";
import { ArrowLeft, PhotoO } from "@react-vant/icons";
import { useStore } from "../../../store";
// import { showToast } from "../../../components/common"; // 暂时注释掉，使用 alert 替代
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
    // 养护信息
    careLevel: "easy" as "easy" | "medium" | "hard",
    lightNeeds: "medium" as "low" | "medium" | "high",
    waterNeeds: "medium" as "low" | "medium" | "high",
    temperatureMin: 15,
    temperatureMax: 30,
    humidity: 60,
    careTips: [""] as string[],
    status: "healthy" as "healthy" | "needs_care" | "sick",
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showCareLevelPicker, setShowCareLevelPicker] = useState(false);
  const [showLightPicker, setShowLightPicker] = useState(false);
  const [showWaterPicker, setShowWaterPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const locationOptions = [["客厅", "卧室", "阳台", "书房", "厨房", "卫生间"]];

  const frequencyOptions = [
    ["每天浇水", "每2天浇水", "每3天浇水", "每周浇水", "每2周浇水", "每月浇水"],
  ];

  const frequencyValues = [1, 2, 3, 7, 14, 30];

  const careLevelOptions = [["简单", "中等", "困难"]];
  const careLevelValues = ["easy", "medium", "hard"];

  const lightOptions = [["低光照", "中等光照", "高光照"]];
  const lightValues = ["low", "medium", "high"];

  const waterOptions = [["少浇水", "适中浇水", "多浇水"]];
  const waterValues = ["low", "medium", "high"];

  const statusOptions = [["健康", "需要养护", "生病"]];
  const statusValues = ["healthy", "needs_care", "sick"];

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
          careLevel: plant.careLevel || "easy",
          lightNeeds: plant.lightNeeds || "medium",
          waterNeeds: plant.waterNeeds || "medium",
          temperatureMin: plant.temperature?.min || 15,
          temperatureMax: plant.temperature?.max || 30,
          humidity: plant.humidity || 60,
          careTips: plant.careTips || [
            "保持土壤适度湿润",
            "提供适当的光照",
            "定期检查植物状态",
          ],
          status: plant.status || "healthy",
        });
        setLoading(false);
      } else {
        alert("植物不存在");
        navigate("/plant/list");
      }
    } else if (plants.length === 0) {
      // 如果植物数据还未加载，等待一下
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [id, plants, navigate]);

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCareTipChange = (index: number, value: string) => {
    const newTips = [...formData.careTips];
    newTips[index] = value;
    setFormData((prev) => ({
      ...prev,
      careTips: newTips,
    }));
  };

  const addCareTip = () => {
    setFormData((prev) => ({
      ...prev,
      careTips: [...prev.careTips, ""],
    }));
  };

  const removeCareTip = (index: number) => {
    const newTips = formData.careTips.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      careTips: newTips,
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
      alert("请输入植物名称");
      return false;
    }
    if (!formData.species.trim()) {
      alert("请输入植物种类");
      return false;
    }
    if (!formData.location.trim()) {
      alert("请选择放置位置");
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
        // 养护信息
        careLevel: formData.careLevel,
        lightNeeds: formData.lightNeeds,
        waterNeeds: formData.waterNeeds,
        temperature: {
          min: formData.temperatureMin,
          max: formData.temperatureMax,
        },
        humidity: formData.humidity,
        careTips: formData.careTips.filter((tip) => tip.trim()),
        status: formData.status,
        updatedAt: new Date().toISOString(),
      };

      // 更新植物信息
      updatePlant && updatePlant(id!, updatedPlant);

      alert("植物信息更新成功！");
      navigate(`/plant/detail/${id}`);
    } catch (error) {
      console.error("更新植物失败:", error);
      alert("更新植物失败，请重试");
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

        {/* 养护信息 */}
        <Card className={styles.formCard}>
          <h3 className={styles.sectionTitle}>养护信息</h3>
          <CellGroup>
            <Field
              label="植物状态"
              placeholder="请选择植物状态"
              value={
                statusOptions[0][statusValues.indexOf(formData.status)] || ""
              }
              readOnly
              isLink
              onClick={() => setShowStatusPicker(true)}
              required
            />
            <Field
              label="养护难度"
              placeholder="请选择养护难度"
              value={
                careLevelOptions[0][
                  careLevelValues.indexOf(formData.careLevel)
                ] || ""
              }
              readOnly
              isLink
              onClick={() => setShowCareLevelPicker(true)}
              required
            />
            <Field
              label="光照需求"
              placeholder="请选择光照需求"
              value={
                lightOptions[0][lightValues.indexOf(formData.lightNeeds)] || ""
              }
              readOnly
              isLink
              onClick={() => setShowLightPicker(true)}
              required
            />
            <Field
              label="浇水需求"
              placeholder="请选择浇水需求"
              value={
                waterOptions[0][waterValues.indexOf(formData.waterNeeds)] || ""
              }
              readOnly
              isLink
              onClick={() => setShowWaterPicker(true)}
              required
            />
            <Field
              label="最低温度"
              type="number"
              placeholder="请输入最低温度"
              value={formData.temperatureMin.toString()}
              onChange={(value) =>
                handleInputChange("temperatureMin", Number(value))
              }
              required
            />
            <Field
              label="最高温度"
              type="number"
              placeholder="请输入最高温度"
              value={formData.temperatureMax.toString()}
              onChange={(value) =>
                handleInputChange("temperatureMax", Number(value))
              }
              required
            />
            <Field
              label="湿度要求"
              type="number"
              placeholder="请输入湿度百分比"
              value={formData.humidity.toString()}
              onChange={(value) => handleInputChange("humidity", Number(value))}
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

      {/* 植物状态选择器 */}
      <Popup
        visible={showStatusPicker}
        position="bottom"
        onClose={() => setShowStatusPicker(false)}
      >
        <Picker
          title="选择植物状态"
          columns={statusOptions}
          onConfirm={(values: any) => {
            const selectedIndex = statusOptions[0].indexOf(values[0]);
            const statusValue = statusValues[selectedIndex];
            handleInputChange("status", statusValue);
            setShowStatusPicker(false);
          }}
          onCancel={() => setShowStatusPicker(false)}
        />
      </Popup>

      {/* 养护难度选择器 */}
      <Popup
        visible={showCareLevelPicker}
        position="bottom"
        onClose={() => setShowCareLevelPicker(false)}
      >
        <Picker
          title="选择养护难度"
          columns={careLevelOptions}
          onConfirm={(values: any) => {
            const selectedIndex = careLevelOptions[0].indexOf(values[0]);
            const careLevelValue = careLevelValues[selectedIndex];
            handleInputChange("careLevel", careLevelValue);
            setShowCareLevelPicker(false);
          }}
          onCancel={() => setShowCareLevelPicker(false)}
        />
      </Popup>

      {/* 光照需求选择器 */}
      <Popup
        visible={showLightPicker}
        position="bottom"
        onClose={() => setShowLightPicker(false)}
      >
        <Picker
          title="选择光照需求"
          columns={lightOptions}
          onConfirm={(values: any) => {
            const selectedIndex = lightOptions[0].indexOf(values[0]);
            const lightValue = lightValues[selectedIndex];
            handleInputChange("lightNeeds", lightValue);
            setShowLightPicker(false);
          }}
          onCancel={() => setShowLightPicker(false)}
        />
      </Popup>

      {/* 浇水需求选择器 */}
      <Popup
        visible={showWaterPicker}
        position="bottom"
        onClose={() => setShowWaterPicker(false)}
      >
        <Picker
          title="选择浇水需求"
          columns={waterOptions}
          onConfirm={(values: any) => {
            const selectedIndex = waterOptions[0].indexOf(values[0]);
            const waterValue = waterValues[selectedIndex];
            handleInputChange("waterNeeds", waterValue);
            setShowWaterPicker(false);
          }}
          onCancel={() => setShowWaterPicker(false)}
        />
      </Popup>
    </div>
  );
};

export default EditPlant;
