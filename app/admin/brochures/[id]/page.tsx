'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FileUpload from "@/app/components/FileUpload";

export default function EditBrochure() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    file_url: "",
    file_size: ""
  });

  useEffect(() => {
    if (id) fetchBrochure();
  }, [id]);

  const fetchBrochure = async () => {
    try {
      const { data, error } = await supabase
        .from('brochures')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải thông tin brochure");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('brochures')
        .update(formData)
        .eq('id', id);
      
      if (error) throw error;
      router.push("/admin/brochures");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật brochure");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center font-bold">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brochures" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa Brochure</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Tên sản phẩm *</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Dung lượng file</label>
            <input 
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            currentUrl={formData.image_url}
            onUploadSuccess={(url) => setFormData({...formData, image_url: url})} 
          />
        </div>

        <div className="space-y-4">
          <FileUpload 
            label="File PDF Brochure *" 
            bucket="brochures" 
            accept="application/pdf"
            currentUrl={formData.file_url}
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
            type="submit" disabled={isSaving}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save size={20} /> {isSaving ? "Đang lưu..." : "Cập nhật Brochure"}
          </button>
        </div>
      </form>
    </div>
  );
}
