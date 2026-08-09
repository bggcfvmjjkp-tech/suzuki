import type { Metadata } from "next";
import "./globals.css";

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
    </html>
  );
}
