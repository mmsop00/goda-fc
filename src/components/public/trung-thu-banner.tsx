// Trang trí theo mùa — banner chúc mừng Tết Trung Thu, hình minh hoạ "rước
// đèn" theo phong cách truyền thống (trăng rằm, thỏ ngọc, đoàn rước đèn ban
// đêm), nhưng thay vì đèn ông sao, anh em GODA FC nâng cao... cốc bia sủi
// bọt sáng ấm như đèn lồng :))
// Chỉ là lớp trang trí tạm thời, không đổi cấu trúc/màu thương hiệu chính;
// gỡ bỏ dễ dàng sau mùa lễ bằng cách bỏ import + thẻ <TrungThuBanner /> ở
// page.tsx.

const FIGURES = [
  { x: 90, scale: 0.95, armUp: 38 },
  { x: 195, scale: 1.05, armUp: 50 },
  { x: 300, scale: 0.9, armUp: 34 },
  { x: 405, scale: 1, armUp: 46 },
  { x: 500, scale: 0.92, armUp: 36 },
];

function BeerMugFigure({ x, scale, armUp }: { x: number; scale: number; armUp: number }) {
  const mugY = 120 - armUp;
  return (
    <g transform={`translate(${x}, 0) scale(${scale})`}>
      {/* Cánh tay nâng cốc */}
      <path d={`M 6 172 Q 16 ${150 - armUp / 2} 22 ${mugY + 22}`} stroke="#1B1030" strokeWidth={5} strokeLinecap="round" fill="none" />
      {/* Thân người (đơn giản hoá) */}
      <rect x={-9} y={170} width={18} height={55} rx={9} fill="#1B1030" />
      {/* Đầu */}
      <circle cx={0} cy={160} r={11} fill="#1B1030" />

      {/* Cốc bia — sáng ấm như đèn lồng */}
      <g transform={`translate(22, ${mugY})`}>
        <circle r={19} fill="#FFE9A3" opacity={0.75} filter="url(#softGlow)" />
        {/* Quai cốc */}
        <path d="M 9 3 C 19 3 19 19 9 19" stroke="#C9A227" strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* Thân cốc (thuỷ tinh) */}
        <rect x={-9} y={-2} width={18} height={26} rx={3} fill="url(#beerGrad)" stroke="#C9A227" strokeWidth={1} />
        {/* Ánh phản chiếu thuỷ tinh */}
        <rect x={-6} y={2} width={2} height={17} rx={1} fill="#FFFDF6" opacity={0.45} />
        {/* Bọt bia trên miệng cốc */}
        <circle cx={-5} cy={-3} r={4} fill="#FFF8E8" />
        <circle cx={1} cy={-5.5} r={4.6} fill="#FFF8E8" />
        <circle cx={6.5} cy={-3} r={3.6} fill="#FFF8E8" />
        {/* Bọt bay lên */}
        <circle cx={-2} cy={-14} r={1.3} fill="#FFFDF6" opacity={0.9} />
        <circle cx={4} cy={-19} r={1} fill="#FFFDF6" opacity={0.8} />
        <circle cx={0} cy={-24} r={1.2} fill="#FFFDF6" opacity={0.7} />
      </g>
    </g>
  );
}

export function TrungThuBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#150C2E] via-[#3A1440] to-[#7A2A1F]">
      <svg
        viewBox="0 0 800 240"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto block"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3D2" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FFF3D2" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="beerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD25E" />
            <stop offset="100%" stopColor="#E8A100" />
          </linearGradient>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Ngôi sao lấp lánh trên trời (nền trời dùng luôn gradient CSS của
            section phía sau — SVG trong suốt nên không cần vẽ rect riêng) */}
        {[
          [60, 30], [140, 55], [230, 22], [330, 45], [430, 20],
          [520, 50], [740, 30], [770, 90], [40, 110], [600, 25],
        ].map(([sx, sy], i) => (
          <circle
            key={i}
            cx={sx}
            cy={sy}
            r={i % 3 === 0 ? 2 : 1.3}
            fill="#FFF3D2"
            className="animate-sparkle-twinkle"
            style={{ animationDelay: `${(i % 5) * 0.4}s` }}
          />
        ))}

        {/* Trăng rằm + thỏ ngọc */}
        <circle cx={660} cy={68} r={85} fill="url(#moonGlow)" />
        <circle cx={660} cy={68} r={46} fill="#FFF3D2" />
        <g fill="#E8CE8A" opacity={0.75}>
          <ellipse cx={652} cy={78} rx={11} ry={7} />
          <circle cx={646} cy={66} r={6.5} />
          <ellipse cx={641} cy={54} rx={2.6} ry={9} transform="rotate(-18 641 54)" />
          <ellipse cx={651} cy={51} rx={2.6} ry={9} transform="rotate(6 651 51)" />
        </g>

        {/* Đường chân trời / mặt đất */}
        <path
          d="M0,225 C120,205 220,215 320,208 C420,201 500,214 600,210 C680,207 740,216 800,212 L800,240 L0,240 Z"
          fill="#150C2E"
        />

        {/* Đoàn rước đèn — nâng cốc bia sáng ấm như đèn lồng */}
        {FIGURES.map((f, i) => (
          <BeerMugFigure key={i} {...f} />
        ))}
      </svg>

      {/* Lời chúc */}
      <div className="relative bg-[#150C2E] px-4 pb-4 sm:pb-5 pt-1 text-center">
        <p className="font-display font-bold text-base sm:text-lg text-goda-yellow tracking-wide">
          🏮 GODA FC — Trung Thu Đoàn Viên 🌕
        </p>
        <p className="mt-1 text-xs sm:text-sm text-white/80">
          Không rước đèn ông sao, anh em GODA rước… cốc bia sủi bọt sáng ấm cả đêm trăng! 🍺✨
        </p>
      </div>
    </section>
  );
}
