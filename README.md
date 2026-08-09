# GODA FC ⚽

**Câu lạc bộ bóng đá GODA** — Thành lập 1994, Hà Nội.

Website chính thức + member portal + admin dashboard.

---

## Công nghệ

- **Next.js** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** v4
- **shadcn/ui** (New York style, Neutral base)
- PostgreSQL (Supabase) + Prisma *(sẽ thiết lập ở Phase 2)*

---

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

---

## Các lệnh

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy development server tại `localhost:3000` |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra TypeScript (không emit file) |

---

## Cấu trúc thư mục

```text
goda-fc/
├── src/
│   ├── app/
│   │   ├── (public)/       → Route gốc "/"
│   │   ├── member/         → "/member" (khu vực thành viên)
│   │   ├── admin/          → "/admin" (khu vực quản trị)
│   │   ├── dev/ui-lab/     → "/dev/ui-lab" (UI component library)
│   │   ├── layout.tsx      → Root layout
│   │   └── globals.css     → Global styles + design tokens
│   ├── components/
│   │   └── ui/             → shadcn/ui components
│   └── lib/
│       └── utils.ts        → Utility functions (cn, etc.)
├── public/                 → Static assets
├── components.json         → shadcn/ui configuration
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design Tokens

| Token | Giá trị |
|---|---|
| Primary Yellow | `#F7C600` |
| Deep Navy | `#0B1E3A` |
| GODA Green | `#0F6B4D` |
| Warm White | `#FFFDF6` |
| Soft Gray | `#F2F4F7` |
| Text Dark | `#152033` |
| Font Display | Be Vietnam Pro → Manrope → Inter |

---

## License

Private — GODA FC.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
