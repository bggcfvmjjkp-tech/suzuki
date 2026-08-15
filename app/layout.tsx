import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";

export const metadata: Metadata = {
  title: "Suzuki Vinh Nghệ An - Đại lý Suzuki chính thức",
  description: "Suzuki Vinh Nghệ An - Cập nhật các dòng xe Suzuki, bảng giá, ưu đãi và đăng ký lái thử.",
  icons: { icon: "/logo/suzikiico.ico" },
};

import { PublicSiteCarsProvider } from "@/components/public/public-site-cars-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <PublicSiteCarsProvider>{children}</PublicSiteCarsProvider>
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </html>
  );
}
