import React from "react";
import styles from "./common.module.css";

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
