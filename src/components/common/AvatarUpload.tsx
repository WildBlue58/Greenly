import React, { useState, useRef } from "react";
import { Dialog } from "react-vant";
import { UserO, Edit, Plus } from "@react-vant/icons";
import {
  validateImageFile,
  compressImage,
  imageToBase64,
} from "../../utils/image";
import { useStore } from "../../store";
import styles from "./AvatarUpload.module.css";

interface AvatarUploadProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  onChange?: (imageUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  src,
  alt = "用户头像",
  size = 80,
  className = "",
  onChange,
}) => {
  const { updateProfile } = useStore() as any;
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);

      // 验证图片文件
      const validation = await validateImageFile(file, {
        maxSize: 10, // 10MB - 更宽松的大小限制
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxWidth: 2000, // 2000px - 更宽松的尺寸限制
        maxHeight: 2000, // 2000px - 更宽松的尺寸限制
      });

      if (!validation.isValid) {
        alert(validation.error || "图片验证失败");
        return;
      }

      // 压缩图片
      const compressedFile = await compressImage(file, {
        quality: 0.8,
        maxWidth: 400,
        maxHeight: 400,
        maintainAspectRatio: true,
      });

      // 转换为Base64
      const base64Url = await imageToBase64(compressedFile);

      // 更新预览
      setPreviewUrl(base64Url);
      setShowPreview(true);
    } catch (error) {
      console.error("处理图片失败:", error);
      alert("图片处理失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirm = async () => {
    if (!previewUrl) return;

    try {
      setUploading(true);

      // 更新用户头像
      await updateProfile({ avatar: previewUrl });

      // 触发回调
      onChange?.(previewUrl);

      alert("头像更新成功！");
      setShowPreview(false);
    } catch (error) {
      console.error("更新头像失败:", error);
      alert("头像更新失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl("");
    setShowPreview(false);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
  };

  return (
    <>
      <div
        className={`${styles.avatarUpload} ${className}`}
        style={avatarStyle}
        onClick={handleClick}
      >
        {src ? (
          <>
            <img src={src} alt={alt} className={styles.avatarImage} />
            <div className={styles.uploadOverlay}>
              <Edit className={styles.uploadIcon} />
            </div>
          </>
        ) : (
          <div className={styles.avatarPlaceholder}>
            <UserO className={styles.placeholderIcon} />
            <div className={styles.uploadOverlay}>
              <Plus className={styles.uploadIcon} />
            </div>
          </div>
        )}

        {uploading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <Dialog
        visible={showPreview}
        title="设置头像"
        showCancelButton
        confirmButtonText="确认更新"
        cancelButtonText="取消"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        className={styles.previewDialog}
      >
        <div className={styles.previewContainer}>
          <div className={styles.previewAvatar}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="预览头像"
                className={styles.previewImage}
              />
            )}
          </div>
          <p className={styles.previewTip}>确认将此图片设置为头像吗？</p>
        </div>
      </Dialog>
    </>
  );
};

export default AvatarUpload;
