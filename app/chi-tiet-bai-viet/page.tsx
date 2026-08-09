"use client";

import Link from "next/link";
import { Phone, Mail, Calendar, User } from "lucide-react";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

export default function ArticleDetail() {
  const { settings } = usePublicSiteCars();
  const sidebarCars = [
    { name: "VF 5", price: "529.000.000 VNĐ", img: "/car/imgi_10_3-2.png" },
    { name: "VF 6", price: "689.000.000 VNĐ", img: "/car/imgi_11_4.png" },
    { name: "MIRAGE", price: "Giá: VNĐ", img: "/news/imgi_20_vf-wild-ban-tai.png" },
    { name: "VF 8", price: "1.019.000.000 VNĐ", img: "/car/imgi_13_6.png" },
    { name: "VF 9", price: "1.499.000.000 VNĐ", img: "/car/imgi_14_7.png" },
  ];

  return (
    <PublicPageShell>
      {/* Banner Breadcrumb */}
      <div className="relative w-full h-[200px] sm:h-[300px] overflow-hidden bg-black flex flex-col justify-center items-center md:items-start text-white">
        <img src="/baner/imgi_6_1.jpg" alt="Banner" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center mt-12 md:mt-24">
           <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 md:mb-0">TIN TỨC</h1>
           <div className="text-sm tracking-widest uppercase">
             <Link href="/" className="hover:text-red-400">Trang chủ</Link> <span className="mx-2">»</span> 
             <Link href="/su-kien" className="hover:text-red-400">SỰ KIỆN</Link> <span className="mx-2">»</span> CHI TIẾT BÀI VIẾT
           </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Article Content */}
          <div className="w-full lg:w-2/3">
             <h1 className="text-3xl font-bold text-[#00529b] mb-4 leading-snug">
               BẠN ĐÃ LÁI THỬ VF7 CHƯA? TRẢI NGHIỆM ĐỈNH CAO CÔNG NGHỆ CÙNG VINFAST VF 7 TẠI VINH
             </h1>
             
             <div className="flex items-center text-sm text-gray-500 mb-8 gap-2 border-b border-gray-200 pb-4">
                <Calendar size={14} /> <span>Tháng Mười Hai 11, 2023 at 2:15 sáng</span>
             </div>
             
             <article className="prose prose-lg max-w-none text-gray-800 space-y-6">
                <p>
                  <strong>BẠN ĐÃ LÁI THỬ VF7 CHƯA ? Nếu chưa "ĐĂNG KÝ" ngay để trải nghiệm chương trình lái thử VF7 tại Tp Vinh trong tháng 12 này.</strong>
                </p>
                <p>
                  VinFast VF 7 không chỉ là một chiếc xe, nó là một tuyên ngôn về sự dẫn đầu công nghệ và thiết kế của kỷ nguyên di chuyển điện hóa. Với ngoại hình mạnh mẽ, thể thao mang hơi hướng vũ trụ, cùng nội thất tối giản nhưng tràn ngập công nghệ thông minh, VF 7 hứa hẹn mang đến cho bạn những cảm xúc thăng hoa sau vô lăng.
                </p>
                
                <img src="/chi tiet bai viet/imgi_3_p0500044_resized.jpg" alt="VinFast VF7 Experience" className="w-full h-auto border border-gray-200 my-8" />
                
                <h3 className="text-xl font-bold mt-8 mb-4 uppercase">1. Thiết kế ngoại thất mang đậm dấu ấn tương lai</h3>
                <p>
                  Sở hữu ngôn ngữ thiết kế "Vũ trụ phi đối xứng" (Asymmetric Aerospace), VinFast VF 7 thu hút mọi ánh nhìn với những đường nét sắc sảo, dải đèn LED hình cánh chim đặc trưng của VinFast ở cả phía trước và phía sau. Trần xe vuốt cong xuống phía đuôi tạo nên phong cách coupe thể thao đầy quyến rũ, kết hợp cùng bộ mâm hợp kim kích thước lớn lên đến 20 inch, giúp chiếc xe luôn nổi bật dù xuất hiện ở bất cứ đâu.
                </p>
                <p>
                  Khách hàng tại Nghệ An sẽ có cơ hội được tự tay chạm vào, cảm nhận từng đường cong thiết kế và màu sơn cao cấp của VF 7 ngay tại đại lý VinFast Vinh.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4 uppercase">2. Nội thất tập trung vào người lái</h3>
                <p>
                  Bước vào khoang cabin của VF 7, bạn sẽ ngay lập tức bị chinh phục bởi không gian nội thất tối giản nhưng không kém phần sang trọng. Mọi chi tiết đều được chăm chút tỉ mỉ, hướng trọn vẹn vào người lái. Trung tâm của bảng điều khiển là màn hình cảm ứng giải trí 12.9 inch, tích hợp gần như toàn bộ các chức năng điều khiển xe, giúp không gian trở nên cực kỳ tinh gọn.
                </p>
                <p>
                  Hệ thống hiển thị thông tin trên kính lái (HUD) sắc nét giúp người lái dễ dàng theo dõi các thông số quan trọng mà không cần phải rời mắt khỏi mặt đường, đảm bảo an toàn tối đa trên mọi hành trình.
                </p>
                
                <img src="/chi tiet bai viet/imgi_5_p0500066_resized.jpg" alt="VinFast VF7 Interior" className="w-full h-auto border border-gray-200 my-8" />
                
                <h3 className="text-xl font-bold mt-8 mb-4 uppercase">3. Động cơ mạnh mẽ và công nghệ an toàn tiên tiến</h3>
                <p>
                  Phiên bản Plus của VF 7 được trang bị hai động cơ điện cho tổng công suất lên tới 349 mã lực và mô-men xoắn cực đại 500 Nm, hệ dẫn động hai cầu toàn thời gian. Khả năng tăng tốc ấn tượng từ 0-100 km/h chỉ trong 5.8 giây chắc chắn sẽ làm hài lòng những khách hàng đam mê tốc độ và cảm giác lái thể thao.
                </p>
                <p>
                  Bên cạnh đó, VF 7 được tích hợp hàng loạt công nghệ hỗ trợ lái nâng cao (ADAS) như: Hệ thống kiểm soát hành trình thích ứng, Cảnh báo lệch làn, Hỗ trợ giữ làn, Phanh tự động khẩn cấp... cùng hệ thống trợ lý ảo thông minh ViVi, biến chiếc xe trở thành một người bạn đồng hành thực thụ.
                </p>

                <div className="bg-gray-100 p-6 mt-10 border-l-4 border-[#c8102e]">
                   <h4 className="font-bold text-lg mb-2">Chương trình ưu đãi đặt cọc cực hấp dẫn:</h4>
                   <ul className="list-disc list-inside space-y-2">
                     <li>Đăng ký ngay: <a href="#" className="text-blue-600 hover:underline">https://s.net.vn/EMo7</a></li>
                     <li>Chương trình đặt cọc diễn ra từ <strong>02/12 - 30/12/2023</strong>.</li>
                     <li>Mức cọc chỉ <strong>50.000.000 VNĐ</strong>.</li>
                     <li><strong>Giảm ngay 30 triệu đồng</strong> trực tiếp vào giá xe.</li>
                     <li><strong>Miễn phí sạc pin</strong> tại các trạm sạc công cộng V-GREEN trong vòng 1 năm.</li>
                   </ul>
                </div>
                
                <p className="mt-8 font-bold italic text-right">
                  Nguồn: VinFast Vinh
                </p>
             </article>
             
             {/* Tags and Share */}
             <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="flex gap-2">
                   <span className="font-bold mr-2">Tags:</span>
                   <span className="bg-gray-100 px-3 py-1 text-sm text-gray-600">VinFast</span>
                   <span className="bg-gray-100 px-3 py-1 text-sm text-gray-600">VF7</span>
                   <span className="bg-gray-100 px-3 py-1 text-sm text-gray-600">Lái thử xe</span>
                </div>
                <div className="flex items-center gap-3">
                   <a href="#" className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center"><FacebookIcon size={14} className="fill-current" /></a>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
             {/* Tư vấn online */}
             <div className="mb-12">
               <h3 className="text-xl font-bold uppercase mb-4 border-b-2 border-gray-200 pb-2 relative">
                 TƯ VẤN ONLINE
                 <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
               </h3>
               <div className="flex items-start gap-4">
                 <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <User size={40} className="text-gray-400" />
                 </div>
                 <div className="space-y-3 mt-1">
                   <div className="flex items-center gap-2 font-bold text-lg text-[#c8102e]">
                     <Phone size={18} className="fill-current" /> <a href={settings.zalo_link || `https://zalo.me/${(settings.phone_number || '0961194881').replace(/\./g, '')}`}>{settings.phone_number || "0961.194.881"}</a>
                   </div>
                   <div className="flex items-center gap-2 text-gray-700 text-sm">
                     <span className="bg-blue-500 text-white rounded-full p-0.5"><MessageCircle size={12} /></span> Zalo: {settings.phone_number || "0961.194.881"}
                   </div>
                   <div className="flex items-center gap-2 text-gray-700 text-sm">
                     <span className="bg-[#3b5998] text-white p-0.5 rounded-sm"><FacebookIcon size={12} className="fill-current" /></span> Kích vào để chat
                   </div>
                   <div className="flex items-center gap-2 text-gray-700 text-sm">
                     <Mail size={14} /> dinhtoanvf@gmail.com
                   </div>
                 </div>
               </div>
             </div>

             {/* Xe Nổi Bật */}
             <div>
               <h3 className="text-xl font-bold uppercase mb-4 border-b-2 border-gray-200 pb-2 relative">
                 XE NỔI BẬT
                 <span className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-[#c8102e]"></span>
               </h3>
               <div className="space-y-4">
                 {sidebarCars.map((car, idx) => (
                   <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                      <div className="w-24 h-16 shrink-0 flex items-center justify-center overflow-hidden">
                         <img src={car.img} alt={car.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                         <Link href="/chi-tiet-xe" className="font-bold text-black uppercase hover:text-[#c8102e] block mb-1">
                            {car.name}
                         </Link>
                         <div className="text-[13px] text-gray-700 border-l-2 border-[#c8102e] pl-2">
                           {car.price}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

        </div>
      </main>
    </PublicPageShell>
  )
}

function MessageCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
  );
}

function FacebookIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  );
}
