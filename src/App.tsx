import React, { Suspense } from "react";
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
import "./App.css";

// 懒加载页面组件
const Home = React.lazy(() => import("./pages/home"));
const PlantList = React.lazy(() => import("./pages/plant/list"));
const PlantDetail = React.lazy(() => import("./pages/plant/detail"));
// const PlantAdd = React.lazy(() => import("./pages/plant/add"));
// const PlantEdit = React.lazy(() => import("./pages/plant/edit"));
const CarePlan = React.lazy(() => import("./pages/care/plan"));
// const CareRecord = React.lazy(() => import("./pages/care/record"));
// const CareReminder = React.lazy(() => import("./pages/care/reminder"));
// const CareStats = React.lazy(() => import("./pages/care/stats"));
const AIChat = React.lazy(() => import("./pages/ai/chat"));
// const AIRecognition = React.lazy(() => import("./pages/ai/recognition"));
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
  "--rv-tabs-line-height": "44px",
  "--rv-tabs-nav-background-color": "#FFFFFF",
  "--rv-tab-item-font-size": "14px",
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
  "--rv-empty-image-color": "#CCCCCC",
  "--rv-loading-color": "#4CAF50",
  "--rv-loading-text-color": "#666666",
  "--rv-overlay-background-color": "rgba(0, 0, 0, 0.5)",
  "--rv-popup-background-color": "#FFFFFF",
  "--rv-popup-border-radius": "8px",
  "--rv-popup-close-icon-color": "#999999",
  "--rv-popup-close-icon-size": "20px",
  "--rv-action-sheet-background-color": "#FFFFFF",
  "--rv-action-sheet-border-radius": "8px",
  "--rv-action-sheet-item-text-color": "#333333",
  "--rv-action-sheet-item-disabled-text-color": "#999999",
  "--rv-action-sheet-cancel-text-color": "#666666",
  "--rv-action-sheet-cancel-background-color": "#F5F5F5",
  "--rv-picker-background-color": "#FFFFFF",
  "--rv-picker-border-radius": "8px",
  "--rv-picker-title-text-color": "#333333",
  "--rv-picker-confirm-text-color": "#4CAF50",
  "--rv-picker-cancel-text-color": "#666666",
  "--rv-picker-column-text-color": "#333333",
  "--rv-picker-column-disabled-text-color": "#999999",
  "--rv-picker-column-active-text-color": "#4CAF50",
  "--rv-picker-column-loading-color": "#4CAF50",
  "--rv-datetime-picker-background-color": "#FFFFFF",
  "--rv-datetime-picker-border-radius": "8px",
  "--rv-datetime-picker-title-text-color": "#333333",
  "--rv-datetime-picker-confirm-text-color": "#4CAF50",
  "--rv-datetime-picker-cancel-text-color": "#666666",
  "--rv-datetime-picker-column-text-color": "#333333",
  "--rv-datetime-picker-column-disabled-text-color": "#999999",
  "--rv-datetime-picker-column-active-text-color": "#4CAF50",
  "--rv-datetime-picker-column-loading-color": "#4CAF50",
  "--rv-switch-background-color": "#E0E0E0",
  "--rv-switch-active-background-color": "#4CAF50",
  "--rv-switch-border-color": "#E0E0E0",
  "--rv-switch-active-border-color": "#4CAF50",
  "--rv-switch-handle-background-color": "#FFFFFF",
  "--rv-switch-handle-border-color": "#E0E0E0",
  "--rv-switch-handle-active-border-color": "#4CAF50",
  "--rv-switch-handle-size": "20px",
  "--rv-switch-width": "44px",
  "--rv-switch-height": "24px",
  "--rv-checkbox-background-color": "#FFFFFF",
  "--rv-checkbox-border-color": "#E0E0E0",
  "--rv-checkbox-active-background-color": "#4CAF50",
  "--rv-checkbox-active-border-color": "#4CAF50",
  "--rv-checkbox-disabled-background-color": "#F5F5F5",
  "--rv-checkbox-disabled-border-color": "#E0E0E0",
  "--rv-checkbox-disabled-text-color": "#999999",
  "--rv-checkbox-icon-color": "#FFFFFF",
  "--rv-checkbox-icon-size": "12px",
  "--rv-radio-background-color": "#FFFFFF",
  "--rv-radio-border-color": "#E0E0E0",
  "--rv-radio-active-background-color": "#4CAF50",
  "--rv-radio-active-border-color": "#4CAF50",
  "--rv-radio-disabled-background-color": "#F5F5F5",
  "--rv-radio-disabled-border-color": "#E0E0E0",
  "--rv-radio-disabled-text-color": "#999999",
  "--rv-radio-icon-color": "#FFFFFF",
  "--rv-radio-icon-size": "6px",
  "--rv-rate-icon-color": "#E0E0E0",
  "--rv-rate-icon-active-color": "#FF9800",
  "--rv-rate-icon-size": "20px",
  "--rv-rate-icon-gutter": "4px",
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
                  {/* <Route path="add" element={<PlantAdd />} />
                  <Route path="edit/:id" element={<PlantEdit />} /> */}
                </Route>

                {/* 养护管理路由 */}
                <Route path="care">
                  <Route index element={<CarePlan />} />
                  <Route path="plan" element={<CarePlan />} />
                  {/* <Route path="record" element={<CareRecord />} />
                  <Route path="reminder" element={<CareReminder />} />
                  <Route path="stats" element={<CareStats />} /> */}
                </Route>

                {/* AI功能路由 */}
                <Route path="ai">
                  <Route index element={<AIChat />} />
                  <Route path="chat" element={<AIChat />} />
                  {/* <Route path="recognition" element={<AIRecognition />} />
                  <Route path="generate" element={<AIGenerate />} />
                  <Route path="diagnosis" element={<AIDiagnosis />} /> */}
                </Route>

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
