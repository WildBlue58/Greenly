# Hooks 使用说明

本项目提供了一系列自定义 React Hooks，用于简化常见业务逻辑的开发。

## 认证相关 Hooks

### useAuth

提供用户认证相关的功能，包括登录、注册、登出等。

```typescript
import { useAuth } from '@/hooks';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    login, 
    register, 
    logout 
  } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email: 'user@example.com', password: 'password' });
    if (result.success) {
      console.log('登录成功');
    } else {
      console.error('登录失败:', result.error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>登出</button>
      ) : (
        <button onClick={handleLogin}>登录</button>
      )}
    </div>
  );
};
```

## 植物管理 Hooks

### usePlant

提供植物列表管理、添加、更新、删除等功能。

```typescript
import { usePlant } from '@/hooks';

const PlantList = () => {
  const { 
    plants, 
    plantsLoading, 
    fetchPlants, 
    addPlant, 
    plantStats 
  } = usePlant();

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleAddPlant = async () => {
    const result = await addPlant({
      name: '绿萝',
      species: 'Epipremnum aureum',
      location: '客厅',
    });
    
    if (result.success) {
      console.log('添加植物成功');
    }
  };

  return (
    <div>
      <div>植物总数: {plantStats.total}</div>
      <div>健康植物: {plantStats.healthy}</div>
      {plants.map(plant => (
        <div key={plant.id}>{plant.name}</div>
      ))}
    </div>
  );
};
```

## 养护管理 Hooks

### useCare

提供养护计划、任务、记录管理等功能。

```typescript
import { useCare } from '@/hooks';

const CareDashboard = () => {
  const { 
    careTasks, 
    careLoading, 
    fetchCareTasks, 
    addCareTask, 
    careStats 
  } = useCare();

  const handleAddTask = async () => {
    const result = await addCareTask({
      plantId: 'plant-1',
      plantName: '绿萝',
      type: 'water',
      title: '浇水',
      description: '给绿萝浇水',
      dueDate: new Date().toISOString(),
      priority: 'high',
    });
    
    if (result.success) {
      console.log('添加任务成功');
    }
  };

  return (
    <div>
      <div>总任务数: {careStats.totalTasks}</div>
      <div>完成率: {careStats.completionRate}%</div>
      {careTasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
};
```

## AI 功能 Hooks

### useAI

提供AI聊天、植物识别、图片生成等功能。

```typescript
import { useAI } from '@/hooks';

const AIChat = () => {
  const { 
    chatMessages, 
    aiLoading, 
    sendChatMessage, 
    recognizePlant 
  } = useAI();

  const handleSendMessage = async () => {
    const result = await sendChatMessage('如何养护绿萝？', 'deepseek');
    if (result.success) {
      console.log('发送消息成功');
    }
  };

  const handleRecognizePlant = async (file: File) => {
    const result = await recognizePlant(file);
    if (result.success) {
      console.log('植物识别成功');
    }
  };

  return (
    <div>
      {chatMessages.map(message => (
        <div key={message.id}>
          {message.role}: {message.content}
        </div>
      ))}
      <button onClick={handleSendMessage}>发送消息</button>
    </div>
  );
};
```

## 通知管理 Hooks

### useNotification

提供通知管理、显示、隐藏等功能。

```typescript
import { useNotification } from '@/hooks';

const NotificationExample = () => {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo,
    notifications,
    unreadCount 
  } = useNotification();

  const handleSuccess = () => {
    showSuccess('成功', '操作已完成');
  };

  const handleError = () => {
    showError('错误', '操作失败');
  };

  return (
    <div>
      <div>未读通知: {unreadCount}</div>
      <button onClick={handleSuccess}>显示成功通知</button>
      <button onClick={handleError}>显示错误通知</button>
    </div>
  );
};
```

## 本地存储 Hooks

### useLocalStorage

提供localStorage的封装功能，支持自动序列化和反序列化。

```typescript
import { useLocalStorage } from '@/hooks';

const LocalStorageExample = () => {
  const [value, setValue, removeValue] = useLocalStorage('myKey', 'default');

  return (
    <div>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button onClick={() => removeValue()}>清除</button>
    </div>
  );
};
```

### useThemeStorage

主题设置本地存储。

```typescript
import { useThemeStorage } from '@/hooks';

const ThemeToggle = () => {
  const [theme, setTheme] = useThemeStorage();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题: {theme}
    </button>
  );
};
```

### useUserPreferences

用户偏好设置本地存储。

```typescript
import { useUserPreferences } from '@/hooks';

const UserSettings = () => {
  const [preferences, setPreferences] = useUserPreferences();

  const toggleNotifications = () => {
    setPreferences(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={preferences.notifications}
          onChange={toggleNotifications}
        />
        启用通知
      </label>
    </div>
  );
};
```

### useCache

缓存管理，支持TTL（生存时间）。

```typescript
import { useCache } from '@/hooks';

const CacheExample = () => {
  const { getValue, setValue, isValid } = useCache('userData', 3600000); // 1小时

  const loadUserData = () => {
    const cached = getValue();
    if (cached && isValid()) {
      console.log('使用缓存数据:', cached);
    } else {
      // 从API获取数据
      const newData = { name: 'John', age: 30 };
      setValue(newData);
    }
  };

  return (
    <button onClick={loadUserData}>加载用户数据</button>
  );
};
```

## 使用建议

1. **错误处理**: 所有异步操作都返回 `{ success: boolean, error?: string }` 格式的结果，请妥善处理错误情况。

2. **性能优化**: 使用 `useCallback` 和 `useMemo` 来优化性能，避免不必要的重新渲染。

3. **类型安全**: 所有 hooks 都提供了完整的 TypeScript 类型支持，建议在开发时启用严格模式。

4. **状态管理**: 这些 hooks 与 Zustand store 紧密集成，确保状态的一致性。

5. **本地存储**: 使用 `useLocalStorage` 系列 hooks 来管理用户偏好和缓存数据。

## 注意事项

- 确保在使用 hooks 之前已经正确配置了 store
- 异步操作都有加载状态，请妥善处理 loading 状态
- 本地存储操作都有错误处理，但建议在生产环境中添加额外的错误处理逻辑
- 通知系统会自动隐藏通知，但也可以手动控制显示时间 