"use client";

import { Gift, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { usePublicSiteCars } from "./public-site-cars-context";
import { trackGoogleAdsConversion } from "@/lib/google-ads";

export function PublicQuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentCars, serviceCars } = usePublicSiteCars();
  const cars = [...currentCars, ...serviceCars];
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [carModel, setCarModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (open && !carModel && cars[0]) setCarModel(cars[0].name); }, [open, carModel, cars]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "Báo giá", fullName, phone, carModel }) });
      if (!response.ok) throw new Error("Gửi yêu cầu thất bại");
      trackGoogleAdsConversion();
      alert("Yêu cầu báo giá đã được gửi. Chúng tôi sẽ liên hệ sớm nhất.");
      setFullName(""); setPhone(""); onClose();
    } catch { alert("Chưa thể gửi yêu cầu. Vui lòng thử lại sau."); }
    finally { setIsSubmitting(false); }
  }

  return <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-slate-950/70 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Yêu cầu báo giá">
    <button className="absolute inset-0" aria-label="Đóng form báo giá" onClick={onClose} />
    <section className="relative max-h-[92dvh] w-full max-w-[620px] overflow-y-auto bg-white shadow-2xl sm:rounded-xl">
      <div className="relative bg-[#0b2745] px-6 pb-12 pt-7 text-center text-white sm:px-10"><img src="/suzuki/banners/home-suzuki.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-slate-950/50" /><button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-white/15 p-1.5 transition hover:bg-white/25" aria-label="Đóng"><X size={22} /></button><div className="relative"><h2 className="suzuki-condensed text-3xl font-bold uppercase">Báo giá</h2><div className="mx-auto mt-2 h-1 w-24 bg-[#ef2332]" /><p className="mt-4 text-sm italic leading-relaxed sm:text-base">Nhận giá bán cực kỳ ưu đãi. Chương trình áp dụng khi khách hàng gửi thông tin qua website.</p></div></div>
      <div className="relative px-5 pb-7 pt-12 sm:px-8"><div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#003b92] text-white shadow-lg"><Gift size={31} /></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold text-slate-800">Họ và tên<input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tên của bạn là..." className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#003b92]" /></label><label className="block text-sm font-semibold text-slate-800">Số điện thoại<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại của bạn là..." className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#003b92]" /></label><label className="block text-sm font-semibold text-slate-800">Phiên bản xe<select value={carModel} onChange={(e) => setCarModel(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-[#003b92]">{cars.length ? cars.map((car) => <option key={car.slug || car.name}>{car.name}</option>) : <option>Xe Suzuki</option>}</select></label><div className="pt-2 text-center"><button disabled={isSubmitting} className="rounded-full bg-[#ef2332] px-7 py-2.5 text-sm font-bold text-white transition hover:bg-[#c91827] disabled:opacity-60">{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}</button><button type="button" onClick={onClose} className="mt-3 block w-full text-sm text-slate-500 underline underline-offset-2">Không, tôi không cần nhận ưu đãi</button></div></form></div>
    </section>
  </div>;
}
