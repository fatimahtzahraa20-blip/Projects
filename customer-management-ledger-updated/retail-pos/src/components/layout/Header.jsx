import { LogOut, Menu, Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import useSidebarStore from "@/store/sidebarStore";
import useTheme from "@/hooks/useTheme";
import QuickAccess from "./QuickAccess";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const clearAuth = useAuthStore((state) => state.logout);
  const openMobile = useSidebarStore((state) => state.openMobile);
  const { theme, setTheme } = useTheme();
  const title = pathname === "/dashboard" ? "Dashboard" : pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ") || "Dashboard";
  const handleLogout = async () => {
    const { error } = await logout();
    if (error) { toast.error(error.message); return; }
    clearAuth();
    navigate("/login", { replace: true });
  };
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-slate-800 bg-[#101d2d]/95 px-3 py-2 text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl sm:h-[76px] sm:px-6 sm:py-0 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button type="button" onClick={openMobile} className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 md:hidden" aria-label="Open navigation"><Menu className="size-5" /></button>
        <div className="min-w-0"><p className="hidden text-xs font-medium text-slate-400 sm:block">Retail Pro / Workspace</p><h2 className="truncate text-base font-bold capitalize text-white sm:mt-0.5 sm:text-lg">{title}</h2></div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="hidden sm:block"><QuickAccess /></div>
        <div className="hidden h-10 items-center rounded-md border border-white/10 bg-white/5 p-1 lg:flex" aria-label="Color theme">
          {themes.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => setTheme(value)} title={`${label} theme`} className={`flex size-8 items-center justify-center rounded transition-all duration-200 ${theme === value ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-white"}`}><Icon className="size-4" /></button>)}
        </div>
        <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Change theme" className="hidden size-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white sm:flex lg:hidden">{theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}</button>
        <NotificationBell />
        <div className="flex h-10 items-center rounded-md border border-white/10 bg-white/5 p-1 shadow-sm sm:h-11">
          <div className="hidden items-center gap-2 px-3 sm:flex"><div className="flex size-7 items-center justify-center rounded-md bg-[#101d2d] text-white"><ShieldCheck className="size-4" /></div><div className="hidden text-left lg:block"><p className="text-xs font-bold leading-4 text-white">Admin</p><p className="text-[10px] leading-3 text-slate-400">Administrator</p></div></div>
          <button type="button" onClick={handleLogout} title="Log out" aria-label="Log out" className="group/logout flex h-8 items-center gap-2 rounded px-2 text-xs font-semibold text-slate-300 transition-all duration-300 hover:bg-red-500/15 hover:text-red-300 sm:px-3"><LogOut className="size-4 transition-transform duration-300 group-hover/logout:translate-x-0.5" /><span className="hidden lg:inline">Logout</span></button>
        </div>
      </div>
    </header>
  );
}
