'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import FileUpload from '@/app/components/FileUpload';

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    short_description: '',
    cover_image: '',
  });

  const fetchCategories = async () => {
    let { data } = await supabase.from('post_categories').select('*');
    
    if (!data || data.length === 0) {
      const defaultCategories = [
        { name: 'Sự kiện', slug: 'su-kien' },
        { name: 'Ưu đãi', slug: 'uu-dai' }
      ];
      const { data: insertedData } = await supabase.from('post_categories').insert(defaultCategories).select();
      if (insertedData) data = insertedData;
    }
    
    if (data) {
      setCategories(data);
      if (data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalSlug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const { error } = await supabase.from('posts').insert([
        {
          title: formData.title,
          slug: finalSlug,
          category_id: formData.category_id || null,
          short_description: formData.short_description,
          cover_image: formData.cover_image,
        }
      ]);

      if (error) throw error;
      
      alert('Thêm bài viết thành công!');
      router.push('/admin/posts');
    } catch (error: any) {
      console.error('Error adding post:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm bài viết mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Tiêu đề bài viết *</label>
          <input
            type="text" name="title" required
            value={formData.title} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="VD: Triển lãm VinFast – Vì Tương Lai Xanh"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Slug (Đường dẫn)</label>
            <input
              type="text" name="slug"
              value={formData.slug} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: trien-lam-vinfast"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Loại bài viết *</label>
            <select
              name="category_id" required
              value={formData.category_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Chọn loại --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <FileUpload 
          label="Ảnh bìa bài viết *" 
          bucket="images" 
          onUploadSuccess={(url) => setFormData({...formData, cover_image: url})} 
        />

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Mô tả ngắn</label>
          <textarea
            name="short_description" value={formData.short_description} onChange={handleChange}
            rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập mô tả ngắn hiện ở danh sách..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/admin/posts" className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition">
            Hủy
          </Link>
          <button 
            type="submit" disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} /> {loading ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
}
