'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState('info');
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    short_description: '',
    cover_image: '',
  });

  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      // Fetch categories
      const { data: catData } = await supabase.from('post_categories').select('*');
      if (catData) setCategories(catData);

      // Fetch post
      const { data: postData } = await supabase.from('posts').select('*').eq('id', id).single();
      if (postData) {
        setFormData({
          title: postData.title || '',
          slug: postData.slug || '',
          category_id: postData.category_id || '',
          short_description: postData.short_description || '',
          cover_image: postData.cover_image || '',
        });
      }

      // Fetch Blocks
      const { data: blockData } = await supabase.from('post_blocks').select('*').eq('post_id', id).order('sort_order', { ascending: true });
      if (blockData) setBlocks(blockData);

      setLoading(false);
    };
    
    fetchData();
  }, [id]);

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalSlug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { error } = await supabase.from('posts').update({
        title: formData.title,
        slug: finalSlug,
        category_id: formData.category_id || null,
        short_description: formData.short_description,
        cover_image: formData.cover_image,
      }).eq('id', id);

      if (error) throw error;
      alert('Cập nhật thông tin thành công!');
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `post_details/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('anh').upload(filePath, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);
    const { data } = supabase.storage.from('anh').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      setSaving(true);
      try {
        const url = await uploadImage(e.target.files[0]);
        callback(url);
      } catch(err: any) {
        alert(err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAddBlock = async (type: 'text' | 'image') => {
    const { data, error } = await supabase.from('post_blocks').insert([{ post_id: id, block_type: type, content: type === 'text' ? 'Nội dung mới' : '', sort_order: blocks.length }]).select();
    if (!error && data) setBlocks([...blocks, data[0]]);
  };

  const handleUpdateBlock = async (blockId: string, content: string) => {
    const newBlocks = blocks.map(b => b.id === blockId ? { ...b, content } : b);
    setBlocks(newBlocks);
    await supabase.from('post_blocks').update({ content }).eq('id', blockId);
  };

  const handleDeleteBlock = async (blockId: string) => {
    if(!confirm("Xóa khối này?")) return;
    await supabase.from('post_blocks').delete().eq('id', blockId);
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  if (loading) return <div className="p-8 text-center text-gray-900 font-bold">Đang tải...</div>;

  const inputStyles = "w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 truncate max-w-md">Sửa: {formData.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: 'info', name: 'Thông tin chung' },
              { id: 'blocks', name: 'Nội dung bài viết' },
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        <Link href="/admin/posts" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 whitespace-nowrap shadow-sm">
          &larr; Quay lại
        </Link>
      </div>

      <div className="p-6">
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Tiêu đề bài viết *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChangeInfo} className={inputStyles} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChangeInfo} className={inputStyles} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Loại bài viết</label>
                <select name="category_id" required value={formData.category_id} onChange={handleChangeInfo} className={inputStyles}>
                  <option value="">-- Chọn loại --</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {categories.length === 0 && (
                  <p className="text-red-600 text-xs mt-1 font-bold">Chưa có danh mục!</p>
                )}
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-5 bg-gray-50">
              <label className="block text-sm font-bold text-gray-900 mb-2">Ảnh bìa</label>
              <div className="flex gap-2 mb-2">
                <input type="text" name="cover_image" value={formData.cover_image} onChange={handleChangeInfo} className={`flex-1 ${inputStyles}`} placeholder="Dán link hoặc chọn file ->" />
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-700 shadow flex items-center justify-center shrink-0">
                  {saving ? '...' : 'Upload'}
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setFormData(p => ({...p, cover_image: url})))} />
                </label>
              </div>
              {formData.cover_image && <img src={formData.cover_image} className="h-32 object-cover mt-2 border rounded shadow-sm bg-white p-1" />}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mô tả ngắn</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChangeInfo} className={inputStyles} rows={3}></textarea>
            </div>
            <button type="submit" disabled={saving} className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors">
              {saving ? 'Đang lưu...' : 'Lưu thông tin bài viết'}
            </button>
          </form>
        )}

        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 gap-4">
              <p className="text-gray-900 font-medium">Thêm nội dung bài viết (Text/Image).</p>
              <div className="flex gap-3">
                <button onClick={() => handleAddBlock('text')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm Đoạn Văn</button>
                <button onClick={() => handleAddBlock('image')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700">+ Thêm Hình Ảnh</button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center font-bold rounded-full shrink-0">{index + 1}</div>
                  <div className="flex-1 w-full">
                    {block.block_type === 'text' ? (
                      <textarea value={block.content} onChange={(e) => handleUpdateBlock(block.id, e.target.value)} className={`${inputStyles} min-h-[150px] resize-y`} placeholder="Nhập nội dung..."></textarea>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input type="text" value={block.content} onChange={(e) => handleUpdateBlock(block.id, e.target.value)} className={`flex-1 ${inputStyles}`} placeholder="Dán link ảnh" />
                          <label className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-gray-900 shadow flex items-center justify-center">
                            {saving ? '...' : 'Upload'}
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => handleUpdateBlock(block.id, url))} />
                          </label>
                        </div>
                        {block.content && <img src={block.content} className="max-h-64 object-contain border border-gray-300 rounded shadow-sm bg-white p-1" />}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleDeleteBlock(block.id)} className="text-red-600 font-bold p-3 shrink-0 hover:bg-red-100 rounded-lg transition-colors">Xóa</button>
                </div>
              ))}
              {blocks.length === 0 && <p className="text-gray-600 font-medium text-center py-4">Chưa có nội dung nào.</p>}
            </div>

            {blocks.length > 0 && (
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <button onClick={() => handleAddBlock('text')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm Đoạn Văn</button>
                <button onClick={() => handleAddBlock('image')} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700">+ Thêm Hình Ảnh</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
