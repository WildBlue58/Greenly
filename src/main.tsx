import React from "react";
import ReactDOM from "react-dom/client";
import "lib-flexible";
import App from "./App.tsx";
import "./index.css";
import "./pages/shared/variables.css";
import { installLegacyMigration } from "./repositories/appStorage";

// 迁移旧版本分散存储的本地数据（幂等，可在应用升级后安全执行）
installLegacyMigration();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
