'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, CheckCircle, Clock, XCircle, Search, Eye, X, User, Phone, Mail, MapPin, Car, FileText } from "lucide-react";

export default function RegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReg, setSelectedReg] = useState<any>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      console.error("Lỗi fetch liên hệ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lead_registrations')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchRegistrations();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa yêu cầu này?")) return;
    try {
      const { error } = await supabase
        .from('lead_registrations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchRegistrations();
    } catch (err) {
      alert("Lỗi xóa yêu cầu");
    }
  };

  const filteredRegistrations = registrations.filter(r => 
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone?.includes(searchTerm) ||
    r.car_model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã liên hệ':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Đã liên hệ</span>;
      case 'Hủy':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12}/> Đã hủy</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> Mới</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Quản lý liên hệ &amp; đăng ký</h1>
          <p className="mt-0.5 text-sm text-slate-500">Theo dõi lái thử và form liên hệ.</p>
        </div>
        <div className="relative w-full sm:max-w-xs lg:w-72 lg:max-w-none lg:shrink-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            size={18}
            aria-hidden
          />
          <input
            type="search"
            placeholder="Tìm tên, SĐT, dòng xe…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200/80 bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Ngày đăng ký
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Loại yêu cầu
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Dòng xe
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6 sm:py-4">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                    Đang tải dữ liệu…
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6">
                    Chưa có yêu cầu nào.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 sm:px-6 sm:py-4">
                      {new Date(reg.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="font-semibold text-slate-900">{reg.full_name}</div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="text-sm font-medium text-blue-700">{reg.phone}</div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${
                          reg.type === 'Lái thử'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-violet-100 text-violet-800'
                        }`}
                      >
                        {reg.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 sm:px-6 sm:py-4">
                      {reg.car_model}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{getStatusBadge(reg.status)}</td>
                    <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReg(reg)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          className="max-w-[7.5rem] rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          value={reg.status}
                          onChange={(e) => updateStatus(reg.id, e.target.value)}
                        >
                          <option value="Mới">Mới</option>
                          <option value="Đã liên hệ">Đã liên hệ</option>
                          <option value="Hủy">Hủy</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => deleteRegistration(reg.id)}
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

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[min(90vh,100dvh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-white sm:px-6">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-2">
                    <FileText size={20} /> Chi tiết yêu cầu
                 </h2>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="rounded-lg p-2 transition-colors hover:bg-white/15"
                aria-label="Đóng"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto p-4 sm:p-8 sm:space-y-8">
                 {/* Khách hàng */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-wider">
                          <User size={16} /> Thông tin khách hàng
                       </div>
                       <div className="space-y-2">
                          <div className="text-2xl font-black text-black">{selectedReg.full_name}</div>
                          <div className="flex items-center gap-2 text-blue-700 font-bold">
                             <Phone size={14} /> {selectedReg.phone}
                          </div>
                          {selectedReg.email && (
                             <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Mail size={14} /> {selectedReg.email}
                             </div>
                          )}
                          {selectedReg.address && (
                             <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <MapPin size={14} /> {selectedReg.address}
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-wider">
                          <Car size={16} /> Thông tin xe quan tâm
                       </div>
                       <div className="space-y-2">
                          <div className="text-xl font-black text-black uppercase">{selectedReg.car_model}</div>
                          <div className="inline-block px-3 py-1 rounded bg-orange-100 text-orange-700 font-black text-xs uppercase">
                             Yêu cầu: {selectedReg.type}
                          </div>
                          {selectedReg.type === 'Lái thử' && (
                             <div className={`text-sm font-bold ${selectedReg.has_license === 'Có' ? 'text-green-600' : 'text-red-600'}`}>
                                Bằng lái ô tô: {selectedReg.has_license || 'Chưa rõ'}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Ghi chú */}
                 <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                       <FileText size={14} /> Nội dung / Ghi chú
                    </div>
                    <div className="text-gray-900 font-medium whitespace-pre-wrap leading-relaxed">
                       {selectedReg.notes || "Không có ghi chú thêm."}
                    </div>
                 </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs font-medium italic text-slate-500">
                  Ngày đăng ký: {new Date(selectedReg.created_at).toLocaleString('vi-VN')}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Trạng thái:</span>
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={selectedReg.status}
                    onChange={(e) => updateStatus(selectedReg.id, e.target.value)}
                  >
                    <option value="Mới">Mới</option>
                    <option value="Đã liên hệ">Đã liên hệ</option>
                    <option value="Hủy">Hủy</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="rounded-lg bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
