import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Progress } from "react-vant";
import { ArrowLeft, Edit, Delete, StarO } from "@react-vant/icons";
import { useStore } from "../../../store";
import { useTitle } from "../../../hooks";
import { PlantImage } from "../../../components/common";
import type { Plant } from "../../../store/types";
import styles from "./detail.module.css";

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plants = useStore((s) => s.plants);
  const deletePlant = useStore((s) => s.deletePlant);

  // 设置页面标题
  useTitle();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // store 数据在启动时已同步恢复，直接按 id 查找
    const foundPlant = plants.find((p) => p.id === id);
    setPlant(foundPlant ?? null);
    setLoading(false);
  }, [id, plants]);

  const getStatusColor = (status: string) => {
    return status === "healthy" ? "#4CAF50" : "#FF9800";
  };

  const getStatusText = (status: string) => {
    return status === "healthy" ? "健康" : "需要养护";
  };

  const getCareLevelText = (level: string) => {
    switch (level) {
      case "easy":
        return "简单";
      case "medium":
        return "中等";
      case "hard":
        return "困难";
      default:
        return "未知";
    }
  };

  const getCareLevelColor = (level: string) => {
    switch (level) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "hard":
        return "#F44336";
      default:
        return "#999";
    }
  };

  const getLightText = (light: string) => {
    switch (light) {
      case "low":
        return "低光照";
      case "medium":
        return "中等光照";
      case "high":
        return "高光照";
      default:
        return "未知";
    }
  };

  const getWaterText = (water: string) => {
    switch (water) {
      case "low":
        return "少浇水";
      case "medium":
        return "适中浇水";
      case "high":
        return "多浇水";
      default:
        return "未知";
    }
  };

  const handleEdit = () => {
    navigate(`/plant/edit/${id}`);
  };

  const handleDelete = async () => {
    // 删除确认逻辑
    if (window.confirm("确定要删除这株植物吗？")) {
      try {
        await deletePlant(id!);
        navigate("/plant/list");
      } catch (error) {
        console.error("删除植物失败:", error);
        alert("删除失败，请重试");
      }
    }
  };

  const handleWater = () => {
    // 浇水逻辑
    alert("浇水成功！");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>加载中...</div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className={styles.error}>
        <div className={styles.errorText}>植物不存在</div>
        <Button onClick={() => navigate("/plant/list")}>返回列表</Button>
      </div>
    );
  }

  const daysUntilWatering = Math.ceil(
    (new Date(plant.nextWatering).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className={styles.plantDetail}>
      {/* 头部图片 */}
      <div className={styles.plantImage}>
        <PlantImage
          src={plant.image}
          alt={plant.name}
          width="100%"
          height="100%"
        />
        <div className={styles.imageOverlay}>
          <Button
            icon={<ArrowLeft />}
            className={styles.backButton}
            onClick={() => navigate(-1)}
          />
          <div className={styles.actionButtons}>
            <Button
              icon={<Edit />}
              className={styles.editButton}
              onClick={handleEdit}
            />
            <Button
              icon={<Delete />}
              className={styles.deleteButton}
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* 基本信息 */}
      <Card className={styles.infoCard}>
        <div className={styles.plantHeader}>
          <div className={styles.plantInfo}>
            <h1 className={styles.plantName}>{plant.name}</h1>
            <p className={styles.plantSpecies}>{plant.species}</p>
            <div className={styles.plantTags}>
              <Tag
                color={getStatusColor(plant.status)}
                className={styles.statusTag}
              >
                {getStatusText(plant.status)}
              </Tag>
              <Tag
                color={getCareLevelColor(plant.careLevel ?? "easy")}
                className={styles.levelTag}
              >
                {getCareLevelText(plant.careLevel ?? "easy")}养护
              </Tag>
            </div>
          </div>
        </div>

        <div className={styles.plantDescription}>
          <p>{plant.description}</p>
        </div>
      </Card>

      {/* 养护信息 */}
      <Card className={styles.careCard}>
        <h2 className={styles.cardTitle}>养护信息</h2>

        <div className={styles.careGrid}>
          <div className={styles.careItem}>
            <div className={styles.careIcon}>💧</div>
            <div className={styles.careInfo}>
              <div className={styles.careLabel}>浇水需求</div>
              <div className={styles.careValue}>
                {getWaterText(plant.waterNeeds ?? "medium")}
              </div>
            </div>
          </div>

          <div className={styles.careItem}>
            <div className={styles.careIcon}>☀️</div>
            <div className={styles.careInfo}>
              <div className={styles.careLabel}>光照需求</div>
              <div className={styles.careValue}>
                {getLightText(plant.lightNeeds ?? "medium")}
              </div>
            </div>
          </div>

          <div className={styles.careItem}>
            <div className={styles.careIcon}>🌡️</div>
            <div className={styles.careInfo}>
              <div className={styles.careLabel}>适宜温度</div>
              <div className={styles.careValue}>
                {plant.temperature?.min ?? 15}°C - {plant.temperature?.max ?? 30}°C
              </div>
            </div>
          </div>

          <div className={styles.careItem}>
            <div className={styles.careIcon}>
              <StarO />
            </div>
            <div className={styles.careInfo}>
              <div className={styles.careLabel}>湿度要求</div>
              <div className={styles.careValue}>{plant.humidity}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 浇水提醒 */}
      <Card className={styles.waterCard}>
        <div className={styles.waterHeader}>
          <h2 className={styles.cardTitle}>浇水提醒</h2>
          <Button
            type="primary"
            size="small"
            onClick={handleWater}
            className={styles.waterButton}
          >
            <span role="img" aria-label="water">
              💧
            </span>
            立即浇水
          </Button>
        </div>

        <div className={styles.waterInfo}>
          <div className={styles.waterItem}>
            <div className={styles.waterLabel}>上次浇水</div>
            <div className={styles.waterValue}>
              {new Date(plant.lastWatered).toLocaleDateString()}
            </div>
          </div>

          <div className={styles.waterItem}>
            <div className={styles.waterLabel}>下次浇水</div>
            <div className={styles.waterValue}>
              {new Date(plant.nextWatering).toLocaleDateString()}
            </div>
          </div>

          <div className={styles.waterItem}>
            <div className={styles.waterLabel}>剩余天数</div>
            <div
              className={`${styles.waterValue} ${
                daysUntilWatering <= 1 ? styles.urgent : ""
              }`}
            >
              {daysUntilWatering} 天
            </div>
          </div>
        </div>

        <div className={styles.waterProgress}>
          <div className={styles.progressInfo}>
            <span>浇水进度</span>
            <span>{Math.max(0, 100 - daysUntilWatering * 20)}%</span>
          </div>
          <Progress
            percentage={Math.max(0, 100 - daysUntilWatering * 20)}
            color={daysUntilWatering <= 1 ? "#F44336" : "#4CAF50"}
            strokeWidth={8}
          />
        </div>
      </Card>

      {/* 养护技巧 */}
      <Card className={styles.tipsCard}>
        <h2 className={styles.cardTitle}>养护技巧</h2>
        <div className={styles.tipsList}>
          {(plant.careTips ?? []).map((tip, index) => (
            <div key={index} className={styles.tipItem}>
              <div className={styles.tipIcon}>💡</div>
              <div className={styles.tipText}>{tip}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 植物位置 */}
      <Card className={styles.locationCard}>
        <h2 className={styles.cardTitle}>植物位置</h2>
        <div className={styles.locationInfo}>
          <div className={styles.locationIcon}>📍</div>
          <div className={styles.locationText}>{plant.location}</div>
        </div>
      </Card>
    </div>
  );
};

export default PlantDetail;
