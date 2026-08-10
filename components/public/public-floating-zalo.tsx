"use client";

import { Gift, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePublicSiteCars } from "./public-site-cars-context";
import { PublicQuoteModal } from "./public-quote-modal";

export function PublicFloatingZalo() {
  const { settings } = usePublicSiteCars();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const phoneNumber = settings.phone_number || "0944.006.999";
  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const zaloLink = settings.zalo_link || `https://zalo.me/${phoneDigits}`;
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(<>
    <a href={`tel:${phoneDigits || phoneNumber}`} className="group fixed bottom-4 left-3 z-[9990] flex cursor-pointer items-center sm:bottom-5 sm:left-5" aria-label={`Gọi ${phoneNumber}`}><div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#ef2332] text-white shadow-lg transition hover:bg-rose-700 sm:h-14 sm:w-14"><Phone size={23} className="fill-current" /></div><div className="-ml-4 -translate-x-full rounded-r-full bg-[#ef2332] px-5 py-2.5 pl-8 font-bold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">{phoneNumber}</div></a>
    <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="group fixed bottom-[76px] left-3 z-[9990] flex cursor-pointer items-center sm:bottom-[86px] sm:left-5" aria-label="Mở Zalo"><div className="z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg transition hover:border-slate-300 sm:h-14 sm:w-14"><img src="/logo/social/zalo.svg" alt="Zalo" className="h-9 w-9 object-contain sm:h-10 sm:w-10" /></div><div className="-ml-4 -translate-x-full rounded-r-full bg-[#0f172a] px-5 py-2.5 pl-8 font-bold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">Zalo</div></a>
    <button onClick={() => setQuoteOpen(true)} className="fixed bottom-4 right-3 z-[9990] flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#ef2332] text-white shadow-lg transition hover:bg-[#c91827] sm:bottom-5 sm:right-5 sm:h-14 sm:w-14" aria-label="Nhận báo giá"><Gift size={21} /><span className="mt-0.5 text-[7px] font-bold uppercase">Báo giá</span></button>
    <PublicQuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
  </>, document.body);
}
