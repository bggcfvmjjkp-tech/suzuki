"use client";

import { Phone } from "lucide-react";
import { usePublicSiteCars } from "./public-site-cars-context";

export function PublicFloatingZalo() {
  const { settings } = usePublicSiteCars();
  const phoneNumber = settings.phone_number || "0944.006.999";
  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const zaloLink =
    settings.zalo_link || `https://zalo.me/${phoneDigits || phoneNumber.replace(/\./g, "")}`;

  return (
    <>
      <a
        href={phoneDigits ? `tel:${phoneDigits}` : `tel:${phoneNumber}`}
        className="fixed bottom-0 left-0 z-50 flex items-center group cursor-pointer"
        aria-label={`Gọi ${phoneNumber}`}
      >
        <div className="bg-[#E11D48] text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-10 hover:bg-rose-700 transition-colors">
          <Phone size={32} className="fill-current" />
        </div>
        <div className="bg-[#E11D48] text-white font-bold px-5 py-2.5 rounded-r-full -ml-8 pr-8 shadow-md transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0">
          {phoneNumber}
        </div>
      </a>

      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 right-0 z-50 flex items-center group cursor-pointer"
        aria-label="Mở Zalo"
      >
        <div className="bg-[#0F172A] text-white font-bold px-5 py-2.5 rounded-l-full -mr-4 pl-8 shadow-md transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-0 order-1">
          Zalo
        </div>
        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg z-10 border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden order-2">
          <img
            src="/logo/social/zalo.svg"
            alt="Zalo"
            className="h-14 w-14 object-contain"
          />
        </div>
      </a>
    </>
  );
}
