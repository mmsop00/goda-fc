import Image from "next/image";
import Link from "next/link";

const HERO_PHOTO = "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Full-width hero image with dark gradient overlay */}
      <div className="relative w-full h-[70vh] min-h-[420px] max-h-[720px]">
        <Image
          src={HERO_PHOTO}
          alt="GODA FC"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={100}
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-goda-navy/70 via-goda-navy/40 to-goda-navy/80" />

        {/* Hero text content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-goda-yellow font-display font-semibold text-sm md:text-base tracking-[0.2em] uppercase mb-4 drop-shadow-lg">
            Thành lập 1994 — Hà Nội
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight drop-shadow-2xl">
            GODA FC
          </h1>
          <p className="text-white/80 font-medium text-base md:text-lg max-w-xl leading-relaxed drop-shadow-md">
            Câu lạc bộ bóng đá của những người bạn — nơi hội tụ đam mê, tinh thần đồng đội và khát vọng chiến thắng
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/tran-dau"
              className="px-6 py-3 bg-goda-yellow text-goda-navy font-bold rounded-full text-sm hover:bg-goda-yellow/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Lịch thi đấu
            </Link>
            <Link
              href="/thanh-vien"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full text-sm backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              Thành viên
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1 bg-goda-yellow" />
    </section>
  );
}
