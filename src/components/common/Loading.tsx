import React from "react";
import { Loading as VantLoading } from "react-vant";
import styles from "./common.module.css";

interface LoadingProps {
  text?: string;
  size?: "large" | "medium" | "small";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  text = "加载中...",
  size = "medium",
  className = "",
}) => {
  return (
    <div className={`${styles.loadingContainer} ${className}`}>
      <VantLoading size={size} color="var(--rv-primary-color)">
        {text}
      </VantLoading>
    </div>
  );
};

export default Loading;
