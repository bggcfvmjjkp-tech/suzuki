'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import FileUpload from '@/app/components/FileUpload';

export default function NewCarPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    is_contact: false,
    short_description: '',
    main_image_link: '',
    general_description: '',
  });

  const fetchCategories = async () => {
    let { data } = await supabase.from('car_categories').select('*');
    
    if (!data || data.length === 0) {
      const defaultCategories = [
        { name: 'Các Dòng Xe VinFast Hiện Nay', slug: 'xe-hien-dai' },
        { name: 'Các Dòng Xe Dịch Vụ', slug: 'xe-dich-vu' }
      ];
      const { data: insertedData } = await supabase.from('car_categories').insert(defaultCategories).select();
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
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalSlug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      const { error } = await supabase.from('cars').insert([
        {
          name: formData.name,
          slug: finalSlug,
          category_id: formData.category_id || null,
          price: formData.price,
          is_contact: formData.is_contact,
          short_description: formData.short_description,
          main_image: formData.main_image_link,
          general_description: formData.general_description,
        }
      ]);

      if (error) throw error;
      
      alert('Thêm xe thành công!');
      router.push('/admin/cars');
    } catch (error: any) {
      console.error('Error adding car:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/cars" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm xe mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Tên xe *</label>
            <input
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: VF 3"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Slug (Đường dẫn)</label>
            <input
              type="text" name="slug"
              value={formData.slug} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: vf-3 (Để trống sẽ tự tạo)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Danh mục hiển thị *</label>
            <select
              name="category_id" required
              value={formData.category_id} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Giá xe *</label>
            <input
              type="text" name="price" required={!formData.is_contact}
              value={formData.price} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: 235.000.000 VNĐ"
              disabled={formData.is_contact}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <input
            type="checkbox" id="is_contact" name="is_contact"
            checked={formData.is_contact} onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
          <label htmlFor="is_contact" className="text-sm font-bold text-gray-800 cursor-pointer">
            Chỉ hiển thị nút "Liên Hệ" (Không hiện giá tiền)
          </label>
        </div>

        <FileUpload 
          label="Ảnh đại diện (Card trang chủ) *" 
          bucket="images" 
          onUploadSuccess={(url) => setFormData({...formData, main_image_link: url})} 
        />

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Mô tả ngắn (Card trang chủ)</label>
          <textarea
            name="short_description" value={formData.short_description} onChange={handleChange}
            rows={2} className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập mô tả ngắn..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Mô tả tổng quan (Trang chi tiết)</label>
          <textarea
            name="general_description" value={formData.general_description} onChange={handleChange}
            rows={4} className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập mô tả chi tiết..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/admin/cars" className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition">
            Hủy
          </Link>
          <button 
            type="submit" disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} /> {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
