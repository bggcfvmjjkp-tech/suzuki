'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Car,
  LogOut,
  FileText,
  Mail,
  Settings,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý xe', href: '/admin/cars', icon: Car },
  { name: 'Quản lý bài viết', href: '/admin/posts', icon: FileText },
  { name: 'Quản lý liên hệ', href: '/admin/registrations', icon: Mail },
  { name: 'Quản lý Brochure', href: '/admin/brochures', icon: BookOpen },
  { name: 'Cấu hình Website', href: '/admin/settings', icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(session);
        if (parsed.isLoggedIn) {
          setIsAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/login');
  };

  const pageTitle = useMemo(() => {
    const item = ADMIN_NAV.find(
      (n) => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href))
    );
    return item?.name ?? 'Quản trị';
  }, [pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-10 py-12 shadow-sm">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
            aria-hidden
          />
          <p className="text-sm font-medium text-slate-600">Đang kiểm tra quyền truy cập…</p>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/40">
          VF
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">VinFast</p>
          <p className="truncate text-xs text-slate-400">Bảng điều khiển</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}
                strokeWidth={isActive ? 2.25 : 2}
              />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-5 w-5 shrink-0 opacity-80" />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          aria-label="Đóng menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,100vw-3rem)] flex-col bg-slate-900 shadow-2xl transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {sidebarContent}
          <button
            type="button"
            className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                {pageTitle}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                Quản trị nội dung &amp; khách hàng
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-sm text-slate-600 sm:inline">Xin chào</span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-semibold text-white shadow-md ring-2 ring-white"
                title="Admin"
              >
                A
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
