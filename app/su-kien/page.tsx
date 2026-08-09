"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";

type Post = { id: string | number; title: string; slug: string; cover_image: string | null; short_description: string | null; created_at: string | null };

function NewsHero() {
  return <section className="relative h-36 overflow-hidden bg-[#172c48] md:h-44"><img src="/baner/imgi_5_2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" /><div className="relative mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-5 text-white"><h1 className="suzuki-condensed text-3xl font-bold uppercase">Tin tức</h1><div className="mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-white" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div><p className="mt-3 text-sm">Trang chủ <span className="mx-1">&gt;</span> Tin tức</p></div></section>;
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const load = async () => { const { data } = await supabase.from("posts").select("id, title, slug, cover_image, short_description, created_at").order("created_at", { ascending: false }); setPosts(data || []); setLoading(false); }; load(); }, []);
  return <PublicPageShell><NewsHero /><main className="mx-auto max-w-[1400px] px-5 py-10 md:py-14">{loading ? <div className="flex justify-center py-24"><div className="h-9 w-9 animate-spin rounded-full border-2 border-[#003b92] border-t-transparent" /></div> : posts.length ? <div className="grid gap-5 md:grid-cols-2">{posts.map((post) => <Link key={post.id} href={`/chi-tiet-bai-viet/${post.slug}`} className="group flex min-h-[164px] gap-4 rounded-lg border border-slate-100 bg-white p-3 shadow-md transition hover:-translate-y-0.5 hover:border-[#003b92] hover:shadow-lg"><div className="h-28 w-32 shrink-0 overflow-hidden sm:h-[112px] sm:w-[212px]"><img src={post.cover_image || "/news/imgi_21_1.jpg"} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="flex min-w-0 flex-1 flex-col py-0.5"><h2 className="line-clamp-2 text-[17px] font-bold uppercase leading-[1.25] text-[#ed1b2f] transition group-hover:text-[#003b92]">{post.title}</h2><p className="mt-2 flex items-center gap-1 text-[13px] leading-none text-slate-500"><CalendarDays size={14} />{post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : ""}</p><p className="mt-3 line-clamp-3 text-[16px] leading-[1.65] text-slate-700">{post.short_description || "Thông tin chi tiết đang được cập nhật."}</p></div></Link>)}</div> : <p className="py-24 text-center text-slate-500">Tin tức đang được cập nhật.</p>}</main></PublicPageShell>;
}
