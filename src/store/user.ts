import { seedUser } from "../mocks/seed";
import type { User } from "./types";
import type { SliceCreator, UserSlice } from "./slices";

export const createUserSlice: SliceCreator<UserSlice> = (set) => ({
  user: seedUser,

  updateProfile: async (profile: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          ...profile,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  },

  logout: () => {
    set({ user: { ...seedUser } });
  },
});
