import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ConfigProvider } from "react-vant";
import { Layout, BlankLayout } from "./components/layout";
import Loading from "./components/common/Loading";
import { useStore } from "./store";
import { initializeMockCareData } from "./utils/initializeMockData";
import "./App.css";

// 懒加载页面组件
const Home = React.lazy(() => import("./pages/home"));
const PlantList = React.lazy(() => import("./pages/plant/list"));
const PlantDetail = React.lazy(() => import("./pages/plant/detail"));
const PlantAdd = React.lazy(() => import("./pages/plant/add"));
const PlantEdit = React.lazy(() => import("./pages/plant/edit"));
const Care = React.lazy(() => import("./pages/care"));
const CarePlan = React.lazy(() => import("./pages/care/plan"));
// const AddCareTask = React.lazy(() => import("./pages/care/add"));
const EditCareTask = React.lazy(() => import("./pages/care/edit"));
// const CareRecord = React.lazy(() => import("./pages/care/record"));
// const CareReminder = React.lazy(() => import("./pages/care/reminder"));
// const CareStats = React.lazy(() => import("./pages/care/stats"));
const AIPage = React.lazy(() => import("./pages/ai"));
const AIRecognition = React.lazy(() => import("./pages/ai/recognition"));
// const AIGenerate = React.lazy(() => import("./pages/ai/generate"));
// const AIDiagnosis = React.lazy(() => import("./pages/ai/diagnosis"));
const UserProfile = React.lazy(() => import("./pages/user/profile"));
// const UserSettings = React.lazy(() => import("./pages/user/settings"));
// const UserLogin = React.lazy(() => import("./pages/user/login"));
// const UserRegister = React.lazy(() => import("./pages/user/register"));
const Error404 = React.lazy(() => import("./pages/error/404"));
// const Error500 = React.lazy(() => import("./pages/error/500"));

// 绿色主题配置
const greenTheme = {
  "--rv-primary-color": "#4CAF50",
  "--rv-success-color": "#8BC34A",
  "--rv-warning-color": "#FF9800",
  "--rv-danger-color": "#F44336",
  "--rv-info-color": "#2196F3",
  "--rv-background-color": "#F5F5F5",
  "--rv-background-color-light": "#FAFAFA",
  "--rv-text-color": "#333333",
  "--rv-text-color-2": "#666666",
  "--rv-text-color-3": "#999999",
  "--rv-border-color": "#E0E0E0",
  "--rv-active-color": "#E8F5E8",
  "--rv-active-opacity": "0.7",
  "--rv-disabled-opacity": "0.5",
  "--rv-bottom-bar-background-color": "#FFFFFF",
  "--rv-tab-active-text-color": "#4CAF50",
  "--rv-tab-default-color": "#666666",
  "--rv-tabs-default-color": "#4CAF50",
  "--rv-tabs-line-height": "1.17rem",
  "--rv-tabs-nav-background-color": "#FFFFFF",
  "--rv-tab-item-font-size": "0.37rem",
  "--rv-tab-item-text-color": "#666666",
  "--rv-tab-item-active-text-color": "#4CAF50",
  "--rv-tab-item-active-background-color": "#E8F5E8",
  "--rv-tabs-bottom-bar-color": "#4CAF50",
  "--rv-button-primary-background-color": "#4CAF50",
  "--rv-button-primary-border-color": "#4CAF50",
  "--rv-button-primary-text-color": "#FFFFFF",
  "--rv-button-success-background-color": "#8BC34A",
  "--rv-button-success-border-color": "#8BC34A",
  "--rv-button-warning-background-color": "#FF9800",
  "--rv-button-warning-border-color": "#FF9800",
  "--rv-button-danger-background-color": "#F44336",
  "--rv-button-danger-border-color": "#F44336",
  "--rv-button-height": "1.2rem",
  "--rv-button-font-size": "0.4rem",
  "--rv-cell-background-color": "#FFFFFF",
  "--rv-cell-border-color": "#E0E0E0",
  "--rv-cell-text-color": "#333333",
  "--rv-cell-label-text-color": "#666666",
  "--rv-cell-value-text-color": "#999999",
  "--rv-field-input-text-color": "#333333",
  "--rv-field-placeholder-text-color": "#999999",
  "--rv-field-border-color": "#E0E0E0",
  "--rv-field-focus-border-color": "#4CAF50",
  "--rv-field-error-border-color": "#F44336",
  "--rv-field-error-text-color": "#F44336",
  "--rv-field-success-border-color": "#8BC34A",
  "--rv-field-success-text-color": "#8BC34A",
  "--rv-dialog-background-color": "#FFFFFF",
  "--rv-dialog-border-radius": "8px",
  "--rv-dialog-title-text-color": "#333333",
  "--rv-dialog-message-text-color": "#666666",
  "--rv-toast-background-color": "rgba(0, 0, 0, 0.8)",
  "--rv-toast-text-color": "#FFFFFF",
  "--rv-toast-border-radius": "4px",
  "--rv-notice-bar-background-color": "#FFF7E6",
  "--rv-notice-bar-text-color": "#FF9800",
  "--rv-notice-bar-border-color": "#FFE0B2",
  "--rv-pull-refresh-text-color": "#666666",
  "--rv-pull-refresh-loading-color": "#4CAF50",
  "--rv-list-text-color": "#666666",
  "--rv-list-loading-color": "#4CAF50",
  "--rv-list-finished-text-color": "#999999",
  "--rv-list-error-text-color": "#F44336",
  "--rv-empty-text-color": "#999999",
  "--rv-checkbox-background-color": "#FFFFFF",
  "--rv-checkbox-border-color": "#E0E0E0",
  "--rv-checkbox-active-background-color": "#4CAF50",
  "--rv-checkbox-active-border-color": "#4CAF50",
  "--rv-checkbox-disabled-background-color": "#F5F5F5",
  "--rv-checkbox-disabled-border-color": "#E0E0E0",
  "--rv-checkbox-disabled-text-color": "#999999",
  "--rv-checkbox-icon-color": "#FFFFFF",
  "--rv-checkbox-icon-size": "0.32rem",
  "--rv-radio-background-color": "#FFFFFF",
  "--rv-radio-border-color": "#E0E0E0",
  "--rv-radio-active-background-color": "#4CAF50",
  "--rv-radio-active-border-color": "#4CAF50",
  "--rv-radio-disabled-background-color": "#F5F5F5",
  "--rv-radio-disabled-border-color": "#E0E0E0",
  "--rv-radio-disabled-text-color": "#999999",
  "--rv-radio-icon-color": "#FFFFFF",
  "--rv-radio-icon-size": "0.16rem",
  "--rv-rate-icon-color": "#E0E0E0",
  "--rv-rate-icon-active-color": "#FF9800",
  "--rv-rate-icon-size": "0.53rem",
  "--rv-rate-icon-gutter": "0.11rem",
  "--rv-slider-background-color": "#E0E0E0",
  "--rv-slider-active-background-color": "#4CAF50",
  "--rv-slider-button-background-color": "#FFFFFF",
  "--rv-slider-button-border-color": "#E0E0E0",
  "--rv-slider-button-size": "20px",
  "--rv-slider-button-active-size": "24px",
  "--rv-slider-button-active-border-color": "#4CAF50",
  "--rv-slider-button-active-background-color": "#4CAF50",
  "--rv-slider-button-active-box-shadow": "0 0 0 4px rgba(76, 175, 80, 0.2)",
};

function App() {
  const {
    checkAuth,
    fetchPlants,
    fetchCarePlans,
    fetchCareTasks,
    initializeApp,
  } = useStore() as any;

  // 初始化应用
  useEffect(() => {
    const initApp = async () => {
      try {
        // 初始化模拟数据（仅在开发环境）
        initializeMockCareData();

        // 初始化应用设置
        initializeApp();

        // 检查用户认证状态
        await checkAuth();

        // 加载数据
        await Promise.all([fetchPlants(), fetchCarePlans(), fetchCareTasks()]);

        console.log("应用初始化完成");
      } catch (error) {
        console.error("应用初始化失败:", error);
      }
    };

    initApp();
  }, [checkAuth, fetchPlants, fetchCarePlans, fetchCareTasks, initializeApp]);

  return (
    <ConfigProvider themeVars={greenTheme}>
      <Router>
        <div className="app">
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* 主布局路由 */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />

                {/* 植物管理路由 */}
                <Route path="plant">
                  <Route index element={<PlantList />} />
                  <Route path="list" element={<PlantList />} />
                  <Route path="detail/:id" element={<PlantDetail />} />
                  <Route path="add" element={<PlantAdd />} />
                  <Route path="edit/:id" element={<PlantEdit />} />
                </Route>

                {/* 养护管理路由 */}
                <Route path="care">
                  <Route index element={<Care />} />
                  <Route path="plan" element={<CarePlan />} />
                  {/* <Route path="add" element={<AddCareTask />} /> */}
                  <Route path="edit/:id" element={<EditCareTask />} />
                </Route>

                {/* AI功能路由 */}
                <Route path="ai" element={<AIPage />} />
                {/* 暂时保留chat路由作为重定向 */}
                <Route path="ai/chat" element={<AIPage />} />
                <Route path="ai/recognition" element={<AIRecognition />} />
                {/* <Route path="ai/generate" element={<AIGenerate />} />
                <Route path="ai/diagnosis" element={<AIDiagnosis />} /> */}

                {/* 用户中心路由 */}
                <Route path="user">
                  <Route index element={<UserProfile />} />
                  <Route path="profile" element={<UserProfile />} />
                  {/* <Route path="settings" element={<UserSettings />} /> */}
                </Route>
              </Route>

              {/* 错误页面路由 - 公共访问 */}
              <Route
                path="/error"
                element={
                  <BlankLayout>
                    <Outlet />
                  </BlankLayout>
                }
              >
                <Route path="404" element={<Error404 />} />
                {/* <Route path="500" element={<Error500 />} /> */}
              </Route>

              {/* 默认重定向 */}
              <Route path="*" element={<Navigate to="/error/404" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
