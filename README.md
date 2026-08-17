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

## Deploy trên Vercel + Neon

Trang live: **https://clbgoda.vn** (project Vercel: `goda-fc`, tự deploy khi push lên GitHub).

### Biến môi trường cần có trên Vercel (Settings → Environment Variables)

| Tên | Nguồn | Ghi chú |
|---|---|---|
| `DATABASE_URL` | Neon Console → Connection Details → **Pooled** connection | Dùng cho app |
| `DIRECT_URL` | Neon Console → Connection Details → **Direct** connection | Bắt buộc khi build chạy `prisma db push` |
| `AUTH_SECRET` | `npx auth secret` | NextAuth v5 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Tự đặt | Dùng cho `prisma db seed` |

- `vercel.json` chạy `prisma db push` trong lúc build **chỉ khi** `DIRECT_URL` tồn tại, nên deploy không bao giờ fail vì thiếu biến này.
- Schema hiện chưa có migrations — mọi thay đổi schema sẽ được đồng bộ tự động qua `db push`.

### Chạy local với DB thật

Copy `.env.example` → `.env`, điền chuỗi Neon (pooled vào `DATABASE_URL`, direct vào `DIRECT_URL`), rồi:

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Local và production dùng chung cấu hình, chỉ khác giá trị `.env`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
