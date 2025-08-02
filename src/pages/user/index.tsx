import React from "react";
import { Navigate } from "react-router-dom";
import { useTitle } from "../../hooks";

// 用户主页面 - 重定向到用户资料页面
const User: React.FC = () => {
  useTitle();
  return <Navigate to="/user/profile" replace />;
};

export default User;
