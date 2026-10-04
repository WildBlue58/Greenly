import React, { useState, useCallback, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabbar, TabbarItem, NavBar } from "react-vant";
import {
  HomeO,
  FlowerO,
  ServiceO,
  ChatO,
  UserO,
  Search,
  Plus,
} from "@react-vant/icons";
import styles from "./layout.module.css";

// Header 组件（仅供 Layout 内部使用）
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "小养",
  showBack = false,
  onBack,
  rightContent,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  }, [onBack, navigate]);

  return (
    <NavBar
      title={title}
      leftArrow={showBack}
      onClickLeft={showBack ? handleBack : undefined}
      className={`${styles.header} ${className}`}
      fixed
      placeholder
    >
      {rightContent && <div className={styles.headerRight}>{rightContent}</div>}
    </NavBar>
  );
};

// Navigation 组件（仅供 Layout 内部使用）
interface NavigationProps {
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  active,
  onChange,
  className = "",
}) => {
  const tabs = useMemo(
    () => [
      { key: "home", title: "首页", icon: HomeO },
      { key: "plant", title: "植物", icon: FlowerO },
      { key: "care", title: "养护", icon: ServiceO },
      { key: "ai", title: "AI助手", icon: ChatO },
      { key: "user", title: "我的", icon: UserO },
    ],
    [],
  );

  const handleChange = useCallback(
    (name: string | number) => {
      onChange(name as string);
    },
    [onChange],
  );

  return (
    <Tabbar
      value={active}
      onChange={handleChange}
      className={`${styles.navigation} ${className}`}
      fixed
      placeholder
    >
      {tabs.map((tab) => (
        <TabbarItem
          key={tab.key}
          name={tab.key}
          icon={<tab.icon />}
          className={styles.tabItem}
        >
          {tab.title}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};

// Sidebar 组件（仅供 Layout 内部使用）
interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  children,
  className = "",
}) => {
  return (
    <>
      {visible && <div className={styles.sidebarOverlay} onClick={onClose} />}
      <div
        className={`${styles.sidebar} ${
          visible ? styles.visible : ""
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};

// Layout 主组件
interface LayoutProps {
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: Partial<HeaderProps>;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  showHeader = true,
  showFooter = true,
  headerProps = {},
  className = "",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // 根据当前路径确定激活的标签
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/plant")) return "plant";
    if (path.startsWith("/care")) return "care";
    if (path.startsWith("/ai")) return "ai";
    if (path.startsWith("/user")) return "user";
    return "home";
  }, [location.pathname]);

  const handleTabChange = useCallback(
    (value: string) => {
      navigate(`/${value === "home" ? "" : value}`);
    },
    [navigate],
  );

  const handleSidebarToggle = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  return (
    <div className={`${styles.layout} ${className}`}>
      {/* Header */}
      {showHeader && (
        <Header
          title={headerProps.title || "小养"}
          showBack={headerProps.showBack}
          onBack={headerProps.onBack}
          rightContent={
            <div className={styles.headerActions}>
              <Search className={styles.headerIcon} />
              <Plus
                className={styles.headerIcon}
                onClick={handleSidebarToggle}
              />
            </div>
          }
          {...headerProps}
        />
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Footer Navigation */}
      {showFooter && (
        <Navigation active={activeTab} onChange={handleTabChange} />
      )}

      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={handleSidebarClose}>
        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>快速操作</h3>
          <div className={styles.sidebarMenu}>
            <div
              className={styles.sidebarItem}
              onClick={() => {
                navigate("/plant/add");
                handleSidebarClose();
              }}
            >
              <Plus />
              <span>添加植物</span>
            </div>
            <div
              className={styles.sidebarItem}
              onClick={() => {
                navigate("/care");
                handleSidebarClose();
              }}
            >
              <ServiceO />
              <span>养护计划</span>
            </div>
            <div
              className={styles.sidebarItem}
              onClick={() => {
                navigate("/ai");
                handleSidebarClose();
              }}
            >
              <ChatO />
              <span>AI咨询</span>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

// Blank Layout (无导航栏的布局)
export const BlankLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className={styles.blankLayout}>{children}</div>;
};
