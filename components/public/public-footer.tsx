"use client";
import Link from "next/link";
import { Mail, MapPin, Phone, ChevronRight } from "lucide-react";
import { usePublicSiteCars } from "./public-site-cars-context";
export function PublicFooter() {
  const { currentCars, settings } = usePublicSiteCars();
  const company = settings.company_name || "Phòng Kinh Doanh Suzuki Vinh";
  const phone = settings.phone_number || "0944.006.999";
  const email = settings.email || "suzukivinh.kinhdoanh@gmail.com";
  const address = settings.address || "Số 56 Đường Nguyễn Trãi - Tp. Vinh - Nghệ An";
  const siteName = settings.site_name || "Suzuki Vinh Nghệ An";
  return <footer className="bg-[#0054a6] text-white"><div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-3"><div><h2 className="footer-title">{company}</h2><div className="mt-5 space-y-3 text-sm text-white/90"><p className="flex gap-2"><MapPin className="shrink-0 text-[#ff3a41]" size={18}/>{address}</p><p className="flex gap-2"><Phone className="shrink-0 text-[#ff3a41]" size={18}/>Hotline: {phone}</p><p className="flex gap-2"><Mail className="shrink-0 text-[#ff3a41]" size={18}/>{email}</p></div></div><div><h2 className="footer-title">Sản phẩm</h2><ul className="mt-5 grid grid-cols-2 gap-y-2 text-sm text-white/90">{currentCars.slice(0, 6).map((car) => <li key={car.slug}><Link href={`/chi-tiet-xe/${car.slug}`} className="flex items-center gap-1 hover:text-[#ff3a41]"><ChevronRight size={14}/>{car.name}</Link></li>)}</ul></div><div><h2 className="footer-title">Fanpage & mạng xã hội</h2><a href={settings.facebook_link || "#"} className="mt-5 flex h-24 items-center justify-center bg-white/95 text-sm font-bold text-[#0054a6] transition hover:bg-white">{siteName}</a></div></div><div className="border-t border-white/20 py-4 text-center text-xs text-white/70">© {new Date().getFullYear()} {siteName}. All rights reserved.</div></footer>;
}
