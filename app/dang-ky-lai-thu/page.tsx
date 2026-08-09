"use client";

import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";

export default function TestDriveRegistrationPage() {
  const [formData, setFormData] = useState({
    carType: "",
    fullName: "",
    address: "",
    phone: "",
    hasLicense: "Không",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carModels, setCarModels] = useState<any[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await supabase.from('cars').select('name').order('name');
      if (data) {
        setCarModels(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, carType: data[0].name }));
      }
    };
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Lái thử",
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          carModel: formData.carType,
          hasLicense: formData.hasLicense,
          notes: formData.notes,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Request failed");

      alert("Đăng ký lái thử thành công! Chúng tôi sẽ sớm liên hệ với bạn.");
      setFormData({
        carType: "VF 3",
        fullName: "",
        address: "",
        phone: "",
        hasLicense: "Không",
        notes: ""
      });
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicPageShell>
      {/* Main Content - Form */}
      <main className="max-w-[800px] mx-auto px-4 py-16">
         <p className="text-[#c8102e] italic font-bold text-center mb-10 text-[15px]">
            Ghi chú: Chương trình lái thử xe chỉ dành cho những khách hàng đã có bằng lái xe ô tô.
         </p>

         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loại xe */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px]">Loại xe</label>
               <div className="flex-1 flex items-center gap-2">
                 <select 
                   className="flex-1 border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:outline-none focus:border-[#c8102e] appearance-none bg-white"
                   value={formData.carType}
                   onChange={(e) => setFormData({...formData, carType: e.target.value})}
                 >
                    {carModels.map((car, idx) => (
                      <option key={idx} value={car.name}>{car.name}</option>
                    ))}
                 </select>
                 <span className="text-[#c8102e] font-bold">*</span>
               </div>
            </div>

            {/* Tên khách hàng */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px]">Tên khách hàng</label>
               <div className="flex-1 flex items-center gap-2">
                 <input 
                   type="text" 
                   placeholder="Họ và tên đầy đủ"
                   className="flex-1 border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:outline-none focus:border-[#c8102e] placeholder:text-gray-500"
                   value={formData.fullName}
                   onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                 />
                 <span className="text-transparent">*</span> {/* spacer */}
               </div>
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px]">Địa chỉ</label>
               <div className="flex-1 flex items-center gap-2">
                 <input 
                   type="text" 
                   placeholder="Địa chỉ"
                   className="flex-1 border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:outline-none focus:border-[#c8102e] placeholder:text-gray-500"
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                 />
                 <span className="text-transparent">*</span>
               </div>
            </div>

            {/* Điện thoại di động */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px]">Điện thoại di động</label>
               <div className="flex-1 flex items-center gap-2">
                 <input 
                   type="tel" 
                   placeholder="Ví dụ: 0912588888"
                   required
                   className="flex-1 border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:outline-none focus:border-[#c8102e] placeholder:text-gray-500"
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
                 <span className="text-[#c8102e] font-bold">*</span>
               </div>
            </div>

            {/* Bằng lái xe */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px]">Bằng lái xe</label>
               <div className="flex-1 flex items-center gap-8 pl-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="license" 
                      value="Có"
                      checked={formData.hasLicense === "Có"}
                      onChange={(e) => setFormData({...formData, hasLicense: e.target.value})}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <span className="text-[15px]">Có</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="license" 
                      value="Không"
                      checked={formData.hasLicense === "Không"}
                      onChange={(e) => setFormData({...formData, hasLicense: e.target.value})}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <span className="text-[15px]">Không</span>
                 </label>
               </div>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
               <label className="sm:w-48 font-bold text-black text-[15px] sm:mt-2">Ghi chú</label>
               <div className="flex-1 flex items-start gap-2">
                 <textarea 
                   className="flex-1 border border-gray-400 p-2.5 text-[15px] text-black font-medium min-h-[120px] focus:outline-none focus:border-[#c8102e] placeholder:text-gray-500"
                   placeholder="Ghi chú thêm (nếu có)"
                   value={formData.notes}
                   onChange={(e) => setFormData({...formData, notes: e.target.value})}
                 ></textarea>
                 <span className="text-transparent">*</span>
               </div>
            </div>

            {/* Required notice & Submit Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 pt-4">
               <div className="sm:w-48"></div>
               <div className="flex-1">
                  <p className="text-[#c8102e] italic font-bold text-[14px] mb-4">
                    Xin vui lòng điền đầy đủ thông tin được đánh dấu hoa thị (*).
                  </p>
                  <button type="submit" disabled={isSubmitting} className="flex items-stretch overflow-hidden group disabled:opacity-50">
                     <span className="bg-black text-white font-bold text-[13px] uppercase px-5 py-2.5 group-hover:bg-gray-800 transition-colors">
                        {isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
                     </span>
                     <span className="bg-[#c8102e] text-white px-3 flex items-center justify-center group-hover:bg-red-800 transition-colors">
                        <Send size={14} className="-ml-1" />
                     </span>
                  </button>
               </div>
            </div>
         </form>
      </main>
    </PublicPageShell>
  )
}
