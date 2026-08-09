'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCarPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Tabs: 'info' | 'colors' | 'blocks' | 'specs'
  const [activeTab, setActiveTab] = useState('info');
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    is_contact: false,
    short_description: '',
    main_image: '',
    general_description: '',
  });

  // State quản lý mảng màu sắc, block, thông số
  const [colors, setColors] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      // Fetch danh mục
      const { data: catData } = await supabase.from('car_categories').select('*');
      if (catData) setCategories(catData);

      // Fetch xe
      const { data: carData } = await supabase.from('cars').select('*').eq('id', id).single();
      if (carData) {
        setFormData({
          name: carData.name || '',
          slug: carData.slug || '',
          category_id: carData.category_id || '',
          price: carData.price || '',
          is_contact: carData.is_contact || false,
          short_description: carData.short_description || '',
          main_image: carData.main_image || '',
          general_description: carData.general_description || '',
        });
      }

      // Fetch Colors
      const { data: colorData } = await supabase.from('car_colors').select('*').eq('car_id', id).order('sort_order', { ascending: true });
      if (colorData) setColors(colorData);

      // Fetch Blocks
      const { data: blockData } = await supabase.from('car_detail_blocks').select('*').eq('car_id', id).order('sort_order', { ascending: true });
      if (blockData) setBlocks(blockData);

      // Fetch Specs
      const { data: specData } = await supabase.from('car_specifications').select('*').eq('car_id', id).order('sort_order', { ascending: true });
      if (specData) setSpecs(specData);

      setLoading(false);
    };
    
    fetchData();
  }, [id]);

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalSlug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { error } = await supabase.from('cars').update({
        name: formData.name,
        slug: finalSlug,
        category_id: formData.category_id || null,
        price: formData.price,
        is_contact: formData.is_contact,
        short_description: formData.short_description,
        main_image: formData.main_image,
        general_description: formData.general_description,
      }).eq('id', id);

      if (error) throw error;
      alert('Cập nhật thông tin thành công!');
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ----- Xử lý Upload Ảnh Chung -----
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `details/${fileName}`;
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

  // ----- Xử lý Màu sắc (Colors) -----
  const handleAddColor = async () => {
    const { data, error } = await supabase.from('car_colors').insert([{ car_id: id, color_name: 'Màu mới', hex_code: '#000000', image_url: '', sort_order: colors.length }]).select();
    if (!error && data) setColors([...colors, data[0]]);
  };
  const handleUpdateColor = async (colorId: string, field: string, value: string) => {
    const newColors = colors.map(c => c.id === colorId ? { ...c, [field]: value } : c);
    setColors(newColors);
    await supabase.from('car_colors').update({ [field]: value }).eq('id', colorId);
  };
  const handleDeleteColor = async (colorId: string) => {
    if(!confirm("Xóa màu này?")) return;
    await supabase.from('car_colors').delete().eq('id', colorId);
    setColors(colors.filter(c => c.id !== colorId));
  };

  // ----- Xử lý Chi tiết (Blocks) -----
  const handleAddBlock = async (type: 'text' | 'image' | 'video') => {
    const { data, error } = await supabase.from('car_detail_blocks').insert([{ car_id: id, block_type: type, content: type === 'text' ? 'Nội dung mới' : '', sort_order: blocks.length }]).select();
    if (!error && data) setBlocks([...blocks, data[0]]);
  };
  const handleUpdateBlock = async (blockId: string, content: string) => {
    const newBlocks = blocks.map(b => b.id === blockId ? { ...b, content } : b);
    setBlocks(newBlocks);
    await supabase.from('car_detail_blocks').update({ content }).eq('id', blockId);
  };
  const handleDeleteBlock = async (blockId: string) => {
    if(!confirm("Xóa khối này?")) return;
    await supabase.from('car_detail_blocks').delete().eq('id', blockId);
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  // ----- Xử lý Thông số (Specs) -----
  const handleAddSpec = async () => {
    const { data, error } = await supabase.from('car_specifications').insert([{ car_id: id, image_url: '', sort_order: specs.length }]).select();
    if (!error && data) setSpecs([...specs, data[0]]);
  };
  const handleUpdateSpec = async (specId: string, url: string) => {
    const newSpecs = specs.map(s => s.id === specId ? { ...s, image_url: url } : s);
    setSpecs(newSpecs);
    await supabase.from('car_specifications').update({ image_url: url }).eq('id', specId);
  };
  const handleDeleteSpec = async (specId: string) => {
    if(!confirm("Xóa ảnh thông số này?")) return;
    await supabase.from('car_specifications').delete().eq('id', specId);
    setSpecs(specs.filter(s => s.id !== specId));
  };

  if (loading) return <div className="p-8 text-center text-gray-900 font-bold">Đang tải...</div>;

  const inputStyles = "w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết xe: {formData.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: 'info', name: 'Thông tin chung' },
              { id: 'colors', name: 'Màu sắc' },
              { id: 'blocks', name: 'Bài viết chi tiết' },
              { id: 'specs', name: 'Thông số kỹ thuật' }
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
        <Link href="/admin/cars" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 whitespace-nowrap shadow-sm">
          &larr; Quay lại
        </Link>
      </div>

      <div className="p-6">
        {/* TAB 1: THÔNG TIN CHUNG */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Tên xe *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChangeInfo} className={inputStyles} placeholder="VD: VF 3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChangeInfo} className={inputStyles} placeholder="VD: vf-3" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Danh mục</label>
                <select name="category_id" required value={formData.category_id} onChange={handleChangeInfo} className={inputStyles}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Giá xe</label>
                <input type="text" name="price" value={formData.price} onChange={handleChangeInfo} disabled={formData.is_contact} className={inputStyles} placeholder="VD: 235.000.000 VNĐ" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input type="checkbox" name="is_contact" checked={formData.is_contact} onChange={handleChangeInfo} className="w-5 h-5 text-blue-600 rounded" />
              <label className="font-bold text-gray-900">Liên hệ (Không hiện giá)</label>
            </div>
            <div className="border border-gray-300 rounded-lg p-5 bg-gray-50">
              <label className="block text-sm font-bold text-gray-900 mb-2">Link Ảnh đại diện</label>
              <div className="flex gap-2 mb-2">
                <input type="text" name="main_image" value={formData.main_image} onChange={handleChangeInfo} className={`flex-1 ${inputStyles}`} placeholder="Dán link hoặc chọn file ->" />
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-700 shadow flex items-center justify-center shrink-0">
                  {saving ? '...' : 'Upload File'}
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setFormData(p => ({...p, main_image: url})))} />
                </label>
              </div>
              {formData.main_image && <img src={formData.main_image} className="h-24 object-contain mt-2 border rounded shadow-sm bg-white p-1" />}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mô tả ngắn</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChangeInfo} className={inputStyles} rows={2} placeholder="Mô tả ngắn hiển thị ở card..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mô tả tổng quan</label>
              <textarea name="general_description" value={formData.general_description} onChange={handleChangeInfo} className={inputStyles} rows={4} placeholder="Mô tả dài hiển thị trong trang chi tiết..."></textarea>
            </div>
            <button type="submit" disabled={saving} className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors">
              {saving ? 'Đang lưu...' : 'Lưu thông tin chung'}
            </button>
          </form>
        )}

        {/* TAB 2: MÀU SẮC */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-medium">Quản lý cục tròn chọn màu và ảnh tương ứng ở trang chi tiết.</p>
              <button onClick={handleAddColor} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm màu mới</button>
            </div>
            
            <div className="grid gap-4">
              {colors.map((color) => (
                <div key={color.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-center">
                  <input type="color" value={color.hex_code} onChange={(e) => handleUpdateColor(color.id, 'hex_code', e.target.value)} className="w-12 h-12 rounded cursor-pointer shrink-0" title="Chọn mã màu" />
                  <div className="flex-1 space-y-3 w-full">
                    <input type="text" value={color.color_name} onChange={(e) => handleUpdateColor(color.id, 'color_name', e.target.value)} className={inputStyles} placeholder="Tên màu (VD: Đỏ)" />
                    <div className="flex gap-2">
                      <input type="text" value={color.image_url} onChange={(e) => handleUpdateColor(color.id, 'image_url', e.target.value)} className={`flex-1 ${inputStyles}`} placeholder="Link ảnh xe tương ứng màu này" />
                      <label className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-gray-900 shrink-0 shadow flex items-center justify-center">
                        {saving ? '...' : 'Upload'}
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => handleUpdateColor(color.id, 'image_url', url))} />
                      </label>
                    </div>
                  </div>
                  {color.image_url && <img src={color.image_url} className="w-32 h-20 object-contain bg-white border border-gray-300 rounded shadow-sm p-1 shrink-0" />}
                  <button onClick={() => handleDeleteColor(color.id)} className="text-red-600 font-bold p-3 shrink-0 hover:bg-red-100 rounded-lg transition-colors">Xóa</button>
                </div>
              ))}
              {colors.length === 0 && <p className="text-gray-600 font-medium text-center py-4">Chưa có màu nào.</p>}
            </div>

            {/* Nút Thêm ở dưới cùng */}
            {colors.length > 0 && (
              <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
                <button onClick={handleAddColor} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm màu mới</button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BÀI VIẾT (BLOCKS) */}
        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 gap-4">
              <p className="text-gray-900 font-medium">Thêm văn bản, hình ảnh hoặc video giới thiệu xe từ YouTube.</p>
              <div className="flex gap-3">
                <button onClick={() => handleAddBlock('text')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm Đoạn Văn</button>
                <button onClick={() => handleAddBlock('image')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700">+ Thêm Hình Ảnh</button>
                <button onClick={() => handleAddBlock('video')} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700">+ Thêm Video YouTube</button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center font-bold rounded-full shrink-0">{index + 1}</div>
                  <div className="flex-1 w-full">
                    {block.block_type === 'text' ? (
                      <textarea value={block.content} onChange={(e) => handleUpdateBlock(block.id, e.target.value)} className={`${inputStyles} min-h-[200px] resize-y`} placeholder="Nhập nội dung văn bản..."></textarea>
                    ) : block.block_type === 'video' ? (
                      <div className="space-y-3">
                        <input type="url" value={block.content} onChange={(e) => handleUpdateBlock(block.id, e.target.value)} className={inputStyles} placeholder="Dán link YouTube hoặc link embed: https://www.youtube.com/embed/..." />
                        {block.content && <div className="aspect-video max-w-xl overflow-hidden rounded border border-gray-300 bg-black"><iframe src={block.content.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} title="Xem trước video YouTube" className="h-full w-full" allowFullScreen /></div>}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input type="text" value={block.content} onChange={(e) => handleUpdateBlock(block.id, e.target.value)} className={`flex-1 ${inputStyles}`} placeholder="Dán link hình ảnh" />
                          <label className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-gray-900 shadow flex items-center justify-center">
                            {saving ? '...' : 'Upload'}
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => handleUpdateBlock(block.id, url))} />
                          </label>
                        </div>
                        {block.content && <img src={block.content} className="max-h-48 object-contain border border-gray-300 rounded shadow-sm bg-white p-1" />}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleDeleteBlock(block.id)} className="text-red-600 font-bold p-3 shrink-0 hover:bg-red-100 rounded-lg transition-colors">Xóa</button>
                </div>
              ))}
              {blocks.length === 0 && <p className="text-gray-600 font-medium text-center py-4">Chưa có bài viết chi tiết.</p>}
            </div>

            {/* Nút Thêm ở dưới cùng */}
            {blocks.length > 0 && (
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <button onClick={() => handleAddBlock('text')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700">+ Thêm Đoạn Văn</button>
                <button onClick={() => handleAddBlock('image')} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700">+ Thêm Hình Ảnh</button>
                <button onClick={() => handleAddBlock('video')} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-red-700">+ Thêm Video YouTube</button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: THÔNG SỐ KỸ THUẬT */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-medium">Thêm các ảnh bảng thông số kỹ thuật xuất hiện ở cuối trang.</p>
              <button onClick={handleAddSpec} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-purple-700">+ Thêm Ảnh Thông Số</button>
            </div>
            
            <div className="grid gap-4">
              {specs.map((spec, index) => (
                <div key={spec.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-center">
                  <div className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center font-bold rounded-full shrink-0">{index + 1}</div>
                  <div className="flex-1 flex flex-col md:flex-row gap-3 w-full items-start md:items-center">
                    <input type="text" value={spec.image_url} onChange={(e) => handleUpdateSpec(spec.id, e.target.value)} className={`flex-1 w-full ${inputStyles}`} placeholder="Dán link ảnh thông số" />
                    <label className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-gray-900 shadow flex items-center justify-center whitespace-nowrap">
                      {saving ? '...' : 'Upload'}
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => handleUpdateSpec(spec.id, url))} />
                    </label>
                  </div>
                  {spec.image_url && <img src={spec.image_url} className="w-32 h-20 object-cover border border-gray-300 rounded shadow-sm bg-white p-1 shrink-0" />}
                  <button onClick={() => handleDeleteSpec(spec.id)} className="text-red-600 font-bold p-3 shrink-0 hover:bg-red-100 rounded-lg transition-colors">Xóa</button>
                </div>
              ))}
              {specs.length === 0 && <p className="text-gray-600 font-medium text-center py-4">Chưa có ảnh thông số.</p>}
            </div>

            {/* Nút Thêm ở dưới cùng */}
            {specs.length > 0 && (
              <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
                <button onClick={handleAddSpec} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-purple-700">+ Thêm Ảnh Thông Số</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
