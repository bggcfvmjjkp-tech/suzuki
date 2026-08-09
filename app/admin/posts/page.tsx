'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, post_categories(name)`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      alert('Xóa thành công!');
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Đã có lỗi xảy ra khi xóa!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Danh sách bài viết</h2>
          <p className="mt-0.5 text-sm text-slate-500">Quản lý tin tức và nội dung blog.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm bài viết mới
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3 sm:px-6">Ảnh bìa</th>
              <th className="px-4 py-3 sm:px-6">Tiêu đề</th>
              <th className="px-4 py-3 sm:px-6">Loại</th>
              <th className="px-4 py-3 sm:px-6">Ngày tạo</th>
              <th className="px-4 py-3 text-center sm:px-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                  Chưa có bài viết nào.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-3 sm:px-6">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-10 w-16 rounded-md bg-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                        Trống
                      </div>
                    )}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm font-medium text-slate-900 sm:max-w-xs sm:px-6">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 sm:px-6">
                    {post.post_categories?.name || 'Chưa phân loại'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 sm:px-6">
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Xóa"
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
  );
}
