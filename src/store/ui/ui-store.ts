import { create } from "zustand";

interface State {
  isSideMenuOpen: boolean;

  openSideMenu: () => void;
  closeIsdeMenu: () => void;
}

export const useUiStore = create<State>()((set) => ({
  isSideMenuOpen: false,

  openSideMenu: () => set({ isSideMenuOpen: true }),
  closeIsdeMenu: () => set({ isSideMenuOpen: false }),
}));
