import React, { useCallback } from "react";
import {
  Button as VantButton,
  Input as VantInput,
  Dialog,
  Toast,
} from "react-vant";
import styles from "./common.module.css";

// Button 组件
interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "danger" | "default";
  size?: "large" | "normal" | "small" | "mini";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = "primary",
  size = "normal",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  }, [disabled, loading, onClick]);

  // 只允许 primary/default/danger
  let mappedType: "primary" | "default" | "danger" | undefined = type;

  return (
    <VantButton
      type={mappedType}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={handleClick}
      className={`${styles.button} ${className}`}
    >
      {children}
    </VantButton>
  );
};

// Input 组件
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "number" | "tel" | "digit";
  label?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  label,
  required = false,
  disabled = false,
  clearable = true,
  className = "",
}) => {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  // 只允许 text/number/digit/tel/password
  let mappedType: "text" | "number" | "digit" | "tel" | "password" =
    type as any;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <VantInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        type={mappedType}
        disabled={disabled}
        clearable={clearable}
        className={styles.input}
      />
    </div>
  );
};

// Modal 组件
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const CustomModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title = "",
  children,
  showCancel = true,
  onConfirm,
  confirmText = "确定",
  cancelText = "取消",
}) => {
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  // Dialog 方式实现
  React.useEffect(() => {
    if (visible) {
      Dialog.confirm({
        title,
        message: <div className={styles.modalContent}>{children}</div>,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        showCancelButton: showCancel,
        className: styles.modal,
        onConfirm: handleConfirm,
        onCancel: onClose,
        overlay: true,
        closeOnClickOverlay: true,
      });
    }
    // eslint-disable-next-line
  }, [visible]);
  return null;
};

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
  type: "success" | "fail" | "loading" = "success"
) => {
  if (type === "success") {
    Toast.success({
      message: message,
    });
  } else if (type === "fail") {
    Toast.fail({
      message: message,
    });
  } else if (type === "loading") {
    Toast.loading({
      message: message,
    });
  } else {
    Toast.info({
      message: message,
    });
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

// 分割线组件
interface DividerProps {
  text?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ text, className = "" }) => {
  return (
    <div className={`${styles.divider} ${className}`}>
      {text && <span className={styles.dividerText}>{text}</span>}
    </div>
  );
};

// 标签组件
interface TagProps {
  children: React.ReactNode;
  type?: "primary" | "success" | "warning" | "danger";
  size?: "small" | "normal" | "large";
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  type = "primary",
  size = "normal",
  className = "",
}) => {
  return (
    <span
      className={`${styles.tag} ${styles[type]} ${styles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// 卡片组件
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  extra,
  className = "",
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || subtitle || extra) && (
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {extra && <div className={styles.cardExtra}>{extra}</div>}
        </div>
      )}
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};

// 植物图片组件
export { default as PlantImage } from "./PlantImage";

// 头像上传组件
export { default as AvatarUpload } from "./AvatarUpload";
