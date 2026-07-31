import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { navigation } from "@/constants/navigation";
import useSidebarStore from "@/store/sidebarStore";

export default function Sidebar() {
  const { pathname } = useLocation();
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const closeMobile = useSidebarStore((state) => state.closeMobile);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && closeMobile();
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity md:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside className={`sidebar-shell group fixed inset-y-0 left-0 z-50 w-72 overflow-hidden border-r border-slate-800 bg-[#101d2d] shadow-2xl shadow-slate-950/20 transition-transform duration-300 ease-out md:z-40 md:w-[76px] md:translate-x-0 md:transition-[width] md:hover:w-72 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Logo />
        <button type="button" onClick={closeMobile} className="absolute right-3 top-[18px] flex size-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white md:hidden" aria-label="Close menu"><X className="size-5" /></button>
        <nav className="h-[calc(100dvh-76px)] space-y-1 overflow-x-hidden overflow-y-auto px-3 py-4 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">{navigation.map((item) => <SidebarItem key={item.title} item={item} />)}</nav>
      </aside>
    </>
  );
}
