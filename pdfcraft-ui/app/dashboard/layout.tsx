import React from "react";
import { useRouter, usePathname, Link } from "../../lib/router";
import { useAuth } from "../../lib/authContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    router.replace("/login");
  };

  const initials = (auth.user?.email || "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-surface-page font-body text-on-surface antialiased min-h-screen flex">
      <aside className="w-[240px] bg-surface-card border-r border-border h-screen sticky top-0 flex flex-col justify-between shrink-0 z-40 select-none">
        <div className="flex flex-col">
          <div className="h-[56px] flex items-center px-4 border-b border-border gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500 text-white font-bold text-sm shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading-sm text-heading-sm text-gray-700 tracking-tight font-semibold">
                PdfCraft
              </span>
              <span className="font-caption text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono font-medium">
                MVP
              </span>
            </div>
          </div>

          <div className="px-3 pt-4">
            <div className="px-2 mb-2">
              <span className="font-caption text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                Workspace
              </span>
            </div>
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-brand-50 text-brand-600 font-medium shadow-xs"
                    : "text-gray-600 hover:bg-surface-hover hover:text-gray-700"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={pathname === "/dashboard" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  grid_view
                </span>
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/templates"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-label transition-colors ${
                  pathname.startsWith("/dashboard/templates")
                    ? "bg-brand-50 text-brand-600 font-medium shadow-xs"
                    : "text-gray-600 hover:bg-surface-hover hover:text-gray-700"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={
                    pathname.startsWith("/dashboard/templates")
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  description
                </span>
                <span>Templates</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover transition-colors">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-label font-medium shrink-0 border border-border">
              {initials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-label text-gray-700 truncate font-medium">
                {auth.user?.email?.split("@")[0] || "User"}
              </span>
              <span className="font-caption text-caption text-gray-400 truncate">
                {auth.user?.email || ""}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-danger-600 transition-colors flex items-center p-1 rounded hover:bg-white cursor-pointer"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[56px] bg-surface-card border-b border-border sticky top-0 z-30 flex items-center justify-between px-8 shrink-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label font-label text-body-sm">
            <span className="text-gray-400">App</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">Workspace</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">
              {pathname.startsWith("/dashboard/templates") ? "Templates" : "Overview"}
            </span>
          </nav>
        </header>

        <main className="flex-1 bg-surface-page p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
