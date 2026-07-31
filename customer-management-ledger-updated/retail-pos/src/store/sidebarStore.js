import { create } from "zustand";

const useSidebarStore = create((set) => ({
  openMenus: {},
  mobileOpen: false,
  toggleMenu: (menu) =>
    set((state) => ({
      openMenus: {
        ...state.openMenus,
        [menu]: !state.openMenus[menu]
      }
    })),
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen }))
}));

export default useSidebarStore;
