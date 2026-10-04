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
import { applyTheme } from "./store/app";
import { greenTheme } from "./theme";
import "./App.css";

// 懒加载页面组件
const Home = React.lazy(() => import("./pages/home"));
const PlantList = React.lazy(() => import("./pages/plant/list"));
const PlantDetail = React.lazy(() => import("./pages/plant/detail"));
const PlantAdd = React.lazy(() => import("./pages/plant/add"));
const PlantEdit = React.lazy(() => import("./pages/plant/edit"));
const Care = React.lazy(() => import("./pages/care"));
const EditCareTask = React.lazy(() => import("./pages/care/edit"));
const AIPage = React.lazy(() => import("./pages/ai"));
const AIRecognition = React.lazy(() => import("./pages/ai/recognition"));
const UserProfile = React.lazy(() => import("./pages/user/profile"));
const Error404 = React.lazy(() => import("./pages/error/404"));

function App() {
  const theme = useStore((state) => state.theme);

  // 数据（植物、养护、用户）由 zustand persist 在启动时自动恢复，
  // 这里只负责把主题应用到 DOM
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
                  <Route
                    path="plan"
                    element={<Navigate to="/care" replace />}
                  />
                  <Route path="edit/:id" element={<EditCareTask />} />
                </Route>

                {/* AI功能路由 */}
                <Route path="ai" element={<AIPage />} />
                {/* 暂时保留chat路由作为重定向 */}
                <Route path="ai/chat" element={<AIPage />} />
                <Route path="ai/recognition" element={<AIRecognition />} />

                {/* 用户中心路由 */}
                <Route path="user">
                  <Route index element={<UserProfile />} />
                  <Route path="profile" element={<UserProfile />} />
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
