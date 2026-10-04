import type { ThemeVars } from "./theme.types";

/**
 * react-vant 主题变量 → 设计令牌映射。
 * 值全部使用 variables.css 中定义的 CSS 变量引用，
 * 因此亮/暗主题切换（html[data-theme]）时 react-vant 组件自动跟随。
 * 表面色/弹层等少数变量在 index.css 中按组件类名做兼容覆盖。
 */
export const greenTheme: ThemeVars = {
  // 品牌与语义色
  "--rv-primary-color": "var(--primary)",
  "--rv-success-color": "var(--success)",
  "--rv-warning-color": "var(--warning)",
  "--rv-danger-color": "var(--danger)",
  "--rv-info-color": "var(--info)",
  "--rv-blue": "var(--info)",

  // 文字
  "--rv-text-color": "var(--text-1)",
  "--rv-text-color-2": "var(--text-2)",
  "--rv-text-color-3": "var(--text-3)",
  "--rv-field-label-color": "var(--text-2)",
  "--rv-field-input-text-color": "var(--text-1)",
  "--rv-field-placeholder-text-color": "var(--text-3)",

  // 背景
  "--rv-background-color": "var(--bg)",
  "--rv-background-color-light": "var(--surface-2)",
  "--rv-bottom-bar-background-color": "var(--surface)",
  "--rv-nav-bar-background-color": "transparent",
  "--rv-nav-bar-title-text-color": "var(--text-1)",
  "--rv-nav-bar-text-color": "var(--primary)",
  "--rv-nav-bar-icon-color": "var(--primary)",
  "--rv-cell-background-color": "transparent",
  "--rv-cell-text-color": "var(--text-1)",
  "--rv-cell-label-color": "var(--text-2)",
  "--rv-cell-value-color": "var(--text-3)",
  "--rv-dialog-background-color": "var(--surface)",
  "--rv-dialog-header-background-color": "var(--surface)",
  "--rv-picker-background-color": "var(--surface)",
  "--rv-picker-option-text-color": "var(--text-1)",

  // 描边与激活态
  "--rv-border-color": "var(--border)",
  "--rv-cell-border-color": "var(--divider)",
  "--rv-field-border-color": "var(--border)",
  "--rv-field-focus-border-color": "var(--primary)",
  "--rv-active-color": "var(--primary-soft)",
  "--rv-active-opacity": "0.75",
  "--rv-disabled-opacity": "0.5",

  // Tabbar
  "--rv-tabbar-item-active-color": "var(--primary)",
  "--rv-tabbar-item-text-color": "var(--text-3)",
  "--rv-tab-active-text-color": "var(--primary)",
  "--rv-tab-default-color": "var(--text-3)",

  // 按钮：胶囊形
  "--rv-button-border-radius": "var(--r-full)",
  "--rv-button-primary-background-color": "var(--grad-primary)",
  "--rv-button-primary-border-color": "transparent",
  "--rv-button-primary-text-color": "var(--on-primary)",
  "--rv-button-default-background-color": "var(--surface-2)",
  "--rv-button-default-border-color": "var(--border)",
  "--rv-button-default-text-color": "var(--text-1)",
  "--rv-button-danger-background-color": "var(--danger)",
  "--rv-button-danger-border-color": "transparent",
  "--rv-button-danger-text-color": "var(--on-primary)",

  // 控件
  "--rv-switch-on-background-color": "var(--primary)",
  "--rv-checkbox-checked-icon-color": "var(--primary)",
  "--rv-search-background-color": "var(--surface)",
  "--rv-search-content-background-color": "var(--surface-2)",
  "--rv-search-placeholder-color": "var(--text-3)",
};

/** 主题中复用的品牌色，供 JSX 内联样式引用（优先用 CSS 变量） */
export const brandColors = {
  primary: "#2e6b4e",
  primaryBright: "#3d8b63",
  success: "#3e8e63",
  warning: "#d9822b",
  danger: "#c4553d",
  info: "#3d7ea6",
} as const;
