"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Trận đấu", href: "/tran-dau" },
  { label: "Hall of Fame", href: "/hall-of-fame" },
  { label: "Tin tức & Hình ảnh", href: "/tin-tuc" },
  { label: "Thành viên", href: "/thanh-vien" },
  { label: "Đăng nhập", href: "/admin" },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Scroll lock when mobile nav is open (P-007)
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sticky nav bar (P-008/P-009: navy bg, proper z-index) */}
      <nav className="sticky top-0 z-50 bg-goda-navy border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-white hover:text-goda-yellow transition-colors shrink-0"
            >
              <Image
                src="/logo/1784257218361_1879959454207999809_1879959454207999809_cf852bc3f51705542f6fa977a483853e.jpg"
                alt="GODA FC"
                width={48}
                height={48}
                quality={100}
                className="rounded-full object-cover"
                style={{ imageRendering: "crisp-edges" }}
                priority
              />
              {/* Desktop: GODA FC only */}
              <span className="hidden sm:inline font-extrabold text-xl">GODA FC</span>
              {/* Mobile: GODA FC + tagline next to logo */}
              <span className="sm:hidden flex flex-col leading-tight">
                <span className="font-extrabold text-base">GODA FC</span>
                <span className="text-[10px] text-white/70 tracking-[0.15em] uppercase font-semibold">
                  Thành lập 1994 — Hà Nội
                </span>
              </span>
            </Link>

            {/* Desktop Links (≥768px) */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-goda-yellow bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger (<768px) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={NAV_ITEMS}
        currentPath={pathname}
      />
    </>
  );
}
