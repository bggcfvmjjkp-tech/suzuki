'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FileUpload from "@/app/components/FileUpload";

export default function NewBrochure() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    file_url: "",
    file_size: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.file_url) {
      alert("Vui lòng nhập tên và link file PDF.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('brochures')
        .insert([formData]);
      
      if (error) throw error;
      router.push("/admin/brochures");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu brochure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brochures" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Brochure mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Tên sản phẩm *</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ví dụ: VinFast VF 3"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Dung lượng file (Ví dụ: 2.4 MB)</label>
            <input 
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ví dụ: 2.4 MB"
              value={formData.file_size}
              onChange={e => setFormData({...formData, file_size: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FileUpload 
            label="Hình ảnh đại diện *" 
            bucket="images" 
            accept="image/*"
            onUploadSuccess={(url) => setFormData({...formData, image_url: url})} 
          />
        </div>

        <div className="space-y-4">
          <FileUpload 
            label="File PDF Brochure *" 
            bucket="brochures" 
            accept="application/pdf"
            onUploadSuccess={(url) => setFormData({...formData, file_url: url})} 
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link 
            href="/admin/brochures"
            className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy
          </Link>
          <button 
            type="submit" disabled={isLoading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} /> {isLoading ? "Đang lưu..." : "Lưu Brochure"}
          </button>
        </div>
      </form>
    </div>
  );
}
