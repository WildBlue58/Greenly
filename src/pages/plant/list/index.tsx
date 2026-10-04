import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Search, Empty, PullRefresh } from "react-vant";
import { Plus } from "@react-vant/icons";
import { useStore } from "../../../store";
import { useTitle } from "../../../hooks";
import { PlantImage } from "../../../components/common";
import type { Plant } from "../../../store/types";
import styles from "./list.module.css";

const PlantList: React.FC = () => {
  const navigate = useNavigate();
  const plants = useStore((s) => s.plants);

  // 设置页面标题
  useTitle();

  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "healthy" | "needs_care"
  >("all");

  const onRefresh = async () => {
    // 数据由 store 持久化并实时同步，下拉刷新保留交互习惯
    await Promise.resolve();
  };

  const filteredPlants = plants.filter((plant: Plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || plant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions: {
    label: string;
    value: "all" | "healthy" | "needs_care";
  }[] = [
    { label: "全部", value: "all" },
    { label: "健康", value: "healthy" },
    { label: "需要养护", value: "needs_care" },
  ];

  const getStatusText = (status: Plant["status"]) => {
    return status === "healthy" ? "健康" : "需要养护";
  };

  return (
    <div className={styles.plantList}>
      {/* 搜索和筛选 */}
      <div className={styles.searchSection}>
        <Search
          value={searchValue}
          onChange={setSearchValue}
          placeholder="搜索植物名称或品种"
          className={styles.searchInput}
        />

        <div className={styles.filterButtons}>
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              size="small"
              type={filterStatus === option.value ? "primary" : "default"}
              onClick={() => setFilterStatus(option.value)}
              className={styles.filterButton}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 植物列表 */}
      <PullRefresh onRefresh={onRefresh} className={styles.listContainer}>
        {filteredPlants.length > 0 ? (
          <div className={styles.plantsGrid}>
            {filteredPlants.map((plant: Plant) => (
              <Card
                key={plant.id}
                className={styles.plantCard}
                onClick={() => navigate(`/plant/detail/${plant.id}`)}
              >
                <div className={styles.plantContent}>
                  <div className={styles.plantImage}>
                    <PlantImage
                      src={plant.image}
                      alt={plant.name}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>

                  <div className={styles.plantInfo}>
                    <div className={styles.plantHeader}>
                      <h3 className={styles.plantName}>{plant.name}</h3>
                      <div
                        className={`${styles.statusBadge} ${
                          styles[plant.status]
                        }`}
                      >
                        {getStatusText(plant.status)}
                      </div>
                    </div>
                    <p className={styles.plantSpecies}>{plant.species}</p>

                    <div className={styles.plantDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>位置:</span>
                        <span className={styles.detailValue}>
                          {plant.location}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>添加时间:</span>
                        <span className={styles.detailValue}>
                          {new Date(plant.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.plantActions}>
                    <Button
                      size="small"
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plant/detail/${plant.id}`);
                      }}
                    >
                      详情
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plant/edit/${plant.id}`);
                      }}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description={
              searchValue || filterStatus !== "all"
                ? "没有找到匹配的植物"
                : "还没有添加植物"
            }
            className={styles.emptyState}
          >
            <Button
              type="primary"
              onClick={() => navigate("/plant/add")}
              className={styles.addButton}
            >
              <Plus />
              添加植物
            </Button>
          </Empty>
        )}
      </PullRefresh>

      {/* 悬浮添加按钮 */}
      <Button
        type="primary"
        size="large"
        className={styles.fab}
        onClick={() => navigate("/plant/add")}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default PlantList;
