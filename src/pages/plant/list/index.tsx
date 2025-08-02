import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Search, Empty, PullRefresh } from "react-vant";
import { Plus } from "@react-vant/icons";
import { useStore } from "../../../store";
import styles from "./list.module.css";

const PlantList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plants, fetchPlants } = useStore() as any;
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "healthy" | "needs_care"
  >("all");
  useEffect(() => {
    fetchPlants();
  }, [fetchPlants, location.pathname]);

  const onRefresh = async () => {
    await fetchPlants();
  };

  const filteredPlants = plants.filter((plant: any) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || plant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { label: "全部", value: "all" },
    { label: "健康", value: "healthy" },
    { label: "需要养护", value: "needs_care" },
  ];

  const getStatusColor = (status: string) => {
    return status === "healthy" ? "#4CAF50" : "#FF9800";
  };

  const getStatusText = (status: string) => {
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
              onClick={() => setFilterStatus(option.value as any)}
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
            {filteredPlants.map((plant: any) => (
              <Card
                key={plant.id}
                className={styles.plantCard}
                onClick={() => navigate(`/plant/detail/${plant.id}`)}
              >
                <div className={styles.plantContent}>
                  <div className={styles.plantImage}>
                    <img
                      src={
                        plant.image ||
                        "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop"
                      }
                      alt={plant.name}
                      onError={(e) => {
                        // 图片加载失败时使用默认图片
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop";
                      }}
                    />
                    <div
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(plant.status) }}
                    >
                      {getStatusText(plant.status)}
                    </div>
                  </div>

                  <div className={styles.plantInfo}>
                    <h3 className={styles.plantName}>{plant.name}</h3>
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
