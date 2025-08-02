# AI API 配置说明

## 环境变量配置

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# DeepSeek API密钥
# 获取地址: https://platform.deepseek.com/api_keys
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Kimi API密钥
# 获取地址: https://platform.moonshot.cn/console/api-keys
VITE_KIMI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. 获取API密钥

#### DeepSeek API密钥获取

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的API密钥
5. 复制密钥并填入 `.env.local` 文件

#### Kimi API密钥获取

1. 访问 [月之暗面平台](https://platform.moonshot.cn/)
2. 注册/登录账号
3. 进入控制台的 API Keys 页面
4. 创建新的API密钥
5. 复制密钥并填入 `.env.local` 文件

### 3. 使用说明

- 配置完成后重启开发服务器
- 在聊天界面可以选择不同的AI模型
- 支持的模型：
  - **DeepSeek**: 中文对话和逻辑推理能力强
  - **Kimi**: 支持超长上下文，适合复杂对话

### 4. 故障排除

如果遇到以下错误：

- `API密钥未配置`: 检查环境变量是否正确设置
- `API请求失败`: 检查网络连接和API密钥是否有效
- `API响应格式不正确`: 检查API服务是否正常

### 5. 安全注意事项

- 不要将API密钥提交到版本控制系统
- 定期轮换API密钥
- 监控API使用量和费用
- 在生产环境中使用环境变量管理服务

### 6. 费用说明

- DeepSeek: 按token计费，具体价格参考官方文档
- Kimi: 按token计费，具体价格参考官方文档
- 建议在开发期间设置使用限额
