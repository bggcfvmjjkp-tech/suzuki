"use client";

import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

function toYouTubeEmbed(url: string) {
  if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
}

export default function CarDetail() {
  const { slug } = useParams();
  const { settings } = usePublicSiteCars();

  const [selectedColor, setSelectedColor] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [carData, setCarData] = useState<any>(null);
  const [colors, setColors] = useState<any[]>([]);
  const [detailBlocks, setDetailBlocks] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);

  // Lead Modal states
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        if (!slug) return;

        // Fetch thông tin xe
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('slug', slug)
          .single();

        if (carError || !car) {
          // Fallback tĩnh nếu không tìm thấy (để UI không chết)
          loadStaticData();
          return;
        }

        setCarData(car);

        // Fetch colors
        const { data: colorData } = await supabase
          .from('car_colors')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (colorData && colorData.length > 0) {
          setColors(colorData);
        } else {
          // Fallback màu
          setColors([
             { color_name: "Mặc định", hex_code: "#d1d5db", image_url: car.main_image || "/chi tiết xe/xe theo mau/imgi_4_z5423562096141_871c1d73895398d6b5d4d60c867d9a0b.jpg" }
          ]);
        }

        // Fetch chi tiết đan xen
        const { data: blocks } = await supabase
          .from('car_detail_blocks')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (blocks && blocks.length > 0) {
          setDetailBlocks(blocks);
        }

        // Fetch thông số
        const { data: specData } = await supabase
          .from('car_specifications')
          .select('*')
          .eq('car_id', car.id)
          .order('sort_order', { ascending: true });
        
        if (specData && specData.length > 0) {
          setSpecs(specData);
        }

      } catch (error) {
        console.error("Lỗi fetch chi tiết xe:", error);
        loadStaticData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetail();
  }, [slug]);

  const loadStaticData = () => {
    // Tạm thời nếu DB trống thì hiện data cũ
    setCarData({
      name: "VINFAST VF 3",
      price: "235.000.000 VNĐ",
      general_description: "Mẫu xe điện cỡ nhỏ tiên phong của VinFast mang đậm cá tính, thiết kế năng động và cực kỳ tiện dụng. Với ngoại hình mạnh mẽ cùng khả năng di chuyển linh hoạt trong đô thị, VF 3 hứa hẹn sẽ trở thành mẫu xe quốc dân mới của người Việt."
    });
    setColors([
      { color_name: "Màu 1", hex_code: "#d1d5db", image_url: "/chi tiết xe/xe theo mau/imgi_4_z5423562096141_871c1d73895398d6b5d4d60c867d9a0b.jpg" },
      { color_name: "Màu 2", hex_code: "#fbbf24", image_url: "/chi tiết xe/xe theo mau/imgi_5_z5423562165419_948c075aa982cd110626688de87c9f68.jpg" },
      { color_name: "Màu 3", hex_code: "#3b82f6", image_url: "/chi tiết xe/xe theo mau/imgi_6_z5423562243183_bc4148cc0bb9acb826d7abe1fa74db35.jpg" },
    ]);
    setDetailBlocks([
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_12_vf3-1.jpg' },
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_13_vf3-2.jpg' },
      { block_type: 'image', content: '/chi tiết xe/chi tiết xe/imgi_14_vf3-3.jpg' }
    ]);
    setSpecs([
      { image_url: '/chi tiết xe/thông số xe/imgi_19_TSKT-VF-3-3-scaled.jpg' }
    ]);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8102e]" />
        </div>
      </PublicPageShell>
    );
  }

  const videoBlocks = detailBlocks.filter((block) => block.block_type === "video");
  const contentBlocks = detailBlocks.filter((block) => block.block_type !== "video");

  return (
    <PublicPageShell>
      {/* Content */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 md:py-14">
        
        {/* Breadcrumb */}
        <div className="mb-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Link href="/" className="text-[#003b92] hover:text-[#ed1b2f]">Trang chủ</Link> <span className="mx-2">/</span>
            <span className="text-slate-800">{carData?.name}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative mb-6 flex aspect-[16/10] items-center justify-center overflow-hidden">
              <img src={colors[selectedColor]?.image_url} alt={`Xe ${carData?.name}`} className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 text-center">
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#003b92]">Màu xe ngoại thất</h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[#ed1b2f]">
                  {colors[selectedColor]?.color_name}
                </p>
              </div>
              <div className="flex justify-center gap-3 flex-nowrap overflow-x-auto pb-2 no-scrollbar">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className="flex flex-col items-center shrink-0"
                  >
                    <div 
                      className={`h-9 w-9 rounded-full border-2 transition-all duration-300 ${selectedColor === index ? 'border-[#ed1b2f] scale-110 shadow-md ring-2 ring-red-50' : 'border-gray-200 hover:border-gray-400'}`}
                      style={{ backgroundColor: color.hex_code }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-1 lg:pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#003b92]">{settings.site_name || "Suzuki Vinh Nghệ An"}</p>
            <h1 className="mt-2 text-3xl font-bold uppercase text-[#151515] md:text-4xl">{carData?.name}</h1>
            <div className="mt-4 flex w-16 gap-1"><span className="h-[3px] flex-1 bg-[#003b92]" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div>
            <p className="mt-6 text-2xl font-bold text-[#ed1b2f]">
              {carData?.is_contact ? 'Liên Hệ' : `Giá từ: ${carData?.price}`}
            </p>
            <div className="mb-8 mt-5 whitespace-pre-wrap text-base leading-relaxed text-slate-700 md:text-lg">
              {carData?.general_description}
            </div>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowModal(true)} className="rounded bg-[#ed1b2f] px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-red-700">
                Nhận thông tin tư vấn
              </button>
              <a href={settings.zalo_link || `https://zalo.me/${(settings.phone_number || '0944006999').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded border-2 border-[#003b92] bg-white px-7 py-3 text-sm font-bold uppercase text-[#003b92] transition hover:bg-[#003b92] hover:text-white">
                <Phone size={18} /> Liên hệ Zalo
              </a>
            </div>
          </div>
        </div>

        {videoBlocks.length > 0 && (
          <section className="mt-14 border-y border-slate-200 py-12">
            <div className="mb-7 text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#003b92]">Khám phá</p><h2 className="mt-2 text-2xl font-bold uppercase text-[#171717]">Video giới thiệu xe</h2><div className="mx-auto mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-[#003b92]" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div></div>
            <div className="mx-auto grid max-w-5xl gap-6">{videoBlocks.map((block, index) => <div key={block.id || index} className="aspect-video overflow-hidden rounded-xl bg-black shadow-lg"><iframe src={toYouTubeEmbed(block.content)} title={`Video giới thiệu ${carData?.name}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>)}</div>
          </section>
        )}

        {/* Scroll down description and details */}
        {contentBlocks.length > 0 && (
          <div className="mt-16">
            <div className="mb-9 text-center">
              <h2 className="text-2xl font-bold uppercase text-[#171717]">Chi tiết xe</h2>
              <div className="mx-auto mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-[#003b92]" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div>
            </div>
            <div className="flex flex-col items-center space-y-8">
               {contentBlocks.map((block, idx) => {
                  if (block.block_type === 'image') {
                    return <img key={idx} src={block.content} className="w-full max-w-5xl mx-auto border border-gray-200 shadow-sm" />;
                  } else if (block.block_type === 'text') {
                    return <div key={idx} className="w-full max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</div>;
                  }
                  return null;
               })}
            </div>
          </div>
        )}
        
        {specs.length > 0 && (
          <div className="mb-10 mt-16">
            <div className="mb-9 text-center">
              <h2 className="text-2xl font-bold uppercase text-[#171717]">Thông số kỹ thuật</h2>
              <div className="mx-auto mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-[#003b92]" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div>
            </div>
            <div className="space-y-8">
               {specs.map((spec, idx) => (
                 <img key={idx} src={spec.image_url} className="w-full max-w-5xl mx-auto border border-gray-200 shadow-sm" />
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom right support button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-black text-white px-5 py-2.5 shadow-lg font-bold flex items-center gap-2 hover:bg-[#333] transition-colors border border-gray-700 uppercase text-sm">
          Hỗ trợ <Menu size={16} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full relative shadow-2xl border-t-4 border-[#c8102e]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <X size={28} />
            </button>
            <h3 className="text-2xl font-bold uppercase mb-2 text-center text-black">Nhận thông tin</h3>
            <div className="w-12 h-1 bg-[#c8102e] mx-auto mb-6"></div>
            <form 
              className="space-y-4 text-left"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!leadForm.name || !leadForm.phone) {
                  alert("Vui lòng nhập họ tên và số điện thoại.");
                  return;
                }
                setIsSubmittingLead(true);
                try {
                  const res = await fetch("/api/lead", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "Nhận thông tin",
                      fullName: leadForm.name,
                      phone: leadForm.phone,
                      email: leadForm.email,
                      notes: leadForm.notes || carData?.name,
                      carModel: carData?.name,
                    }),
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) throw new Error(data?.error || "Request failed");
                  alert("Gửi thông tin thành công! Chúng tôi sẽ sớm liên hệ lại.");
                  setShowModal(false);
                  setLeadForm({ name: "", phone: "", email: "", notes: "" });
                } catch (err) {
                  console.error(err);
                  alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                } finally {
                  setIsSubmittingLead(false);
                }
              }}
            >
              <div>
                <label className="block text-[15px] font-bold text-gray-800 mb-1">Họ và tên *</label>
                <input 
                  type="text" required 
                  value={leadForm.name}
                  onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập họ và tên của bạn" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Số điện thoại *</label>
                <input 
                  type="text" required 
                  value={leadForm.phone}
                  onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập số điện thoại" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Email</label>
                <input 
                  type="email" 
                  value={leadForm.email}
                  onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Nhập email" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-bold text-black mb-1">Nội dung tư vấn</label>
                <textarea 
                  value={leadForm.notes}
                  onChange={e => setLeadForm({...leadForm, notes: e.target.value})}
                  className="w-full border border-gray-400 p-2.5 text-[15px] text-black font-medium h-24 focus:border-[#c8102e] focus:outline-none placeholder:text-gray-500" 
                  placeholder="Dòng xe bạn đang quan tâm..." 
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingLead}
                className="w-full bg-[#c8102e] text-white py-3 font-bold uppercase text-[15px] mt-2 hover:bg-red-800 transition disabled:opacity-50"
              >
                {isSubmittingLead ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PublicPageShell>
  )
}
