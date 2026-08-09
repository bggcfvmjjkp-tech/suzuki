"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { type PublicNavCar, usePublicSiteCars } from "@/components/public/public-site-cars-context";

function PriceRow({ car, index }: { car: PublicNavCar; index: number }) {
  const rowRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={rowRef} className={`grid items-center gap-7 border-b border-slate-200 py-10 last:border-0 md:grid-cols-[42%_1fr] md:gap-12 md:py-14 ${visible ? "price-row-visible" : "price-row-hidden"}`} style={{ transitionDelay: `${Math.min(index * 50, 250)}ms` }}>
      <Link href={`/chi-tiet-xe/${car.slug}`} className="group flex justify-center overflow-hidden">
        <img src={car.img} alt={car.name} className="h-52 w-full max-w-md object-contain transition duration-500 group-hover:scale-105 md:h-64" />
      </Link>
      <div>
        <h2 className="suzuki-condensed text-2xl font-bold uppercase text-[#003b92]">{car.name}</h2>
        <div className="mt-2 h-px w-full bg-slate-300" />
        <div className="mt-4 flex items-center justify-between gap-5 border-b border-slate-200 pb-3 text-sm text-slate-600">
          <span>{car.isContact ? "Liên hệ tư vấn" : "Giá niêm yết"}</span>
          <strong className="text-right text-base text-[#ed1b2f]">{car.isContact ? "Liên hệ" : car.price}</strong>
        </div>
        <p className="mt-4 text-sm italic text-slate-500">* Liên hệ Hotline để nhận thêm ưu đãi đặc biệt và giá tốt hơn.</p>
        <Link href={`/chi-tiet-xe/${car.slug}`} className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#ed1b2f] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#003b92]">Khám phá thêm <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

function PriceList() {
  const { currentCars, serviceCars, isLoading } = usePublicSiteCars();
  const cars = [...currentCars, ...serviceCars];
  return <main>
    <section className="relative h-36 overflow-hidden bg-[#172c48] md:h-44"><img src="/baner/imgi_5_2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" /><div className="relative mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-5 text-white"><h1 className="suzuki-condensed text-3xl font-bold uppercase">Bảng giá xe</h1><div className="mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-white" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div><p className="mt-3 text-sm">Trang chủ <span className="mx-1">&gt;</span> Bảng giá xe</p></div></section>
    <section className="bg-white"><div className="mx-auto max-w-[1400px] px-5 py-6 md:py-8">{isLoading ? <div className="flex justify-center py-24"><div className="h-9 w-9 animate-spin rounded-full border-2 border-[#003b92] border-t-transparent" /></div> : cars.length ? cars.map((car, index) => <PriceRow key={car.slug || car.name} car={car} index={index} />) : <p className="py-24 text-center text-slate-500">Bảng giá đang được cập nhật.</p>}</div></section>
  </main>;
}

export default function CarPricePage() {
  return <PublicPageShell><PriceList /></PublicPageShell>;
}
