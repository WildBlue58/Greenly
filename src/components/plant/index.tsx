import React, { useState, useCallback, useMemo } from "react";
import { Image, Tag, Popup, Form, Field } from "react-vant";
import { Plus, Edit, Delete, PhotoO } from "@react-vant/icons";
import {
  Button as CustomButton,
  Loading,
  Empty,
  // showToast, // 暂时注释掉，使用 alert 替代
} from "../common";
import styles from "./plant.module.css";

// 植物类型定义
interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  health: "excellent" | "good" | "fair" | "poor";
  lastWatered: string;
  nextWatering: string;
  location: string;
  notes?: string;
  createdAt: string;
}

// PlantCard 组件
interface PlantCardProps {
  plant: Plant;
  onClick?: (plant: Plant) => void;
  onEdit?: (plant: Plant) => void;
  onDelete?: (plant: Plant) => void;
  className?: string;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onClick,
  onEdit,
  onDelete,
  className = "",
}) => {
  const handleClick = useCallback(() => {
    onClick?.(plant);
  }, [onClick, plant]);

  const handleEdit = useCallback(() => {
    onEdit?.(plant);
  }, [onEdit, plant]);

  const handleDelete = useCallback(() => {
    onDelete?.(plant);
  }, [onDelete, plant]);

  const healthColor = useMemo(() => {
    switch (plant.health) {
      case "excellent":
        return "success";
      case "good":
        return "primary";
      case "fair":
        return "warning";
      case "poor":
        return "danger";
      default:
        return "primary";
    }
  }, [plant.health]);

  const healthText = useMemo(() => {
    switch (plant.health) {
      case "excellent":
        return "优秀";
      case "good":
        return "良好";
      case "fair":
        return "一般";
      case "poor":
        return "较差";
      default:
        return "未知";
    }
  }, [plant.health]);

  return (
    <div className={`${styles.plantCard} ${className}`} onClick={handleClick}>
      <div className={styles.cardImage}>
        <Image
          src={plant.image}
          width="100%"
          height="200px"
          fit="cover"
          radius={8}
        />
        <div className={styles.cardActions}>
          <CustomButton
            size="small"
            onClick={handleEdit}
            className={styles.actionButton}
          >
            <Edit />
          </CustomButton>
          <CustomButton
            size="small"
            type="danger"
            onClick={handleDelete}
            className={styles.actionButton}
          >
            <Delete />
          </CustomButton>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.plantName}>{plant.name}</h3>
          <Tag type={healthColor}>{healthText}</Tag>
        </div>

        <p className={styles.plantSpecies}>{plant.species}</p>

        <div className={styles.cardInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>位置:</span>
            <span className={styles.infoValue}>{plant.location}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>上次浇水:</span>
            <span className={styles.infoValue}>{plant.lastWatered}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>下次浇水:</span>
            <span className={styles.infoValue}>{plant.nextWatering}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// PlantList 组件
interface PlantListProps {
  plants: Plant[];
  loading?: boolean;
  onPlantClick?: (plant: Plant) => void;
  onAddPlant?: () => void;
  onEditPlant?: (plant: Plant) => void;
  onDeletePlant?: (plant: Plant) => void;
  className?: string;
}

export const PlantList: React.FC<PlantListProps> = ({
  plants,
  loading = false,
  onPlantClick,
  onAddPlant,
  onEditPlant,
  onDeletePlant,
  className = "",
}) => {
  if (loading) {
    return <Loading visible={true} text="加载植物中..." />;
  }

  if (plants.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Empty text="暂无植物" image="/images/empty-plants.png" />
        <CustomButton
          type="primary"
          onClick={onAddPlant}
          className={styles.addButton}
        >
          <Plus />
          添加第一个植物
        </CustomButton>
      </div>
    );
  }

  return (
    <div className={`${styles.plantList} ${className}`}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>我的植物 ({plants.length})</h2>
        <CustomButton
          type="primary"
          size="small"
          onClick={onAddPlant}
          className={styles.addButton}
        >
          <Plus />
          添加植物
        </CustomButton>
      </div>

      <div className={styles.listGrid}>
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onClick={onPlantClick}
            onEdit={onEditPlant}
            onDelete={onDeletePlant}
            className={styles.listItem}
          />
        ))}
      </div>
    </div>
  );
};

// PlantDetail 组件
interface PlantDetailProps {
  plant: Plant;
  onEdit?: (plant: Plant) => void;
  onDelete?: (plant: Plant) => void;
  onWater?: (plant: Plant) => void;
  className?: string;
}

export const PlantDetail: React.FC<PlantDetailProps> = ({
  plant,
  onEdit,
  onDelete,
  onWater,
  className = "",
}) => {
  const handleWater = useCallback(() => {
    onWater?.(plant);
  }, [onWater, plant]);

  return (
    <div className={`${styles.plantDetail} ${className}`}>
      <div className={styles.detailImage}>
        <Image
          src={plant.image}
          width="100%"
          height="300px"
          fit="cover"
          radius={12}
        />
      </div>

      <div className={styles.detailContent}>
        <div className={styles.detailHeader}>
          <div className={styles.detailTitle}>
            <h1 className={styles.detailName}>{plant.name}</h1>
            <p className={styles.detailSpecies}>{plant.species}</p>
          </div>
          <div className={styles.detailActions}>
            <CustomButton
              size="small"
              onClick={() => onEdit?.(plant)}
              className={styles.detailAction}
            >
              <Edit />
            </CustomButton>
            <CustomButton
              size="small"
              type="danger"
              onClick={() => onDelete?.(plant)}
              className={styles.detailAction}
            >
              <Delete />
            </CustomButton>
          </div>
        </div>

        <div className={styles.detailInfo}>
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>基本信息</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>健康状态:</span>
                <Tag
                  type={plant.health === "excellent" ? "success" : "primary"}
                >
                  {plant.health === "excellent" ? "优秀" : "良好"}
                </Tag>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>位置:</span>
                <span className={styles.infoValue}>{plant.location}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>添加时间:</span>
                <span className={styles.infoValue}>{plant.createdAt}</span>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>浇水记录</h3>
            <div className={styles.wateringInfo}>
              <div className={styles.wateringItem}>
                <span className={styles.wateringLabel}>上次浇水:</span>
                <span className={styles.wateringValue}>
                  {plant.lastWatered}
                </span>
              </div>
              <div className={styles.wateringItem}>
                <span className={styles.wateringLabel}>下次浇水:</span>
                <span className={styles.wateringValue}>
                  {plant.nextWatering}
                </span>
              </div>
            </div>
            <CustomButton
              type="primary"
              onClick={handleWater}
              className={styles.waterButton}
            >
              记录浇水
            </CustomButton>
          </div>

          {plant.notes && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>备注</h3>
              <p className={styles.notes}>{plant.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PlantForm 组件
interface PlantFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (plantData: Partial<Plant>) => void;
  plant?: Plant;
  loading?: boolean;
  className?: string;
}

export const PlantForm: React.FC<PlantFormProps> = ({
  visible,
  onClose,
  onSubmit,
  plant,
  loading = false,
  className = "",
}) => {
  const [formData, setFormData] = useState({
    name: plant?.name || "",
    species: plant?.species || "",
    location: plant?.location || "",
    notes: plant?.notes || "",
    image: plant?.image || "",
  });

  const handleSubmit = useCallback(() => {
    if (!formData.name.trim()) {
      alert("请输入植物名称");
      return;
    }
    if (!formData.species.trim()) {
      alert("请输入植物品种");
      return;
    }
    if (!formData.location.trim()) {
      alert("请输入植物位置");
      return;
    }

    onSubmit(formData);
  }, [formData, onSubmit]);

  const handleImageUpload = useCallback((file: File) => {
    // 这里应该调用上传API
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        image: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

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
            {plant ? "编辑植物" : "添加植物"}
          </h2>
        </div>

        <Form className={styles.form}>
          <div className={styles.imageUpload}>
            <div className={styles.uploadArea}>
              {formData.image ? (
                <Image
                  src={formData.image}
                  width="100%"
                  height="200px"
                  fit="cover"
                  radius={8}
                />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <PhotoO />
                  <span>点击上传图片</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className={styles.fileInput}
              />
            </div>
          </div>

          <Field
            label="植物名称"
            value={formData.name}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
            placeholder="请输入植物名称"
            required
          />

          <Field
            label="植物品种"
            value={formData.species}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, species: value }))
            }
            placeholder="请输入植物品种"
            required
          />

          <Field
            label="位置"
            value={formData.location}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, location: value }))
            }
            placeholder="请输入植物位置"
            required
          />

          <Field
            label="备注"
            value={formData.notes}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, notes: value }))
            }
            placeholder="请输入备注信息"
            type="textarea"
            rows={3}
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
            {plant ? "更新" : "添加"}
          </CustomButton>
        </div>
      </div>
    </Popup>
  );
};

// PlantRecognition 组件
interface PlantRecognitionProps {
  onRecognize: (image: File) => void;
  loading?: boolean;
  className?: string;
}

export const PlantRecognition: React.FC<PlantRecognitionProps> = ({
  onRecognize,
  loading = false,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRecognize = useCallback(() => {
    if (selectedImage) {
      onRecognize(selectedImage);
    }
  }, [selectedImage, onRecognize]);

  return (
    <div className={`${styles.recognition} ${className}`}>
      <div className={styles.recognitionHeader}>
        <h2 className={styles.recognitionTitle}>植物识别</h2>
        <p className={styles.recognitionDesc}>
          拍照或上传图片，AI将帮您识别植物品种
        </p>
      </div>

      <div className={styles.recognitionArea}>
        {previewUrl ? (
          <div className={styles.previewContainer}>
            <Image
              src={previewUrl}
              width="100%"
              height="300px"
              fit="cover"
              radius={12}
            />
            <div className={styles.previewActions}>
              <CustomButton
                type="primary"
                onClick={handleRecognize}
                loading={loading}
                disabled={!selectedImage}
              >
                开始识别
              </CustomButton>
              <CustomButton
                type="default"
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl("");
                }}
              >
                重新选择
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className={styles.uploadArea}>
            <div className={styles.uploadPlaceholder}>
              <PhotoO />
              <span>点击拍照或选择图片</span>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
              className={styles.fileInput}
            />
          </div>
        )}
      </div>
    </div>
  );
};
