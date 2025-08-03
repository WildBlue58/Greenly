import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 页面标题映射配置
const PAGE_TITLES: Record<string, string> = {
  // 首页
  '/': '小养 - 智能植物养护助手',
  '/home': '小养 - 智能植物养护助手',
  
  // 植物管理
  '/plant': '我的植物 - 小养',
  '/plant/list': '我的植物 - 小养',
  '/plant/add': '添加植物 - 小养',
  '/plant/edit': '编辑植物 - 小养',
  '/plant/detail': '植物详情 - 小养',
  
  // 养护管理
  '/care': '养护管理 - 小养',
  '/care/add': '添加养护任务 - 小养',
  '/care/edit': '编辑养护任务 - 小养',
  '/care/record': '养护记录 - 小养',
  '/care/reminder': '养护提醒 - 小养',
  '/care/stats': '养护统计 - 小养',
  
  // AI功能
  '/ai': 'AI助手 - 小养',
  '/ai/chat': 'AI聊天 - 小养',
  '/ai/recognition': '植物识别 - 小养',
  '/ai/generate': '图片生成 - 小养',
  '/ai/diagnosis': '健康诊断 - 小养',
  
  // 用户中心
  '/user': '个人中心 - 小养',
  '/user/profile': '个人资料 - 小养',
  '/user/settings': '应用设置 - 小养',
  '/user/login': '用户登录 - 小养',
  '/user/register': '用户注册 - 小养',
  
  // 错误页面
  '/error/404': '页面未找到 - 小养',
  '/error/500': '服务器错误 - 小养',
};

// 动态标题生成规则
const getDynamicTitle = (pathname: string): string => {
  // 处理带参数的路径
  if (pathname.includes('/plant/detail/')) {
    return '植物详情 - 小养';
  }
  if (pathname.includes('/plant/edit/')) {
    return '编辑植物 - 小养';
  }
  if (pathname.includes('/care/edit/')) {
    return '编辑养护任务 - 小养';
  }
  
  // 默认返回配置的标题
  return PAGE_TITLES[pathname] || '小养 - 智能植物养护助手';
};

/**
 * useTitle Hook
 * 根据当前路由动态设置页面标题
 * 
 * @param customTitle - 可选的自定义标题，会覆盖默认标题
 */
export const useTitle = (customTitle?: string) => {
  const location = useLocation();
  
  useEffect(() => {
    // 如果有自定义标题，优先使用自定义标题
    if (customTitle) {
      document.title = customTitle;
      return;
    }
    
    // 否则根据当前路径生成标题
    const title = getDynamicTitle(location.pathname);
    document.title = title;
  }, [location.pathname, customTitle]);
};

/**
 * 设置页面标题的工具函数
 * 可以在组件外部直接调用
 * 
 * @param title - 要设置的标题
 */
export const setPageTitle = (title: string) => {
  document.title = title;
};

/**
 * 重置页面标题为默认标题
 */
export const resetPageTitle = () => {
  document.title = '小养 - 智能植物养护助手';
};

export default useTitle; 