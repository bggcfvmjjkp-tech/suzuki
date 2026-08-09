'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Car, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [carCount, setCarCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: cCount } = await supabase.from('cars').select('*', { count: 'exact', head: true });
      const { count: pCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      setCarCount(cCount || 0);
      setPostCount(pCount || 0);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
            aria-hidden
          />
          <p className="text-sm text-slate-500">Đang tải số liệu…</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Tổng số xe',
      value: carCount,
      icon: Car,
      href: '/admin/cars',
      hint: 'Danh mục & giá',
      accent: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Bài viết / Tin tức',
      value: postCount,
      icon: FileText,
      href: '/admin/posts',
      hint: 'Nội dung website',
      accent: 'from-violet-500 to-violet-600',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Tổng quan
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Chào mừng trở lại</h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Quản lý xe, bài viết, liên hệ khách hàng và brochure từ một giao diện thống nhất.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent} opacity-[0.12] transition-opacity group-hover:opacity-20`}
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
              <p className="relative mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="relative mt-1 text-3xl font-semibold tabular-nums text-slate-900">{card.value}</p>
              <p className="relative mt-2 text-sm text-slate-500">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900">Bắt đầu nhanh</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Chọn <strong className="font-medium text-slate-800">Quản lý xe</strong> để thêm hoặc chỉnh sửa thông tin
          sản phẩm. Dùng <strong className="font-medium text-slate-800">Quản lý liên hệ</strong> để xử lý đăng ký lái
          thử và yêu cầu từ khách.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <li className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Cập nhật brochure &amp; tài liệu tải về
          </li>
          <li className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Chỉnh số hotline &amp; thông tin site trong Cấu hình
          </li>
        </ul>
      </div>
    </div>
  );
}
