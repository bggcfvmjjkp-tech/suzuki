'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, ChevronRight, Calendar, User, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

export default function PromotionsPage() {
  const { settings } = usePublicSiteCars();
  const [posts, setPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCars, setSidebarCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts for 'uu-dai'
        const { data: postsData } = await supabase
          .from('posts')
          .select('*, post_categories!inner(slug)')
          .eq('post_categories.slug', 'uu-dai')
          .order('created_at', { ascending: false });
        
        if (postsData) setPosts(postsData);

        // Fetch 4 bài viết mới nhất
        const { data: latest } = await supabase
          .from('posts')
          .select('title, slug, cover_image, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        if (latest) setLatestPosts(latest);

        // Fetch sidebar cars
        const { data: cars } = await supabase.from('cars').select('name, price, main_image, slug').limit(5);
        if (cars) setSidebarCars(cars);

      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <PublicPageShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8102e]" />
        </div>
      </PublicPageShell>
    );

  return (
    <PublicPageShell>
      {/* Banner */}
      <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden bg-black flex flex-col justify-center items-center md:items-start text-white">
        <img src="/baner/imgi_6_1.jpg" alt="Banner" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center mt-12 md:mt-24">
           <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 md:mb-0">ƯU ĐÃI</h1>
           <div className="text-sm tracking-widest uppercase">
             <Link href="/" className="hover:text-red-400">Trang chủ</Link> <span className="mx-2">»</span> ƯU ĐÃI
           </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Column - Expanded to 3/4 */}
          <div className="w-full lg:w-3/4">
             <div className="space-y-10">
                {posts.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-200 pb-10">
                     <Link href={`/chi-tiet-bai-viet/${item.slug}`} className="w-full sm:w-1/3 shrink-0 h-48 block overflow-hidden border border-gray-200">
                        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                     </Link>
                     <div className="w-full sm:w-2/3">
                        <Link href={`/chi-tiet-bai-viet/${item.slug}`} className="text-xl font-bold text-black hover:text-[#c8102e] transition-colors block mb-2 leading-tight uppercase">
                           {item.title}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                           <Calendar size={14} /> <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-gray-900 leading-relaxed mb-4 line-clamp-3 font-medium">
                           {item.short_description}
                        </p>
                        <Link href={`/chi-tiet-bai-viet/${item.slug}`} className="inline-flex items-center bg-[#c8102e] text-white px-5 py-2 font-bold text-sm hover:bg-red-800 transition-colors">
                           Xem thêm <span className="ml-2 bg-black/20 p-1 flex items-center justify-center -mr-3 -my-2 ml-4 h-[36px] w-[36px]"><ChevronRight size={16} /></span>
                        </Link>
                     </div>
                  </div>
                ))}
             </div>
             {posts.length === 0 && <p className="text-center py-10 text-gray-500 font-bold">Chưa có chương trình ưu đãi nào.</p>}
          </div>

          {/* Sidebar - Narrowed to 1/4 */}
          <div className="w-full lg:w-1/4">
             <div className="sticky top-24 space-y-12">
               {/* Tư vấn online */}
               <div>
                 <h3 className="text-xl font-black text-black uppercase mb-4 border-b-2 border-gray-300 pb-2 relative">
                   TƯ VẤN ONLINE
                   <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
                 </h3>
                 <div className="flex items-start gap-4">
                   <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={32} className="text-gray-400" />
                   </div>
                   <div className="space-y-2 mt-1">
                     <div className="flex items-center gap-2 font-bold text-lg text-[#c8102e]">
                       <Phone size={16} className="fill-current" /> <a href={settings.zalo_link || `https://zalo.me/${(settings.phone_number || '0944006999').replace(/\D/g, '')}`}>{settings.phone_number || "0944 006 999"}</a>
                     </div>
                     <div className="flex items-center gap-2 text-gray-900 text-[13px] font-bold">
                       <span className="bg-blue-500 text-white rounded-full p-0.5"><MessageCircle size={10} /></span> Zalo: {settings.phone_number || "0944 006 999"}
                     </div>
                     <div className="flex items-center gap-2 text-gray-900 text-[13px] font-bold">
                       <Mail size={14} /> {settings.email || "vinfastnghean1@gmail.com"}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Xe Nổi Bật */}
               <div>
                 <h3 className="text-xl font-black text-black uppercase mb-4 border-b-2 border-gray-200 pb-2 relative">
                   XE NỔI BẬT
                   <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
                 </h3>
                 <div className="space-y-4">
                   {sidebarCars.map((car: any, idx: number) => (
                     <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-20 h-14 shrink-0 flex items-center justify-center overflow-hidden">
                           <img src={car.main_image} alt={car.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                           <Link href={`/chi-tiet-xe/${car.slug}`} className="font-bold text-black uppercase hover:text-[#c8102e] block mb-0.5 text-sm">
                              {car.name}
                           </Link>
                           <div className="text-[12px] text-gray-900 font-bold border-l-2 border-[#c8102e] pl-2">
                             Giá từ: {car.price}
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Bài viết mới nhất section */}
         <div className="mt-20 pt-16 border-t-2 border-gray-100">
            <h3 className="text-2xl font-black text-black uppercase mb-10 border-b-2 border-gray-300 pb-2 relative inline-block">
              BÀI VIẾT MỚI NHẤT
              <span className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-[#c8102e]"></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestPosts.map((post: any, idx: number) => (
                <Link
                  href={`/chi-tiet-bai-viet/${post.slug}`}
                  key={idx}
                  className="bg-white rounded-[20px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#c8102e] text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                      Mới nhất
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[12px] text-[#64748B] mb-3 font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-[#c8102e]" /> <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h4 className="text-[17px] font-bold text-[#0F172A] mb-4 group-hover:text-[#c8102e] transition-colors line-clamp-2 uppercase tracking-tight h-12 leading-snug">
                      {post.title}
                    </h4>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[#c8102e] font-black text-[13px] uppercase tracking-widest">
                      <span>Đọc tiếp</span>
                      <ChevronRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
         </div>
      </main>
    </PublicPageShell>
  );
}
