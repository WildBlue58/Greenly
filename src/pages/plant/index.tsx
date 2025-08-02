import React from "react";
import { Navigate } from "react-router-dom";

// 植物主页面 - 重定向到植物列表
const Plant: React.FC = () => {
  return <Navigate to="/plant/list" replace />;
};

export default Plant;
