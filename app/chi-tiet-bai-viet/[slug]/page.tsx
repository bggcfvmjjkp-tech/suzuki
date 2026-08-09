"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PublicPageShell } from "@/components/public/public-page-shell";
import { usePublicSiteCars } from "@/components/public/public-site-cars-context";

type Post = { id: string | number; title: string; cover_image: string | null; short_description: string | null; created_at: string | null };
type Block = { id: string | number; block_type: "text" | "image" | "video"; content: string };

function embedUrl(url: string) { return url.includes("youtube.com/watch?v=") ? url.replace("watch?v=", "embed/") : url.includes("youtu.be/") ? url.replace("youtu.be/", "youtube.com/embed/") : url; }

export default function ArticleDetail() {
  const { slug } = useParams();
  const { settings } = usePublicSiteCars();
  const [post, setPost] = useState<Post | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const phone = settings.phone_number || "0944 006 999";
  const zalo = settings.zalo_link || `https://zalo.me/${phone.replace(/\D/g, "")}`;

  useEffect(() => { void (async () => { if (!slug) return; const { data } = await supabase.from("posts").select("id, title, cover_image, short_description, created_at").eq("slug", slug).single(); if (data) { setPost(data); const { data: blockData } = await supabase.from("post_blocks").select("id, block_type, content").eq("post_id", data.id).order("sort_order", { ascending: true }); setBlocks((blockData || []) as Block[]); } setLoading(false); })(); }, [slug]);

  if (loading) return <PublicPageShell><div className="flex min-h-[50vh] justify-center pt-24"><div className="h-9 w-9 animate-spin rounded-full border-2 border-[#003b92] border-t-transparent" /></div></PublicPageShell>;
  if (!post) return <PublicPageShell><div className="mx-auto max-w-[1400px] px-5 py-24 text-center"><p className="text-slate-500">Không tìm thấy bài viết.</p><Link href="/su-kien" className="mt-5 inline-flex text-[#003b92]">Quay lại tin tức</Link></div></PublicPageShell>;

  return <PublicPageShell><section className="relative h-36 overflow-hidden bg-[#172c48] md:h-44"><img src="/suzuki/banners/test-drive.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /><div className="relative mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-5 text-white"><h1 className="suzuki-condensed text-3xl font-bold uppercase">Tin tức</h1><div className="mt-3 flex w-14 gap-1"><span className="h-[3px] flex-1 bg-white" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div><p className="mt-3 text-sm">Trang chủ <span className="mx-1">&gt;</span> Tin tức</p></div></section><main className="mx-auto max-w-4xl px-5 py-10 md:py-14"><Link href="/su-kien" className="inline-flex items-center gap-1 text-sm font-semibold text-[#003b92] transition hover:text-[#ed1b2f]"><ChevronLeft size={16} /> Quay lại tin tức</Link><article className="mt-7"><p className="flex items-center gap-1 text-[14px] text-slate-500"><CalendarDays size={15} />{post.created_at ? new Date(post.created_at).toLocaleDateString("vi-VN") : ""}</p><h2 className="mt-4 text-[28px] font-bold uppercase leading-[1.25] text-[#172033] md:text-[34px]">{post.title}</h2><div className="mt-5 flex w-16 gap-1"><span className="h-[3px] flex-1 bg-[#003b92]" /><span className="h-[3px] w-5 bg-[#ed1b2f]" /></div>{post.cover_image && <img src={post.cover_image} alt={post.title} className="mt-8 max-h-[520px] w-full rounded-lg object-cover shadow-sm" />}{post.short_description && <p className="mt-7 border-l-4 border-[#ed1b2f] bg-slate-50 px-5 py-4 text-[18px] font-semibold leading-[1.65] text-slate-700">{post.short_description}</p>}<div className="mt-8 space-y-8 text-[17px] leading-[1.85] text-slate-700">{blocks.map((block) => block.block_type === "image" ? <img key={block.id} src={block.content} alt="" className="w-full rounded-lg shadow-sm" /> : block.block_type === "video" ? <div key={block.id} className="aspect-video overflow-hidden rounded-lg bg-black shadow-sm"><iframe src={embedUrl(block.content)} title="Video bài viết" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : <p key={block.id} className="whitespace-pre-wrap">{block.content}</p>)}</div></article><section className="mt-12 rounded-xl bg-[#003b92] px-6 py-6 text-white md:flex md:items-center md:justify-between"><div><p className="text-lg font-bold">Cần tư vấn về xe Suzuki?</p><p className="mt-1 text-sm text-white/80">Liên hệ ngay để nhận thông tin và ưu đãi mới nhất.</p></div><a href={zalo} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded bg-[#ed1b2f] px-5 py-3 text-sm font-bold md:mt-0"><Phone size={17} />Zalo: {phone}</a></section></main></PublicPageShell>;
}
