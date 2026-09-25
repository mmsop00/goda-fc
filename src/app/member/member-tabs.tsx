"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface TabItem {
  label: string;
  href: string;
}

/** Thanh tab dùng chung: tab chính của khu thành viên và tab con trong từng mục. */
export function MemberTabs({ items, variant = "main" }: { items: TabItem[]; variant?: "main" | "sub" }) {
  const pathname = usePathname();
  // Tab khớp dài nhất thắng, để "/member/quy" không sáng cùng lúc với "/member/quy/chu-tich".
  const active = items
    .filter((t) => pathname === t.href || pathname.startsWith(t.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  if (variant === "sub") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active === t.href
                ? "bg-goda-navy text-white"
                : "bg-white text-goda-navy ring-1 ring-goda-navy/15 hover:bg-goda-navy/5"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            active === t.href
              ? "border-goda-yellow text-white"
              : "border-transparent text-white/70 hover:text-white"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
