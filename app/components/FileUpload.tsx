'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  bucket: string;
  label?: string;
  accept?: string;
  currentUrl?: string;
}

export default function FileUpload({ onUploadSuccess, bucket, label, accept = "image/*", currentUrl }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [mode, setMode] = useState<'upload' | 'link'>(currentUrl && !currentUrl.includes('supabase.co') ? 'link' : 'upload');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error('Bạn phải chọn một file.');

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const url = data.publicUrl;
      setPreview(url);
      onUploadSuccess(url);
    } catch (error: any) {
      alert(error.message || 'Lỗi khi upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {label && <label className="block text-sm font-bold text-gray-700">{label}</label>}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
           <button 
             type="button" onClick={() => setMode('upload')}
             className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${mode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
              Tải lên
           </button>
           <button 
             type="button" onClick={() => setMode('link')}
             className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${mode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
              Dán Link
           </button>
        </div>
      </div>
      
      {mode === 'upload' ? (
        <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="relative group shrink-0">
            <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white overflow-hidden group-hover:border-blue-400 transition-colors">
              {preview ? (
                accept.includes("image") ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-blue-600">
                     <FileText size={24} />
                     <span className="text-[10px] font-bold mt-1 uppercase">Tài liệu</span>
                  </div>
                )
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}
            </div>
            <input type="file" accept={accept} onChange={handleUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-[11px] text-gray-500 leading-tight">Nhấn vào ô bên trái để chọn file từ máy tính. {accept.includes("image") ? "Định dạng: JPG, PNG, WEBP." : "Định dạng: PDF."}</p>
            {preview && <div className="flex items-center gap-2 text-xs font-bold text-green-600"><CheckCircle size={14} /> Đã có file</div>}
            <input type="text" readOnly value={preview} placeholder="URL file..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[10px] text-gray-400 bg-white outline-none" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
           <input 
             type="text"
             className="w-full border border-gray-300 rounded-lg p-2.5 text-black font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
             placeholder="Dán đường dẫn (URL) ảnh hoặc file vào đây..."
             value={preview}
             onChange={(e) => { setPreview(e.target.value); onUploadSuccess(e.target.value); }}
           />
           {preview && accept.includes("image") && (
             <div className="w-32 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 p-1">
                <img src={preview} className="w-full h-full object-contain" alt="Link preview" />
             </div>
           )}
        </div>
      )}
    </div>
  );
}
