import type { Metadata } from "next";
import { NavBar } from "@/components/layout/nav-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "GODA FC",
  description: "Câu lạc bộ bóng đá GODA — Thành lập 1994, Hà Nội",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
