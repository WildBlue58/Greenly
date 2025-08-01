import { useCallback } from 'react';
import { useStore } from '../store';
import type { LoginCredentials, RegisterData, User } from '../store/types';

/**
 * 认证相关Hook
 * 提供登录、注册、登出、用户资料管理等功能
 */
export const useAuth = () => {
  const store = useStore() as any;
  
  // 从store中提取用户相关状态和方法
  const user = store.user;
  const isAuthenticated = store.isAuthenticated;
  const loading = store.loading;
  const login = store.login;
  const register = store.register;
  const logout = store.logout;
  const updateProfile = store.updateProfile;
  const checkAuth = store.checkAuth;

  /**
   * 登录
   */
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '登录失败' };
    }
  }, [login]);

  /**
   * 注册
   */
  const handleRegister = useCallback(async (userData: RegisterData) => {
    try {
      await register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '注册失败' };
    }
  }, [register]);

  /**
   * 登出
   */
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  /**
   * 更新用户资料
   */
  const handleUpdateProfile = useCallback(async (profile: Partial<User>) => {
    try {
      await updateProfile(profile);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '更新资料失败' };
    }
  }, [updateProfile]);

  /**
   * 检查认证状态
   */
  const handleCheckAuth = useCallback(async () => {
    try {
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '认证检查失败' };
    }
  }, [checkAuth]);

  return {
    // 状态
    user,
    isAuthenticated,
    loading,
    
    // 方法
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    checkAuth: handleCheckAuth,
  };
};
