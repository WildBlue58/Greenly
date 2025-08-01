# Utils 工具函数库

本项目提供了一套完整的工具函数库，包含日期处理、图片处理、表单验证、本地存储、通用辅助函数等功能。

## 目录结构

```
src/utils/
├── index.ts          # 统一导出入口
├── date.ts           # 日期时间处理工具
├── image.ts          # 图片处理工具
├── validation.ts     # 表单验证工具
├── storage.ts        # 本地存储工具
├── helpers.ts        # 通用辅助函数
├── constants.ts      # 常量定义
├── request.ts        # HTTP请求工具
└── README.md         # 使用说明
```

## 快速开始

### 导入工具函数

```typescript
// 导入所有工具函数
import * as utils from "@/utils";

// 或者按需导入
import { formatDate, validateEmail, compressImage } from "@/utils";
```

### 使用示例

#### 日期时间处理

```typescript
import { formatDate, formatRelativeDate, addDays } from "@/utils/date";

// 格式化日期
const date = new Date();
console.log(formatDate(date, "YYYY-MM-DD")); // 2024-01-15
console.log(formatDate(date, "relative")); // 刚刚

// 添加天数
const tomorrow = addDays(date, 1);
console.log(formatDate(tomorrow)); // 2024-01-16 10:30:00
```

#### 图片处理

```typescript
import {
  compressImage,
  validateImageFile,
  createThumbnail,
} from "@/utils/image";

// 压缩图片
const compressedFile = await compressImage(file, {
  quality: 0.8,
  maxWidth: 800,
  maxHeight: 600,
});

// 验证图片文件
const validation = await validateImageFile(file, {
  maxSize: 5, // 5MB
  maxWidth: 4096,
  maxHeight: 4096,
});

if (validation.isValid) {
  // 创建缩略图
  const thumbnail = await createThumbnail(file, 200, 200);
}
```

#### 表单验证

```typescript
import {
  validateEmail,
  validatePassword,
  validateForm,
} from "@/utils/validation";

// 验证邮箱
const emailResult = validateEmail("user@example.com");
console.log(emailResult.isValid); // true

// 验证密码
const passwordResult = validatePassword("MyPassword123", {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
});

// 验证表单
const formData = {
  email: "user@example.com",
  password: "MyPassword123",
  username: "john_doe",
};

const validationSchema = {
  email: [{ required: true }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }],
  password: [{ required: true }, { minLength: 8 }],
  username: [{ required: true }, { minLength: 3 }],
};

const formResult = validateForm(formData, validationSchema);
console.log(formResult.isValid); // true
```

#### 本地存储

```typescript
import { setStorage, getStorage, setCache, getCache } from "@/utils/storage";

// 设置存储
setStorage("user", { id: 1, name: "John" });

// 获取存储
const user = getStorage("user");
console.log(user); // { id: 1, name: 'John' }

// 设置缓存（1小时过期）
setCache("plants", plantList, 3600000);

// 获取缓存
const cachedPlants = getCache("plants");
```

#### 通用辅助函数

```typescript
import {
  debounce,
  deepClone,
  formatFileSize,
  generateUUID,
} from "@/utils/helpers";

// 防抖函数
const debouncedSearch = debounce((query) => {
  // 执行搜索
}, 300);

// 深拷贝
const original = { user: { name: "John" } };
const cloned = deepClone(original);

// 格式化文件大小
console.log(formatFileSize(1024 * 1024)); // 1 MB

// 生成UUID
const uuid = generateUUID(); // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
```

## 常量使用

```typescript
import {
  APP_INFO,
  PLANT_CONSTANTS,
  HTTP_STATUS,
  ERROR_CODES,
} from "@/utils/constants";

console.log(APP_INFO.NAME); // 小养
console.log(PLANT_CONSTANTS.HEALTH_STATUS.EXCELLENT); // excellent
console.log(HTTP_STATUS.OK); // 200
console.log(ERROR_CODES.USER.LOGIN_FAILED); // LOGIN_FAILED
```

## 存储管理器

```typescript
import { StorageManager, CacheManager } from "@/utils/storage";

// 创建存储管理器
const storage = new StorageManager({
  type: "localStorage",
  prefix: "myapp",
  encrypt: false,
});

// 创建缓存管理器
const cache = new CacheManager({
  type: "localStorage",
  prefix: "cache",
  encrypt: false,
});

// 使用存储管理器
storage.set("user", userData);
const user = storage.get("user");
storage.remove("user");

// 使用缓存管理器
cache.set("plants", plantList);
const plants = cache.get("plants");
const stats = cache.stats();
```

## 图片处理管理器

```typescript
import {
  compressImage,
  cropImage,
  validateImageFile,
  IMAGE_FORMATS,
} from "@/utils/image";

// 压缩图片
const compressed = await compressImage(file, {
  quality: 0.8,
  maxWidth: 800,
  format: IMAGE_FORMATS.JPEG,
});

// 裁剪图片
const cropped = await cropImage(file, {
  x: 0,
  y: 0,
  width: 300,
  height: 300,
});

// 验证图片
const validation = await validateImageFile(file, {
  maxSize: 10,
  maxWidth: 4096,
  maxHeight: 4096,
});
```

## 验证规则预设

```typescript
import { VALIDATION_PRESETS } from "@/utils/validation";

// 使用预设的验证规则
const emailRules = VALIDATION_PRESETS.email;
const passwordRules = VALIDATION_PRESETS.password;
const phoneRules = VALIDATION_PRESETS.phone;
```

## 注意事项

1. **类型安全**: 所有工具函数都提供了完整的 TypeScript 类型定义
2. **错误处理**: 函数都包含了适当的错误处理机制
3. **性能优化**: 使用了防抖、节流等技术优化性能
4. **浏览器兼容**: 考虑了不同浏览器的兼容性问题
5. **安全性**: 提供了数据加密和验证功能

## 扩展开发

如需添加新的工具函数，请遵循以下规范：

1. 在对应的文件中添加函数
2. 添加完整的 TypeScript 类型定义
3. 添加详细的 JSDoc 注释
4. 在 `index.ts` 中导出新函数
5. 更新此文档

## 测试

建议为所有工具函数编写单元测试，确保功能的正确性和稳定性。
