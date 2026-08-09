import nodemailer from "nodemailer";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

type LeadPayload = {
  type: "Lái thử" | "Nhận thông tin" | string;
  fullName: string;
  phone: string;
  address?: string;
  carModel?: string;
  hasLicense?: string;
  notes?: string;
  email?: string;
};

function requiredString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v : null;
}

async function getRecipientEmail(): Promise<string | null> {
  const { data, error } = await supabaseServer
    .from("settings")
    .select("value")
    .eq("key", "email")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch settings.email:", error);
    return process.env.LEAD_NOTIFY_TO_EMAIL?.trim() || null;
  }

  const v = data?.value?.trim();
  return v || process.env.LEAD_NOTIFY_TO_EMAIL?.trim() || null;
}

function createTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP env (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
  }

  const secure =
    typeof process.env.SMTP_SECURE === "string"
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function buildEmailText(payload: LeadPayload) {
  const lines = [
    `Loại: ${payload.type}`,
    `Họ tên: ${payload.fullName}`,
    `SĐT: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.address ? `Địa chỉ: ${payload.address}` : null,
    payload.carModel ? `Dòng xe: ${payload.carModel}` : null,
    payload.hasLicense ? `Bằng lái: ${payload.hasLicense}` : null,
    payload.notes ? `Ghi chú/Nội dung: ${payload.notes}` : null,
    `Thời gian: ${new Date().toLocaleString("vi-VN")}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 12px;border-top:1px solid #e5e7eb;width:160px;color:#6b7280;font-weight:600;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-top:1px solid #e5e7eb;color:#111827">${escapeHtml(value)}</td>
    </tr>
  `.trim();
}

function buildEmailHtml(payload: LeadPayload) {
  const createdAt = new Date().toLocaleString("vi-VN");
  const notes =
    payload.notes?.trim() ? payload.notes.trim() : "(không có nội dung thêm)";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lead mới</title>
  </head>
  <body style="margin:0;background:#f3f4f6;padding:24px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji'">
    <div style="max-width:720px;margin:0 auto">
      <div style="background:#111827;color:#fff;border-radius:14px 14px 0 0;padding:18px 20px">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85">Website</div>
        <div style="font-size:18px;font-weight:800;margin-top:4px">Có đăng ký mới: ${escapeHtml(
          payload.type
        )}</div>
      </div>

      <div style="background:#fff;border-radius:0 0 14px 14px;overflow:hidden;border:1px solid #e5e7eb;border-top:none">
        <div style="padding:18px 20px">
          <div style="font-size:14px;color:#6b7280">Khách hàng</div>
          <div style="font-size:22px;font-weight:800;color:#111827;margin-top:4px">${escapeHtml(
            payload.fullName
          )}</div>
          <div style="margin-top:10px">
            <a href="tel:${escapeHtml(
              payload.phone
            )}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;font-weight:700;padding:10px 14px;border-radius:10px">Gọi: ${escapeHtml(
              payload.phone
            )}</a>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${row("Số điện thoại", payload.phone)}
          ${row("Email", payload.email)}
          ${row("Địa chỉ", payload.address)}
          ${row("Dòng xe", payload.carModel)}
          ${row("Bằng lái", payload.hasLicense)}
          ${row("Thời gian", createdAt)}
          ${row("Nội dung", notes)}
        </table>

        <div style="padding:14px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
          Email này được gửi tự động từ website.
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = requiredString((body as any)?.fullName);
  const phone = requiredString((body as any)?.phone);
  const type = requiredString((body as any)?.type) ?? "Nhận thông tin";

  if (!fullName || !phone) {
    return Response.json(
      { error: "Missing required fields: fullName, phone" },
      { status: 400 }
    );
  }

  const payload: LeadPayload = {
    type,
    fullName,
    phone,
    address: requiredString((body as any)?.address) ?? undefined,
    carModel: requiredString((body as any)?.carModel) ?? undefined,
    hasLicense: requiredString((body as any)?.hasLicense) ?? undefined,
    notes: requiredString((body as any)?.notes) ?? undefined,
    email: requiredString((body as any)?.email) ?? undefined,
  };

  const { error: insertError } = await supabaseServer
    .from("lead_registrations")
    .insert([
      {
        full_name: payload.fullName,
        phone: payload.phone,
        address: payload.address,
        car_model: payload.carModel,
        type: payload.type,
        has_license: payload.hasLicense,
        notes: payload.notes,
        email: payload.email,
        status: "Mới",
      },
    ]);

  if (insertError) {
    console.error("Failed to insert lead_registrations:", insertError);
    return Response.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }

  const to = await getRecipientEmail();
  if (!to) {
    return Response.json(
      {
        ok: true,
        warning:
          "Saved to DB but no recipient email found (settings.email or LEAD_NOTIFY_TO_EMAIL).",
      },
      { status: 200 }
    );
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim();
  if (!from) {
    return Response.json(
      { error: "Missing SMTP_FROM (or SMTP_USER)" },
      { status: 500 }
    );
  }

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email || undefined,
      subject: `[Website] ${payload.type} - ${payload.fullName} (${payload.phone})`,
      text: buildEmailText(payload),
      html: buildEmailHtml(payload),
    });
  } catch (e) {
    console.error("Failed to send email:", e);
    return Response.json(
      { ok: true, warning: "Saved to DB but failed to send email." },
      { status: 200 }
    );
  }

  return Response.json({ ok: true }, { status: 200 });
}

