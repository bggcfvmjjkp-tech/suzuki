"use client";

import type { ReactNode } from "react";
import { PublicSiteCarsProvider } from "./public-site-cars-context";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import { PublicFloatingZalo } from "./public-floating-zalo";

export function PublicPageShell({
  children,
  className = "bg-white",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-screen ${className}`.trim()}>
      <PublicHeader />
      {children}
      <PublicFooter />
      <PublicFloatingZalo />
    </div>
  );
}
