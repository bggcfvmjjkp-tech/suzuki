'use client';

import { useState, useEffect } from "react";
import { Save, Settings, Globe, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultSettings = [
  { key: "site_name", value: "Suzuki Vinh Nghệ An", description: "Tên website" },
  { key: "company_name", value: "Phòng Kinh Doanh Suzuki Vinh", description: "Tên đơn vị / công ty" },
  { key: "address", value: "Số 5B Đường Nguyễn Trãi - Tp.Vinh - Nghệ An", description: "Địa chỉ" },
  { key: "phone_number", value: "0944 006 999", description: "Hotline" },
  { key: "email", value: "suzukivinh.kinhdoanh@gmail.com", description: "Email" },
  { key: "website", value: "https://suzukivinh.com.vn", description: "Website" },
  { key: "facebook_link", value: "", description: "Link Facebook" },
  { key: "zalo_link", value: "", description: "Link Zalo" },
  { key: "youtube_link", value: "", description: "Link YouTube" },
  { key: "tiktok_link", value: "", description: "Link TikTok" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [adminAccount, setAdminAccount] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch general settings
      const { data: sData, error: sError } = await supabase
        .from('settings')
        .select('*')
        .order('key');
      if (sError) throw sError;
      const existingSettings = sData || [];
      const existingKeys = new Set(existingSettings.map((setting) => setting.key));
      const missingSettings = defaultSettings.filter((setting) => !existingKeys.has(setting.key));
      if (missingSettings.length) {
        const { data: insertedSettings, error: insertError } = await supabase
          .from('settings')
          .insert(missingSettings)
          .select('*');
        if (insertError) throw insertError;
        setSettings([...existingSettings, ...(insertedSettings || [])].sort((a, b) => a.key.localeCompare(b.key)));
      } else {
        setSettings(existingSettings);
      }

      // Fetch admin account
      const { data: aData, error: aError } = await supabase
        .from('admin_users')
        .select('username, password')
        .limit(1)
        .single();
      if (aError) throw aError;
      setAdminAccount(aData);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      for (const s of settings) {
        const { error } = await supabase
          .from('settings')
          .update({ value: s.value, updated_at: new Date() })
          .eq('key', s.key);
        if (error) throw error;
      }
      window.dispatchEvent(new Event("public-settings-updated"));
      alert("Đã lưu cấu hình thành công!");
    } catch (err) {
      alert("Lỗi khi lưu cấu hình");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAdmin = async () => {
    if (!adminAccount.username || !adminAccount.password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }
    setIsSavingAdmin(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          username: adminAccount.username, 
          password: adminAccount.password,
          updated_at: new Date() 
        })
        .eq('username', adminAccount.username); // Simplified, usually use ID
      
      if (error) throw error;
      alert("Đã cập nhật tài khoản quản trị thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật tài khoản");
      console.error(err);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.includes('phone')) return <Phone size={18} />;
    if (key.includes('email')) return <Mail size={18} />;
    if (key.includes('address')) return <MapPin size={18} />;
    if (key.includes('link')) return <Share2 size={18} />;
    return <Globe size={18} />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm font-medium text-slate-500">Đang tải cấu hình…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 sm:space-y-10 sm:pb-20">
      <div>
        <h1 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900 sm:text-xl">
          <Settings className="h-5 w-5 shrink-0 text-blue-600 sm:h-6 sm:w-6" />
          Cấu hình website
        </h1>
        <p className="mt-1 text-sm text-slate-500">Thông tin hiển thị công khai và tài khoản đăng nhập.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Tài khoản quản trị</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Đổi tên đăng nhập và mật khẩu hệ thống.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveAdmin}
            disabled={isSavingAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSavingAdmin ? 'Đang lưu…' : 'Cập nhật tài khoản'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Tên đăng nhập
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={adminAccount.username}
              onChange={(e) => setAdminAccount({ ...adminAccount, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Mật khẩu mới
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={adminAccount.password}
              onChange={(e) => setAdminAccount({ ...adminAccount, password: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Thông tin chung &amp; liên hệ</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Hiển thị trên toàn bộ website.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Đang lưu…' : 'Lưu cấu hình'}
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-8 sm:space-y-8">
          {settings.map((s) => (
            <div key={s.key} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <span className="text-slate-500">{getIcon(s.key)}</span>
                {s.description || s.key}
              </div>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={s.value}
                onChange={(e) => handleUpdateSetting(s.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-blue-900 sm:p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold sm:text-base">
          <Globe size={18} /> Hướng dẫn
        </h3>
        <ul className="list-inside list-disc space-y-2 text-sm opacity-95">
          <li>
            <strong className="font-semibold">Tài khoản:</strong> Mật khẩu được lưu dạng văn bản (không mã hóa).
          </li>
          <li>
            <strong className="font-semibold">Site Name:</strong> Tên hiển thị cạnh logo (header).
          </li>
          <li>
            <strong className="font-semibold">Phone Number:</strong> Hotline, hiển thị ở nút gọi và thanh trên.
          </li>
          <li>
            <strong className="font-semibold">Email:</strong> Địa chỉ <strong className="font-semibold">nhận</strong> thông tin đăng ký lái thử / tư vấn từ khách.
          </li>
          <li>
            <strong className="font-semibold">Zalo Link:</strong> Định dạng{' '}
            <code className="rounded bg-white/60 px-1 py-0.5 text-xs">https://zalo.me/so_dien_thoai</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
