import type { AppSlice, SliceCreator, Theme } from "./slices";

export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute("data-theme", theme);
};

export const createAppSlice: SliceCreator<AppSlice> = (set) => ({
  theme: "light",

  setTheme: (theme: Theme) => {
    set({ theme });
    applyTheme(theme);
  },
});
