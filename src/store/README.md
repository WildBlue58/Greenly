# Store 状态管理

本项目使用 Zustand 进行状态管理，采用模块化的设计，将不同功能的状态分离到不同的 store 文件中。

## 文件结构

```bash
src/store/
├── index.ts      # 主store入口，整合所有子store
├── types.ts      # 类型定义
├── user.ts       # 用户状态管理
├── plant.ts      # 植物状态管理
├── care.ts       # 养护状态管理
├── ai.ts         # AI功能状态管理
└── app.ts        # 应用全局状态管理
```

## 使用方法

### 基本使用

```typescript
import { useStore } from "../store";

const MyComponent = () => {
  const { user, plants, fetchPlants } = useStore();

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  return (
    <div>
      <h1>欢迎，{user?.name}</h1>
      <p>您有 {plants.length} 个植物</p>
    </div>
  );
};
```

### 用户相关

```typescript
const { user, isAuthenticated, login, logout, register } = useStore();

// 登录
await login({ email: "user@example.com", password: "password" });

// 登出
logout();

// 注册
await register({
  name: "用户名",
  email: "user@example.com",
  password: "password",
});
```

### 植物相关

```typescript
const {
  plants,
  currentPlant,
  fetchPlants,
  addPlant,
  updatePlant,
  deletePlant,
} = useStore();

// 获取植物列表
await fetchPlants();

// 添加植物
const newPlant = await addPlant({
  name: "绿萝",
  species: "绿萝",
  location: "客厅",
  image: "plant-image-url",
});

// 更新植物
await updatePlant(plantId, { name: "新名称" });

// 删除植物
await deletePlant(plantId);
```

### 养护相关

```typescript
const {
  careTasks,
  carePlans,
  careRecords,
  fetchCareTasks,
  addCareTask,
  completeCareTask,
} = useStore();

// 获取养护任务
await fetchCareTasks();

// 添加养护任务
await addCareTask({
  plantId: "plant-id",
  plantName: "绿萝",
  type: "water",
  title: "浇水",
  description: "给绿萝浇水",
  dueDate: "2024-01-01",
  priority: "high",
});

// 完成任务
await completeCareTask(taskId);
```

### AI 相关

```typescript
const {
  chatMessages,
  aiLoading,
  sendChatMessage,
  recognizePlant,
  generateImage,
} = useStore();

// 发送聊天消息
await sendChatMessage("如何养护绿萝？", "deepseek");

// 植物识别
const file = event.target.files[0];
await recognizePlant(file);

// 生成图片
await generateImage("一棵健康的绿萝", "dall-e");
```

### 应用全局状态

```typescript
const {
  theme,
  language,
  notifications,
  setTheme,
  setLanguage,
  addNotification,
} = useStore();

// 切换主题
setTheme("dark");

// 切换语言
setLanguage("en-US");

// 添加通知
addNotification({
  type: "success",
  title: "操作成功",
  message: "植物已添加",
});
```

## 类型定义

所有类型定义都在 `types.ts` 文件中，包括：

- `User` - 用户信息
- `Plant` - 植物信息
- `CareTask` - 养护任务
- `CarePlan` - 养护计划
- `CareRecord` - 养护记录
- `ChatMessage` - 聊天消息
- `PlantRecognitionResult` - 植物识别结果
- `ImageGenerationResult` - 图片生成结果
- `Notification` - 通知

## 最佳实践

1. **按需使用**：只解构需要的状态和方法
2. **避免重复渲染**：使用 `useCallback` 和 `useMemo` 优化性能
3. **错误处理**：所有异步方法都包含错误处理
4. **类型安全**：使用 TypeScript 确保类型安全
5. **模块化**：不同功能的状态分离到不同的 store 文件

## 开发注意事项

1. 所有 API 调用都包含 token 认证
2. 状态更新使用不可变的方式
3. 异步操作都有 loading 状态
4. 错误信息会通过通知系统显示
5. 本地存储用于保存用户偏好设置
