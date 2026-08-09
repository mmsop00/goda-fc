import { Separator } from "@/components/ui/separator";
import { FOOTER_DATA } from "@/lib/mock-data";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-goda-navy text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display font-extrabold text-2xl text-goda-yellow mb-4">
              GODA FC
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {FOOTER_DATA.description}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-goda-yellow mb-4">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              {FOOTER_DATA.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-goda-yellow mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📍 {FOOTER_DATA.contact.address}</li>
              <li>✉️ {FOOTER_DATA.contact.email}</li>
              <li>📞 {FOOTER_DATA.contact.phone}</li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-goda-yellow mb-4">
              Theo dõi
            </h4>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="#"
                className="size-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-goda-yellow hover:text-goda-navy transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="size-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-goda-yellow hover:text-goda-navy transition-colors"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <Separator className="bg-white/10" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 text-center">
        <p className="text-xs text-gray-400">
          © 1994–{currentYear} GODA FC. Toàn bộ quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
