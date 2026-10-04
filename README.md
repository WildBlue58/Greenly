# 🌱 Greenly - 智能植物养护助手

一款基于 **React 19** 的移动端 H5 智能植物养护助手，集成 AI 识别、养护任务管理、生长记录追踪等功能。

> 项目定位：纯前端本地应用（数据持久化在浏览器 localStorage），适合作为演示、教学与二次开发的基础。当前没有真实后端；AI 能力由前端直连 DeepSeek / Kimi API 实现。

## ✨ 功能

- **🌿 植物管理** — 植物档案的增删改查、状态监控、搜索筛选、图片上传
- **📅 养护任务** — 养护任务创建/完成/删除、今日提醒、逾期统计、养护记录
- **🤖 AI 助手** — 多模型聊天（DeepSeek / Kimi，流式输出）、拍照识别植物（Kimi Vision）
- **👤 用户中心** — 用户资料、头像上传、养护成就与统计
- **📱 移动端适配** — lib-flexible + postcss-pxtorem，px 自动转 rem

## 🛠️ 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | React 19 + TypeScript 5.8 |
| 构建 | Vite 6 |
| 路由 | React Router 7（懒加载） |
| 状态 | Zustand 5（persist 中间件自动持久化到 localStorage） |
| UI | React Vant 3 + CSS Modules |
| 代码质量 | ESLint 9（flat config，0 error 0 warning）+ Prettier |

## 🚀 快速开始

环境要求：Node.js >= 20，pnpm >= 9（或 npm）。

```bash
# 安装依赖
pnpm install

# 配置 AI 密钥（可选，不配置时 AI 功能会给出友好提示，其余功能不受影响）
cp .env.example .env.local
# 编辑 .env.local，填入 VITE_DEEPSEEK_API_KEY / VITE_KIMI_API_KEY

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build        # tsc -b && vite build
pnpm preview      # 预览构建结果
```

### 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 类型检查 + 生产构建 |
| `pnpm lint` | ESLint 检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm format` | Prettier 格式化 src/ |

## 🪄 项目结构

```bash
src/
├── components/          # 组件
│   ├── plant/           # PlantForm（添加/编辑共用表单）
│   ├── care/            # 养护任务/计划/统计组件
│   ├── common/          # Empty、PlantImage、AvatarUpload、Loading
│   └── layout/          # Layout（底部 Tabbar）与 BlankLayout
├── pages/               # 页面（全部 React.lazy 懒加载）
│   ├── home/            # 首页（统计卡片、今日养护进度）
│   ├── plant/           # 植物列表/详情/添加/编辑
│   ├── care/            # 养护管理/任务编辑
│   ├── ai/              # AI 聊天/植物识别
│   ├── user/            # 个人资料
│   └── error/           # 404
├── store/               # Zustand（slices.ts 定义类型，persist 持久化）
├── repositories/        # 存储仓库层（唯一持久化键 + 旧数据迁移）
├── mocks/               # 种子数据（首次运行的演示数据）
├── hooks/               # useTitle 等
├── utils/               # llm（LLM 接入）、careSelectors、date、image 等
└── theme.ts             # react-vant 主题变量（色板唯一来源）
```

## 🏗️ 架构说明

- **数据流**：页面 → 类型化 Zustand selector → store action → persist 中间件自动写入 localStorage（唯一键 `greenly-app-state`）。启动时自动恢复，无需手动 fetch。
- **种子数据**：`src/mocks/seed.ts` 作为 store 初始状态，只在本地无数据时生效，不会覆盖用户数据；重构前的旧格式数据由 `repositories/appStorage.ts` 的 `installLegacyMigration` 自动迁移。
- **AI 通道**：所有 LLM 调用统一收敛在 `src/utils/llm.ts`（聊天、流式聊天、植物识别）。
- **接入真实后端**：只需替换 `repositories/` 的实现并让 store action 改为异步调用，页面层无需改动。

## 🔒 安全说明

`VITE_*` 环境变量会被打包进前端 bundle，对所有用户可见。本项目为纯本地演示，可接受该限制；**生产环境请通过后端代理转发 LLM 请求**，不要在前端持有真实密钥。

## 📄 许可证

[MIT](LICENSE)
