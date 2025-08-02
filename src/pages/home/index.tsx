import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Progress } from "react-vant";
import {
  FlowerO,
  ServiceO,
  ChatO,
  Plus,
  Arrow,
  FireO,
  StarO,
  ClockO,
} from "@react-vant/icons";
import { useStore } from "../../store";
import type { Plant } from "../../store/types";
import { AvatarUpload } from "../../components/common";
import styles from "./home.module.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { plants, fetchPlants, user } = useStore() as any;
  const [stats, setStats] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    needsCare: 0,
    todayTasks: 0,
  });

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  useEffect(() => {
    // 模拟统计数据
    setStats({
      totalPlants: plants.length,
      healthyPlants: plants.filter((p: Plant) => p.status === "healthy").length,
      needsCare: plants.filter((p: Plant) => p.status === "needs_care").length,
      todayTasks: 3,
    });
  }, [plants]);

  const quickActions = [
    {
      icon: Plus,
      title: "添加植物",
      desc: "记录新的植物",
      color: "#4CAF50",
      onClick: () => navigate("/plant/add"),
    },
    {
      icon: ServiceO,
      title: "养护计划",
      desc: "查看养护安排",
      color: "#8BC34A",
      onClick: () => navigate("/care/plan"),
    },
    {
      icon: ChatO,
      title: "AI助手",
      desc: "智能养护咨询",
      color: "#2196F3",
      onClick: () => navigate("/ai/chat"),
    },
  ];

  const recentPlants = plants.slice(0, 3);

  return (
    <div className={styles.home}>
      {/* 欢迎区域 */}
      <div className={styles.welcome}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.greeting}>
            你好，{user?.name || "植物爱好者"}！
          </h1>
          <p className={styles.subtitle}>今天也要好好照顾你的植物哦 🌱</p>
        </div>
        <div className={styles.avatar}>
          {user?.avatar ? (
            <AvatarUpload
              src={user.avatar}
              alt={user.name || "用户头像"}
              size={60}
            />
          ) : (
            <FlowerO />
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FlowerO />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.totalPlants}</div>
              <div className={styles.statLabel}>总植物数</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <StarO />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.healthyPlants}</div>
              <div className={styles.statLabel}>健康植物</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FireO />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.needsCare}</div>
              <div className={styles.statLabel}>需要养护</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <ClockO />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.todayTasks}</div>
              <div className={styles.statLabel}>今日任务</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 快速操作 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>快速操作</h2>
        <div className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={styles.actionCard}
              onClick={action.onClick}
            >
              <div className={styles.actionContent}>
                <div
                  className={styles.actionIcon}
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon />
                </div>
                <div className={styles.actionInfo}>
                  <div className={styles.actionTitle}>{action.title}</div>
                  <div className={styles.actionDesc}>{action.desc}</div>
                </div>
                <Arrow className={styles.actionArrow} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 最近植物 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>我的植物</h2>
          <Button
            size="small"
            type="primary"
            onClick={() => navigate("/plant/list")}
          >
            查看全部
          </Button>
        </div>

        {recentPlants.length > 0 ? (
          <div className={styles.plantsList}>
            {recentPlants.map((plant: Plant) => (
              <Card key={plant.id} className={styles.plantCard}>
                <div className={styles.plantContent}>
                  <div className={styles.plantImage}>
                    <img src={plant.image} alt={plant.name} />
                  </div>
                  <div className={styles.plantInfo}>
                    <h3 className={styles.plantName}>{plant.name}</h3>
                    <p className={styles.plantSpecies}>{plant.species}</p>
                    <div className={styles.plantStatus}>
                      <span
                        className={`${styles.status} ${styles[plant.status]}`}
                      >
                        {plant.status === "healthy" ? "健康" : "需要养护"}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="small"
                    onClick={() => navigate(`/plant/detail/${plant.id}`)}
                  >
                    详情
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyContent}>
              <FlowerO />
              <p className={styles.emptyText}>还没有添加植物</p>
              <Button type="primary" onClick={() => navigate("/plant/add")}>
                添加第一个植物
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 今日养护进度 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>今日养护进度</h2>
        <Card className={styles.progressCard}>
          <div className={styles.progressContent}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>已完成 2/3 项任务</span>
              <span className={styles.progressPercent}>67%</span>
            </div>
            <Progress percentage={67} color="#4CAF50" strokeWidth={8} />
            <div className={styles.taskList}>
              <div className={`${styles.taskItem} ${styles.completed}`}>
                <StarO />
                <span>给绿萝浇水</span>
              </div>
              <div className={`${styles.taskItem} ${styles.completed}`}>
                <StarO />
                <span>检查多肉状态</span>
              </div>
              <div className={styles.taskItem}>
                <ClockO />
                <span>给君子兰施肥</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
