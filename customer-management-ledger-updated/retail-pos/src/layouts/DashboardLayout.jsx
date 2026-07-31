import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] transition-colors dark:bg-slate-950">
      <Sidebar />
      <div className="min-w-0 md:pl-[76px]">
        <Header />
        <main className="mx-auto max-w-[1600px] overflow-x-hidden p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
