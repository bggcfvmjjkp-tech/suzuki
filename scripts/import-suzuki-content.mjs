import { readFile } from "node:fs/promises";

const SOURCE = "https://suzukivinh.com.vn";
const RECENT_POST_LIMIT = 12;

function readEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .filter((line) => line && !line.trimStart().startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
      })
  );
}

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&([a-z]+);/gi, (_, entity) => {
      const entities = { agrave: "à", aacute: "á", acirc: "â", atilde: "ã", egrave: "è", eacute: "é", ecirc: "ê", igrave: "ì", iacute: "í", ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ugrave: "ù", uacute: "ú", uuml: "ü", yacute: "ý", dcaron: "ď", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…" };
      return entities[entity.toLowerCase()] ?? `&${entity};`;
    })
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function textFromHtml(html = "") {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/(?:p|div|h[1-6]|li|tr|br|section)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n\s*\n+/g, "\n\n")
      .trim()
  );
}

function meta(html, property) {
  const matcher = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i");
  return decodeHtml(html.match(matcher)?.[1] ?? "");
}

function heading(html) {
  return textFromHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
}

function imageUrls(html, pattern, limit) {
  const urls = [];
  for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const url = new URL(match[1], SOURCE).href;
    if (pattern.test(url) && !urls.includes(url)) urls.push(url);
    if (urls.length === limit) break;
  }
  return urls;
}

function divSection(html, className) {
  const openingTag = new RegExp(
    `<div\\b[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>`,
    "i"
  );
  const start = html.search(openingTag);
  if (start < 0) return "";

  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let tag;
  while ((tag = tags.exec(html))) {
    depth += tag[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(start, tags.lastIndex);
  }
  return "";
}

function dateFromHtml(html) {
  const plain = textFromHtml(html);
  const match = plain.match(/Ngày đăng\s*:?\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i) ?? plain.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return new Date().toISOString();
  return new Date(`${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}T12:00:00.000Z`).toISOString();
}

async function sourcePage(path) {
  const response = await fetch(`${SOURCE}${path}`, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`Không tải được ${path}: ${response.status}`);
  return response.text();
}

async function rest(url, key, table, options = {}) {
  const response = await fetch(`${url}/rest/v1/${table}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers ?? {}),
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${table}: ${response.status} ${body}`);
  return body ? JSON.parse(body) : [];
}

async function upsert(url, key, table, rows, conflict) {
  return rest(url, key, table, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(rows),
  });
}

async function replaceBlocks(url, key, table, parentColumn, parentId, blocks) {
  await rest(url, key, `${table}?${parentColumn}=eq.${parentId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  if (!blocks.length) return;
  await rest(url, key, table, {
    method: "POST",
    body: JSON.stringify(blocks.map((block, sortOrder) => ({ ...block, [parentColumn]: parentId, sort_order: sortOrder }))),
  });
}

const cars = [
  { path: "/san-pham/17/suzuki-fronx", slug: "suzuki-fronx", category: "xe-hien-dai", price: "520.000.000 ₫" },
  { path: "/san-pham/4/suzuki-xl7-hybrid", slug: "suzuki-xl7-hybrid", category: "xe-hien-dai", price: "599.900.000 ₫" },
  { path: "/san-pham/5/suzuki-swift", slug: "suzuki-swift-hybrid", category: "xe-hien-dai", price: "569.000.000 ₫" },
  { path: "/san-pham/6/suzuki-jimny", slug: "suzuki-jimny", category: "xe-hien-dai", price: "789.000.000 ₫" },
  { path: "/san-pham/9/suzuki-blind-van", slug: "suzuki-eeco-van", category: "xe-dich-vu", price: "330.000.000 ₫" },
  { path: "/san-pham/8/suzuki-pro", slug: "suzuki-carry-pro", category: "xe-dich-vu", price: "318.600.000 ₫" },
];

async function main() {
  const env = readEnv(await readFile(".env.local", "utf8"));
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const serviceKey = env.SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Thiếu cấu hình Supabase trong .env.local");

  const categoryRows = await upsert(supabaseUrl, serviceKey, "car_categories?on_conflict=slug", [
    { name: "Xe du lịch Suzuki", slug: "xe-hien-dai" },
    { name: "Xe thương mại Suzuki", slug: "xe-dich-vu" },
  ]);
  const categoryIds = Object.fromEntries(categoryRows.map((item) => [item.slug, item.id]));

  for (const item of cars) {
    const html = await sourcePage(item.path);
    const name = heading(html) || item.slug.replaceAll("-", " ").toUpperCase();
    const description = meta(html, "description");
    const mainImage = meta(html, "og:image");
    const operationHtml = divSection(html, "detail-product_description");
    const featureHtml = divSection(html, "detail-content_description");
    const textBlocks = [
      textFromHtml(operationHtml),
      textFromHtml(featureHtml),
    ].filter((content) => content.length > 80);
    const gallery = [
      ...imageUrls(operationHtml, /\/public\/upload\/images\//i, 8),
      ...imageUrls(featureHtml, /\/public\/upload\/images\//i, 12),
      ...imageUrls(html, /\/public\/upload\/images\/hinhsanpham\//i, 8),
    ].filter((url, index, list) => list.indexOf(url) === index);
    const [saved] = await upsert(supabaseUrl, serviceKey, "cars?on_conflict=slug", [{
      name,
      slug: item.slug,
      category_id: categoryIds[item.category],
      price: item.price,
      short_description: description,
      general_description: description,
      main_image: mainImage,
      is_contact: false,
    }]);
    await replaceBlocks(supabaseUrl, serviceKey, "car_detail_blocks", "car_id", saved.id, [
      ...textBlocks.map((content) => ({ block_type: "text", content })),
      ...gallery.map((content) => ({ block_type: "image", content })),
    ]);
    console.log(`Đã nhập xe: ${name}`);
  }

  const postCategoryRows = await upsert(supabaseUrl, serviceKey, "post_categories?on_conflict=slug", [
    { name: "Tin tức ô tô Suzuki", slug: "tin-tuc-o-to-suzuki" },
    { name: "Khuyến mãi", slug: "khuyen-mai" },
  ]);
  const postCategoryId = postCategoryRows.find((item) => item.slug === "tin-tuc-o-to-suzuki")?.id;
  const home = await sourcePage("/");
  const articlePaths = [...new Set([...home.matchAll(/href=["']https:\/\/suzukivinh\.com\.vn(\/bai-viet\/\d+\/[^"'#?]+)/gi)].map((match) => match[1]))].slice(0, RECENT_POST_LIMIT);

  for (const path of articlePaths) {
    const html = await sourcePage(path);
    const title = heading(html);
    if (!title) continue;
    const slug = path.split("/").at(-1);
    const description = meta(html, "description");
    const coverImage = meta(html, "og:image");
    const afterDate = html.slice(Math.max(0, html.search(/Ngày đăng/i)));
    const articleBody = afterDate.slice(0, Math.max(0, afterDate.search(/<footer[\s>]/i)));
    const content = textFromHtml(articleBody)
      .replace(/^Ngày đăng\s*:?\s*\d{1,2}\/\d{1,2}\/\d{4}[\s\S]*?Lượt xem\s*:?\s*[\d.,]+/i, "")
      .trim();
    const images = imageUrls(articleBody, /\/public\/upload\/images\/(?!thumb_baiviet)/i, 10);
    const [saved] = await upsert(supabaseUrl, serviceKey, "posts?on_conflict=slug", [{
      title,
      slug,
      category_id: postCategoryId,
      cover_image: coverImage,
      short_description: description,
      created_at: dateFromHtml(html),
      updated_at: new Date().toISOString(),
    }]);
    const blocks = [{ block_type: "text", content: content || description }, ...images.map((content) => ({ block_type: "image", content }))];
    await replaceBlocks(supabaseUrl, serviceKey, "post_blocks", "post_id", saved.id, blocks);
    console.log(`Đã nhập bài viết: ${title}`);
  }

  console.log(`Hoàn tất: ${cars.length} xe và ${articlePaths.length} bài viết.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
