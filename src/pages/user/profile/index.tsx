import React, { useState } from 'react';
import { Card, Button, Cell, Tag, Divider } from 'react-vant';
import { UserO, SettingO, StarO, FlowerO, ServiceO, ChatO } from '@react-vant/icons';
import { useStore } from '../../../store';
import styles from './profile.module.css';

const UserProfile: React.FC = () => {
  const { user, plants } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile');

  const userStats = {
    totalPlants: plants.length,
    healthyPlants: plants.filter(p => p.status === 'healthy').length,
    careTasks: 5,
    daysActive: 30
  };

  const menuItems = [
    {
      icon: FlowerO,
      title: '我的植物',
      desc: `${userStats.totalPlants} 株植物`,
      color: '#4CAF50',
      onClick: () => {/* 导航到植物列表 */}
    },
    {
      icon: ServiceO,
      title: '养护记录',
      desc: '查看养护历史',
      color: '#8BC34A',
      onClick: () => {/* 导航到养护记录 */}
    },
    {
      icon: ChatO,
      title: 'AI助手',
      desc: '智能养护咨询',
      color: '#2196F3',
      onClick: () => {/* 导航到AI助手 */}
    },
    {
      icon: SettingO,
      title: '设置',
      desc: '应用设置',
      color: '#FF9800',
      onClick: () => {/* 导航到设置 */}
    }
  ];

  const achievements = [
    { name: '植物新手', desc: '添加第一株植物', earned: true },
    { name: '养护达人', desc: '完成10次养护任务', earned: true },
    { name: '绿手指', desc: '拥有5株健康植物', earned: false },
    { name: 'AI专家', desc: '使用AI助手10次', earned: false }
  ];

  return (
    <div className={styles.userProfile}>
      {/* 用户信息卡片 */}
      <Card className={styles.userCard}>
        <div className={styles.userHeader}>
          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <UserO size={40} color="#4CAF50" />
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name || '植物爱好者'}</h2>
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
            {achievements.filter(a => a.earned).length}/{achievements.length}
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
                {achievement.earned ? '🏆' : '🔒'}
              </div>
              <div className={styles.achievementInfo}>
                <div className={styles.achievementName}>{achievement.name}</div>
                <div className={styles.achievementDesc}>{achievement.desc}</div>
              </div>
              <div className={styles.achievementStatus}>
                {achievement.earned ? (
                  <Tag color="#4CAF50" size="small">已获得</Tag>
                ) : (
                  <Tag color="#999" size="small">未获得</Tag>
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
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🌱</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>添加了新植物</div>
              <div className={styles.activityDesc}>绿萝 - 2小时前</div>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>💧</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>完成了养护任务</div>
              <div className={styles.activityDesc}>给多肉浇水 - 1天前</div>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🤖</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>使用了AI助手</div>
              <div className={styles.activityDesc}>咨询植物养护问题 - 2天前</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 退出登录 */}
      <div className={styles.logoutSection}>
        <Button 
          type="danger" 
          size="large" 
          block
          className={styles.logoutButton}
          onClick={() => {/* 退出登录逻辑 */}}
        >
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default UserProfile; 