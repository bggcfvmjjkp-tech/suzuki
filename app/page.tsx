"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CarFront, ChevronLeft, ChevronRight, CircleDollarSign, Tag } from "lucide-react";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";
import { supabase } from "@/lib/supabase";

const banners = [
  "/suzuki/banners/home-fronx.jpg",
  "/suzuki/banners/home-suzuki.jpg",
  "/suzuki/banners/home-carry-pro.jpg",
];
type LatestPost = { id: string | number; title: string; slug: string; cover_image: string | null; short_description: string | null; created_at: string | null };
const testimonials = [
  { name: "Anh Trần Văn Cường", image: "/car/imgi_12_5.png", text: "Suzuki XL7 mang lại cảm giác lái rất linh hoạt và an toàn. Tôi đặc biệt hài lòng với không gian rộng rãi, phù hợp cho cả gia đình." },
  { name: "Chị Ngọc Huyền", image: "/car/imgi_10_3-2.png", text: "Tôi mua xe để đi lại hằng ngày và hoàn toàn hài lòng. Nhân viên tư vấn tận tình, thủ tục nhanh gọn và dịch vụ chu đáo." },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-8 text-center md:mb-10"><h2 className="text-xl font-black uppercase tracking-tight text-[#171717] md:text-2xl">{children}</h2><div className="mx-auto mt-2 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-[#004a9f]" /><span className="h-[3px] w-5 bg-[#e2232a]" /></div></div>;
}

function CarCard({ car }: { car: { name: string; price: string; img: string; slug: string } }) {
  return <article className="group overflow-hidden rounded-lg bg-[#f3f4f6] text-center shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"><Link href={`/chi-tiet-xe/${car.slug || ""}`} className="block bg-white p-3"><img src={car.img} alt={car.name} className="h-36 w-full object-contain transition duration-500 group-hover:scale-105 sm:h-40" /></Link><div className="px-3 pb-3 pt-2"><h3 className="text-xs font-extrabold uppercase text-[#252525]">{car.name}</h3><p className="mt-1 text-xs font-semibold text-[#222]">Chỉ từ: <span className="font-black text-[#e2232a]">{car.price}</span></p><Link href={`/chi-tiet-xe/${car.slug || ""}`} className="mt-2 inline-flex rounded-full bg-[#004a9f] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#e2232a]">Xem chi tiết</Link></div></article>;
}

function HomeContent() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { currentCars, serviceCars, isLoading: isCarsLoading } = usePublicSiteCars();
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>([]);
  useEffect(() => { const loadPosts = async () => { const { data } = await supabase.from("posts").select("id, title, slug, cover_image, short_description, created_at").order("created_at", { ascending: false }).limit(6); setLatestPosts(data || []); }; loadPosts(); }, []);
  useEffect(() => { const timer = window.setInterval(() => setCurrentBanner((value) => (value + 1) % banners.length), 5500); return () => window.clearInterval(timer); }, []);
  return <main>
    <section className="group relative aspect-[1928/1004] min-h-[280px] overflow-hidden bg-[#123a65]">{banners.map((src, index) => <img key={src} src={src} alt="Ưu đãi xe Suzuki" className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ${index === currentBanner ? "z-10 scale-100 opacity-100" : "z-0 scale-105 opacity-0"}`} />)}<button onClick={() => setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)} aria-label="Banner trước" className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"><ChevronLeft /></button><button onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)} aria-label="Banner tiếp theo" className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/25 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"><ChevronRight /></button><div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">{banners.map((_, index) => <button key={index} onClick={() => setCurrentBanner(index)} aria-label={`Chuyển banner ${index + 1}`} className={`h-2.5 w-2.5 rounded-full border border-white ${index === currentBanner ? "bg-[#e2232a]" : "bg-white/60"}`} />)}</div></section>
    <section className="bg-white py-9 md:py-12"><div className="mx-auto grid max-w-3xl grid-cols-3 gap-5 px-4 text-center">{[{ icon: Tag, label: "Khuyến mãi", href: "/uu-dai" }, { icon: CircleDollarSign, label: "Bảng giá xe", href: "/chi-tiet-xe" }, { icon: CarFront, label: "Đăng ký lái thử", href: "/dang-ky-lai-thu" }].map(({ icon: Icon, label, href }) => <Link key={label} href={href} className="group/action"><Icon className="mx-auto h-10 w-10 text-[#e2232a] transition group-hover/action:scale-110" strokeWidth={1.8} /><span className="mt-2 block text-[11px] font-extrabold uppercase text-[#171717] sm:text-xs">{label}</span></Link>)}</div></section>
    <section className="bg-white pb-10 md:pb-14"><div className="mx-auto max-w-[1400px] px-5"><SectionTitle>Các xe du lịch Suzuki Vinh Nghệ An</SectionTitle>{isCarsLoading ? <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#004a9f] border-t-transparent" /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{currentCars.map((car) => <CarCard key={car.slug || car.name} car={car} />)}</div>}</div></section>
    <section className="bg-[#eef2f6] py-10 md:py-14"><div className="mx-auto max-w-[1400px] px-5"><SectionTitle>Các xe thương mại Suzuki Vinh Nghệ An</SectionTitle>{isCarsLoading ? <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#004a9f] border-t-transparent" /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{serviceCars.map((car) => <CarCard key={car.slug || car.name} car={car} />)}</div>}</div></section>
    <section className="relative overflow-hidden bg-[#152b42] py-10 md:py-14"><img src="/baner/imgi_5_2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="relative mx-auto max-w-[1400px] px-5"><SectionTitle>Khách hàng đánh giá Suzuki Vinh</SectionTitle><div className="grid gap-4 md:grid-cols-2">{testimonials.map((item) => <article key={item.name} className="flex gap-4 rounded bg-white p-5 shadow-lg"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#e2232a] bg-slate-100"><img src={item.image} alt="" className="h-full w-full object-contain" /></div><div><h3 className="text-sm font-extrabold text-[#004a9f]">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">“{item.text}”</p></div></article>)}</div></div></section>
    <section className="bg-white py-10 md:py-14"><div className="mx-auto max-w-[1400px] px-5"><SectionTitle>Tin tức và sự kiện mới</SectionTitle><div className="grid gap-4 md:grid-cols-2">{latestPosts.map((post) => <Link href={`/chi-tiet-bai-viet/${post.slug}`} key={post.id} className="group flex gap-3 rounded border border-slate-200 bg-white p-3 shadow-sm transition hover:border-[#004a9f] hover:shadow-md"><img src={post.cover_image || "/news/imgi_21_1.jpg"} alt="" className="h-24 w-32 shrink-0 object-cover sm:h-28 sm:w-40" /><div className="flex min-w-0 flex-1 flex-col"><h3 className="line-clamp-2 text-[16px] font-bold uppercase leading-[1.3] text-[#e2232a] transition group-hover:text-[#004a9f]">{post.title}</h3><p className="mt-2 flex items-center gap-1 text-[13px] text-slate-500"><CalendarDays size={13} /> {post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : ""}</p><p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-slate-600">{post.short_description || "Thông tin chi tiết đang được cập nhật."}</p><span className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-bold text-[#004a9f]">Xem thêm <ArrowRight size={13} /></span></div></Link>)}</div>{!latestPosts.length && <p className="text-center text-sm text-slate-500">Tin tức mới sẽ được cập nhật tại đây.</p>}</div></section>
  </main>;
}
export default function Home() { return <PublicPageShell><HomeContent /></PublicPageShell>; }
