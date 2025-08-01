import { useCallback, useMemo, useState } from 'react';
import type { Notification } from '../store/types';

/**
 * 通知相关Hook
 * 提供通知管理、显示、隐藏等功能
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  /**
   * 添加通知
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    setCurrentNotification(newNotification);
    setIsVisible(true);

    // 自动隐藏通知（5秒后）
    setTimeout(() => {
      hideNotification();
    }, 5000);

    return newNotification;
  }, []);

  /**
   * 显示成功通知
   */
  const showSuccess = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'success',
      title,
      message,
    });
  }, [addNotification]);

  /**
   * 显示错误通知
   */
  const showError = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'error',
      title,
      message,
    });
  }, [addNotification]);

  /**
   * 显示警告通知
   */
  const showWarning = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'warning',
      title,
      message,
    });
  }, [addNotification]);

  /**
   * 显示信息通知
   */
  const showInfo = useCallback((title: string, message: string) => {
    return addNotification({
      type: 'info',
      title,
      message,
    });
  }, [addNotification]);

  /**
   * 隐藏当前通知
   */
  const hideNotification = useCallback(() => {
    setIsVisible(false);
    setCurrentNotification(null);
  }, []);

  /**
   * 标记通知为已读
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  /**
   * 标记所有通知为已读
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  /**
   * 删除通知
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * 清空所有通知
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * 获取未读通知数量
   */
  const unreadCount = useMemo(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  /**
   * 获取未读通知
   */
  const unreadNotifications = useMemo(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  /**
   * 获取已读通知
   */
  const readNotifications = useMemo(() => {
    return notifications.filter(notification => notification.read);
  }, [notifications]);

  /**
   * 按类型获取通知
   */
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  /**
   * 获取通知统计信息
   */
  const notificationStats = useMemo(() => {
    const total = notifications.length;
    const unread = unreadCount;
    const read = total - unread;
    const success = getNotificationsByType('success').length;
    const error = getNotificationsByType('error').length;
    const warning = getNotificationsByType('warning').length;
    const info = getNotificationsByType('info').length;

    return {
      total,
      unread,
      read,
      success,
      error,
      warning,
      info,
    };
  }, [notifications, unreadCount, getNotificationsByType]);

  return {
    // 状态
    notifications,
    isVisible,
    currentNotification,
    unreadCount,
    
    // 方法
    addNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    
    // 筛选数据
    unreadNotifications,
    readNotifications,
    getNotificationsByType,
    
    // 统计信息
    notificationStats,
  };
};
