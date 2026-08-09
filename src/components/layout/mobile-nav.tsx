"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Trophy } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: { label: string; href: string }[];
  currentPath: string;
}

export function MobileNav({ open, onClose, items, currentPath }: MobileNavProps) {
  if (!open) return null;

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-goda-navy shadow-2xl md:hidden animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 font-display font-extrabold text-lg text-white"
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
            GODA FC
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-goda-yellow bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            © 1994–{new Date().getFullYear()} GODA FC
          </p>
        </div>
      </div>
    </>
  );
}
