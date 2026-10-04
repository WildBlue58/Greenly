import React from "react";
import { Toast } from "react-vant";
import styles from "./common.module.css";

// Loading 组件
interface LoadingProps {
  visible: boolean;
  text?: string;
  size?: "small" | "normal" | "large";
}

export const Loading: React.FC<LoadingProps> = ({
  visible,
  text = "加载中...",
  size = "normal",
}) => {
  if (!visible) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={`${styles.loading} ${styles[size]}`}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>{text}</p>
      </div>
    </div>
  );
};

// Toast 组件封装
export const showToast = (
  message: string,
  type: "success" | "fail" | "loading" | "info" = "success"
) => {
  if (type === "success") {
    Toast.success({ message });
  } else if (type === "fail") {
    Toast.fail({ message });
  } else if (type === "loading") {
    Toast.loading({ message });
  } else {
    Toast.info({ message });
  }
};

// 空状态组件
interface EmptyProps {
  text?: string;
  image?: string;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  text = "暂无数据",
  image,
  className = "",
}) => {
  return (
    <div className={`${styles.empty} ${className}`}>
      {image && <img src={image} alt="empty" className={styles.emptyImage} />}
      <p className={styles.emptyText}>{text}</p>
    </div>
  );
};

// 植物图片组件
export { default as PlantImage } from "./PlantImage";

// 头像上传组件
export { default as AvatarUpload } from "./AvatarUpload";
