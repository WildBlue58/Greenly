/**
 * 应用存储仓库（repository）
 *
 * 整个应用只有这一个持久化键：zustand persist 中间件把需要持久化的
 * 状态整体序列化到这里。所有持久化读写的出入口都收敛在本模块，
 * 以后接入真实后端时只需替换本层的实现。
 */

export const APP_STORAGE_KEY = "greenly-app-state";
export const STORAGE_VERSION = 1;

interface PersistedState {
  user?: unknown;
  plants?: unknown;
  carePlans?: unknown;
  careRecords?: unknown;
  careTasks?: unknown;
  theme?: unknown;
}

/**
 * 旧版本数据迁移：重构前数据分散在 8 个独立的 localStorage 键中。
 * 若存在旧键而新键尚不存在，把旧数据折叠进新键，避免用户数据丢失。
 * 只做一次：迁移后旧键保留不删（回滚安全），新键存在后本函数不再生效。
 */
export const installLegacyMigration = (): void => {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(APP_STORAGE_KEY)) return;

  const read = <T>(key: string): T | undefined => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  };

  const legacy: PersistedState = {
    plants: read("plants"),
    carePlans: read("carePlans"),
    careRecords: read("careRecords"),
    careTasks: read("careTasks"),
    user: read("user"),
    theme: read("theme"),
  };

  const hasAny = Object.values(legacy).some((v) => v !== undefined);
  if (!hasAny) return;

  try {
    localStorage.setItem(
      APP_STORAGE_KEY,
      JSON.stringify({ state: legacy, version: STORAGE_VERSION })
    );
  } catch (error) {
    console.error("旧数据迁移失败:", error);
  }
};

/** 读取当前持久化的状态快照（供诊断/调试用） */
export const readPersistedState = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: PersistedState };
    return parsed.state ?? null;
  } catch {
    return null;
  }
};
