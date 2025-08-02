# 🌱 Greenly - 智能植物养护助手

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3+-yellow.svg)](https://vitejs.dev/)
[![React Vant](https://img.shields.io/badge/React%20Vant-3.3+-green.svg)](https://react-vant.3lang.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0+-orange.svg)](https://zustand-demo.pmnd.rs/)

> 一款基于 React 18+ 的智能植物养护助手，集成 AI 识别、个性化养护计划、生长记录追踪等功能，为用户提供全方位的植物养护解决方案。

## ✨ 项目亮点

### 🤖 AI 智能功能

- **植物识别** - 拍照识别植物品种，获取专业养护建议
- **AI 聊天助手** - 多模型支持（DeepSeek、Kimi），智能养护咨询
- **图片生成** - 根据描述生成植物相关图片
- **智能诊断** - 植物健康状态智能分析

### 🌿 植物管理

- **植物档案** - 完整的植物信息管理
- **生长记录** - 详细的养护历史追踪
- **状态监控** - 实时植物健康状态监控
- **搜索筛选** - 快速查找和管理植物

### 📅 养护计划

- **个性化计划** - 根据植物品种生成专属养护计划
- **任务管理** - 智能提醒和任务完成追踪
- **养护统计** - 详细的养护数据分析和可视化
- **进度追踪** - 养护任务完成进度监控

### 👤 用户系统

- **个人资料** - 用户信息管理和头像上传
- **成就系统** - 养护成就和等级体系
- **数据统计** - 个人养护数据统计
- **设置管理** - 个性化应用设置

## 🛠️ 技术栈

### 前端框架

- **React 18+** - 现代 React 开发，函数式组件 + Hooks
- **TypeScript** - 类型安全的 JavaScript 开发
- **React Router DOM** - SPA 路由管理，支持懒加载

### 状态管理

- **Zustand** - 轻量级状态管理，相比 Redux 更简洁
- **自定义 Hooks** - 业务逻辑封装和复用

### UI 组件库

- **React Vant** - 移动端 UI 组件库，70% 常用组件已封装
- **CSS Modules** - 模块化样式，避免样式冲突

### 构建工具

- **Vite** - 现代构建工具，快速热重载
- **PostCSS + postcss-pxtorem** - 移动端适配，px 自动转 rem

### 移动端适配

- **lib-flexible** - 阿里移动端适配方案
- **响应式设计** - 完美适配各种移动设备

### AI 集成

- **多模型支持** - DeepSeek、Kimi、Doubao 等 LLM 模型
- **流式输出** - 实时 AI 响应
- **上下文管理** - LRU 缓存机制

### 开发工具

- **ESLint** - 代码质量检查
- **TypeScript** - 类型检查和智能提示
- **Vite Mock** - 开发环境数据模拟

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 开发模式
pnpm dev

# 或
npm run dev
```

### 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 🪄🪄项目结构

```bash
src/
├── components/          # 通用组件
│   ├── common/         # 基础组件（Loading、AvatarUpload等）
│   ├── plant/          # 植物相关组件
│   ├── care/           # 养护相关组件
│   ├── ai/             # AI 相关组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
│   ├── home/           # 首页
│   ├── plant/          # 植物管理（列表、详情、添加、编辑）
│   ├── care/           # 养护管理（计划、记录、统计）
│   ├── ai/             # AI 功能（识别、聊天、生成）
│   ├── user/           # 用户中心（资料、设置）
│   └── error/          # 错误页面
├── store/              # 状态管理（Zustand）
│   ├── user.ts         # 用户状态
│   ├── plant.ts        # 植物状态
│   ├── care.ts         # 养护状态
│   └── ai.ts           # AI 状态
├── hooks/              # 自定义 Hooks
│   ├── usePlant.ts     # 植物相关逻辑
│   ├── useCare.ts      # 养护相关逻辑
│   ├── useAI.ts        # AI 相关逻辑
│   └── useAuth.ts      # 认证相关逻辑
├── api/                # API 接口
├── utils/              # 工具函数
└── assets/             # 静态资源
```

## 🎯 核心功能

### 1. 植物识别

- 拍照上传植物图片
- AI 智能识别植物品种
- 获取专业养护建议和注意事项
- 支持多种植物品种识别

### 2. AI 聊天助手

- 多模型支持（DeepSeek、Kimi）
- 流式输出，实时响应
- 上下文管理，智能对话
- 植物养护专业咨询

### 3. 植物管理

- 添加、编辑、删除植物信息
- 植物状态监控（健康、需要养护）
- 植物图片上传和管理
- 搜索和筛选功能

### 4. 养护计划

- 个性化养护计划生成
- 养护任务创建和管理
- 任务完成状态追踪
- 养护记录历史查看

### 5. 用户系统

- 用户资料管理
- 头像上传功能
- 成就系统（植物新手、养护达人等）
- 个人数据统计

## 🔧 开发特性

### 性能优化

- **懒加载** - React.lazy + Suspense 路由懒加载
- **组件记忆化** - React.memo 性能优化
- **函数记忆化** - useCallback 和 useMemo
- **图片懒加载** - IntersectionObserver API

### 移动端顶级适配

- **响应式设计** - 完美适配各种移动设备
- **触摸优化** - 移动端交互体验优化
- **rem 适配** - 等比例缩放，完美还原设计稿

### 代码质量

- **TypeScript** - 类型安全，智能提示
- **ESLint** - 代码规范检查
- **模块化设计** - 组件和逻辑高度复用

## 🌟 技术亮点

1. **现代化技术栈** - React 18+ + TypeScript + Vite
2. **移动端优化** - lib-flexible + postcss-pxtorem 完美适配
3. **AI 集成** - 多模型 LLM 集成，智能植物识别
4. **性能优化** - 多层次性能优化策略
5. **用户体验** - 骨架屏、懒加载、瀑布流等优化
6. **代码质量** - TypeScript + ESLint + 设计模式

## 📱 移动端特性

- **响应式布局** - 完美适配各种屏幕尺寸
- **触摸友好** - 优化的移动端交互体验
- **性能优化** - 针对移动端的性能优化
- **离线支持** - 本地数据缓存和离线功能

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接：[https://github.com/WildBlue58/greenly](https://github.com/WildBlue58/greenly)
- 问题反馈：[Issues](https://github.com/WildBlue58/greenly/issues)

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！
