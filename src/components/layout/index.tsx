import React, { useState, useCallback, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabbar, TabbarItem, NavBar } from "react-vant";
import {
  HomeO,
  FlowerO,
  ServiceO,
  ChatO,
  UserO,
  ArrowLeft,
  Search,
  Plus,
} from "@react-vant/icons";
import styles from "./layout.module.css";

// Header 组件
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
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

// Footer 组件
interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className = "" }) => {
  return (
    <footer className={`${styles.footer} ${className}`}>{children}</footer>
  );
};

// Sidebar 组件
interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
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

// Navigation 组件
interface NavigationProps {
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
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
    []
  );

  const handleChange = useCallback(
    (name: string | number) => {
      onChange(name as string);
    },
    [onChange]
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
          icon={(active) => <tab.icon />}
          className={styles.tabItem}
        >
          {tab.title}
        </TabbarItem>
      ))}
    </Tabbar>
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
    [navigate]
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
                navigate("/ai/chat");
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

// TabBar Layout (带标签栏的布局)
export const TabBarLayout: React.FC = () => {
  return <Layout showHeader={false} showFooter={true} />;
};

// 搜索栏组件
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "搜索植物、养护知识...",
  onSearch,
  className = "",
}) => {
  const handleSearch = useCallback(() => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  }, [onSearch, value]);

  return (
    <div className={`${styles.searchBar} ${className}`}>
      <div className={styles.searchInput}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInputField}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        {value && (
          <div className={styles.clearIcon} onClick={() => onChange("")}>
            ✕
          </div>
        )}
      </div>
      {onSearch && (
        <button
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={!value.trim()}
        >
          搜索
        </button>
      )}
    </div>
  );
};
