'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, FileText, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BrochuresList() {
  const [brochures, setBrochures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrochures();
  }, []);

  const fetchBrochures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBrochures(data || []);
    } catch (err) {
      console.error("Lỗi fetch brochure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrochure = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa brochure này?")) return;
    try {
      const { error } = await supabase
        .from('brochures')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBrochures();
    } catch (err) {
      alert("Lỗi xóa brochure");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Quản lý Brochure</h1>
          <p className="mt-0.5 text-sm text-slate-500">Tài liệu PDF và hình ảnh đính kèm.</p>
        </div>
        <Link
          href="/admin/brochures/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={20} /> Thêm mới
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-slate-200/80 bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Hình ảnh
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Dung lượng
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                    Đang tải dữ liệu…
                  </td>
                </tr>
              ) : brochures.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                    Chưa có brochure nào.
                  </td>
                </tr>
              ) : (
                brochures.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-contain" />
                        ) : (
                          <FileText size={20} className="text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 sm:px-6 sm:py-4">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-600 sm:px-6 sm:py-4">
                      {item.file_size || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                      <div className="flex justify-end gap-1">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Tải về xem thử"
                        >
                          <Download size={18} />
                        </a>
                        <Link
                          href={`/admin/brochures/${item.id}`}
                          className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteBrochure(item.id)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
