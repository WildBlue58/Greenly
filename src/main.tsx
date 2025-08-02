import React from "react";
import ReactDOM from "react-dom/client";
import "lib-flexible";
import App from "./App.tsx";
import "./index.css";

// 初始化应用
const initializeApp = () => {
  // 设置默认主题
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "light");
  }

  // 初始化用户状态
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    // 如果没有用户数据，设置默认用户
    const defaultUser = {
      id: "1",
      name: "植物爱好者",
      email: "user@example.com",
      avatar: "", // 默认无头像，让用户自己上传
      phone: "13800138000",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(defaultUser));
    localStorage.setItem("token", "mock-jwt-token-" + Date.now());
  }

  // 初始化植物数据（如果没有的话）
  if (!localStorage.getItem("plants")) {
    const mockPlants = [
      {
        id: "1",
        name: "绿萝",
        species: "绿萝属",
        image:
          "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
        status: "healthy",
        health: "good",
        location: "客厅",
        wateringFrequency: 7,
        lastWatered: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        nextWatering: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        notes: "生长良好，叶子翠绿",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "多肉植物",
        species: "景天科",
        image:
          "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop",
        status: "needs_care",
        health: "warning",
        location: "阳台",
        wateringFrequency: 14,
        lastWatered: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        nextWatering: new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000
        ).toISOString(),
        notes: "需要浇水，叶子有些干瘪",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("plants", JSON.stringify(mockPlants));
  }

  console.log("应用初始化完成");
};

// 执行初始化
initializeApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
