import React, { useState } from "react";
import { Card, Button, Cell, Tag, Dialog, Field } from "react-vant";
import {
  UserO,
  SettingO,
  StarO,
  FlowerO,
  ServiceO,
  ChatO,
  Edit,
} from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store";
import { AvatarUpload } from "../../../components/common";
import { formatRelativeDate } from "../../../utils/date";
import styles from "./profile.module.css";
import { useTitle } from "../../../hooks";

const UserProfile: React.FC = () => {
  useTitle();
  const user = useStore((s) => s.user);
  const plants = useStore((s) => s.plants);
  const updateProfile = useStore((s) => s.updateProfile);
  const careTasks = useStore((s) => s.careTasks);
  const careRecords = useStore((s) => s.careRecords);
  const navigate = useNavigate();
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  // const [activeTab, setActiveTab] = useState<"profile" | "stats" | "settings">(
  //   "profile"
  // );

  // 计算用户活跃天数（基于用户创建时间）
  const calculateDaysActive = () => {
    if (!user?.createdAt) return 30;
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1); // 至少1天
  };

  const userStats = {
    totalPlants: plants.length,
    healthyPlants: plants.filter((p: any) => p.status === "healthy").length,
    careTasks: careTasks.length,
    daysActive: calculateDaysActive(),
  };

  const menuItems = [
    {
      icon: FlowerO,
      title: "我的植物",
      desc: `${userStats.totalPlants} 株植物`,
      color: "#4CAF50",
      onClick: () => {
        navigate("/plant");
      },
    },
    {
      icon: ServiceO,
      title: "养护记录",
      desc: "查看养护历史",
      color: "#8BC34A",
      onClick: () => {
        navigate("/care");
      },
    },
    {
      icon: ChatO,
      title: "AI助手",
      desc: "智能养护咨询",
      color: "#2196F3",
      onClick: () => {
        navigate("/ai");
      },
    },
    {
      icon: SettingO,
      title: "设置",
      desc: "应用设置",
      color: "#FF9800",
      onClick: () => {
        // 暂时导航到用户资料页面，因为设置页面还未实现
        navigate("/user/profile");
      },
    },
  ];

  // 计算成就状态
  const calculateAchievements = () => {
    const completedTasks = careTasks.filter(
      (task: any) => task.completed
    ).length;
    const healthyPlantsCount = plants.filter(
      (p: any) => p.status === "healthy"
    ).length;

    return [
      {
        name: "植物新手",
        desc: "添加第一株植物",
        earned: plants.length > 0,
      },
      {
        name: "养护达人",
        desc: "完成10次养护任务",
        earned: completedTasks >= 10,
      },
      {
        name: "绿手指",
        desc: "拥有5株健康植物",
        earned: healthyPlantsCount >= 5,
      },
      {
        name: "AI专家",
        desc: "使用AI助手10次",
        earned: false, // 暂时设为false，因为AI使用次数统计功能还未实现
      },
    ];
  };

  const achievements = calculateAchievements();

  // 处理用户名编辑
  const handleEditName = () => {
    setNewName(user?.name || "");
    setShowEditName(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      alert("请输入有效的用户名");
      return;
    }

    try {
      setIsUpdating(true);
      await updateProfile({ name: newName.trim() });
      alert("用户名更新成功！");
      setShowEditName(false);
    } catch (error) {
      console.error("更新用户名失败:", error);
      alert("更新失败，请重试");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditName(false);
    setNewName(user?.name || "");
  };

  return (
    <div className={styles.userProfile}>
      {/* 用户信息卡片 */}
      <Card className={styles.userCard}>
        <div className={styles.userHeader}>
          <AvatarUpload
            src={user?.avatar}
            alt={user?.name || "用户头像"}
            size={80}
            className={styles.userAvatar}
          />
          <div className={styles.userInfo}>
            <div className={styles.userNameSection}>
              <h2 className={styles.userName}>{user?.name || "植物爱好者"}</h2>
              <Button
                type="primary"
                size="mini"
                icon={<Edit />}
                className={styles.editNameBtn}
                onClick={handleEditName}
              >
                编辑
              </Button>
            </div>
            <p className={styles.userBio}>热爱植物，享受养护的乐趣 🌱</p>
            <div className={styles.userTags}>
              <Tag color="#4CAF50" className={styles.userTag}>
                植物新手
              </Tag>
              <Tag color="#8BC34A" className={styles.userTag}>
                活跃用户
              </Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* 统计概览 */}
      <Card className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <FlowerO color="#4CAF50" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats.totalPlants}</div>
              <div className={styles.statLabel}>总植物</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <StarO color="#8BC34A" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats.healthyPlants}</div>
              <div className={styles.statLabel}>健康植物</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <ServiceO color="#2196F3" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats.careTasks}</div>
              <div className={styles.statLabel}>养护任务</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <UserO color="#FF9800" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats.daysActive}</div>
              <div className={styles.statLabel}>活跃天数</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 功能菜单 */}
      <Card className={styles.menuCard}>
        <div className={styles.menuList}>
          {menuItems.map((item, index) => (
            <Cell
              key={index}
              title={item.title}
              label={item.desc}
              isLink
              onClick={item.onClick}
              className={styles.menuItem}
            >
              <div
                className={styles.menuIcon}
                style={{ backgroundColor: item.color }}
              >
                <item.icon color="white" />
              </div>
            </Cell>
          ))}
        </div>
      </Card>

      {/* 成就系统 */}
      <Card className={styles.achievementsCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>我的成就</h3>
          <span className={styles.achievementCount}>
            {achievements.filter((a) => a.earned).length}/{achievements.length}
          </span>
        </div>
        <div className={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`${styles.achievementItem} ${
                achievement.earned ? styles.earned : styles.locked
              }`}
            >
              <div className={styles.achievementIcon}>
                {achievement.earned ? "🏆" : "🔒"}
              </div>
              <div className={styles.achievementInfo}>
                <div className={styles.achievementName}>{achievement.name}</div>
                <div className={styles.achievementDesc}>{achievement.desc}</div>
              </div>
              <div className={styles.achievementStatus}>
                {achievement.earned ? (
                  <Tag color="#4CAF50">已获得</Tag>
                ) : (
                  <Tag color="#999">未获得</Tag>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 最近活动 */}
      <Card className={styles.activityCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>最近活动</h3>
        </div>
        <div className={styles.activityList}>
          {careRecords.length > 0 ? (
            careRecords.slice(0, 3).map((record: any) => (
              <div key={record.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {record.type === "water"
                    ? "💧"
                    : record.type === "fertilize"
                    ? "🌱"
                    : record.type === "prune"
                    ? "✂️"
                    : record.type === "repot"
                    ? "🪴"
                    : "🌿"}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>{record.title}</div>
                  <div className={styles.activityDesc}>
                    {record.plantName} -{" "}
                    {formatRelativeDate(new Date(record.completedAt))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyActivity}>
              <div className={styles.emptyActivityIcon}>📝</div>
              <div className={styles.emptyActivityText}>暂无活动记录</div>
            </div>
          )}
        </div>
      </Card>

      {/* 退出登录 */}
      <div className={styles.logoutSection}>
        <Button
          type="danger"
          size="large"
          block
          className={styles.logoutButton}
          onClick={() => {
            // 退出登录逻辑
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/");
            window.location.reload();
          }}
        >
          退出登录
        </Button>
      </div>

      {/* 编辑用户名对话框 */}
      <Dialog
        visible={showEditName}
        title="编辑用户名"
        showCancelButton
        confirmButtonText={isUpdating ? "保存中..." : "保存"}
        cancelButtonText="取消"
        onConfirm={handleSaveName}
        onCancel={handleCancelEdit}
        className={styles.editNameDialog}
      >
        <div className={styles.editNameContent}>
          <Field
            value={newName}
            onChange={setNewName}
            placeholder="请输入新的用户名"
            maxLength={20}
            showWordLimit
            clearable
            label="用户名"
            autoFocus
          />
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
