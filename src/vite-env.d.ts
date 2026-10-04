/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** DeepSeek API 密钥（.env.local 中配置，仅开发/演示用途） */
  readonly VITE_DEEPSEEK_API_KEY?: string;
  /** Kimi (Moonshot) API 密钥（.env.local 中配置，仅开发/演示用途） */
  readonly VITE_KIMI_API_KEY?: string;
  /** API 基础地址，默认 /api */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
