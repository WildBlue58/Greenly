import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../store/types';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 如果响应成功但业务状态失败
    if (data && !data.success) {
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    return response;
  },
  (error) => {
    // 处理网络错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`请求失败: ${status}`);
      }
      
      return Promise.reject(new Error(data?.message || '请求失败'));
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查网络连接');
      return Promise.reject(new Error('网络错误，请检查网络连接'));
    } else {
      // 请求配置错误
      console.error('请求配置错误:', error.message);
      return Promise.reject(error);
    }
  }
);

// 通用请求方法
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request.get<T>(url, config).then(res => res.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request.post<T>(url, data, config).then(res => res.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request.put<T>(url, data, config).then(res => res.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request.delete<T>(url, config).then(res => res.data),
    
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    request.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then(res => res.data),
};

export default request;
