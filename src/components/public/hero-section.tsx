import Image from "next/image";
import Link from "next/link";

const HERO_PHOTO = "/photos/goda-32-nam-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Full-width hero image with dark gradient overlay */}
      <div className="relative w-full h-[40vh] min-h-[280px] sm:h-[70vh] sm:min-h-[420px] max-h-[720px] bg-goda-navy">
        <Image
          src={HERO_PHOTO}
          alt="GODA FC"
          fill
          // Mobile: object-contain — this photo is a wide team shot, and on a
          // narrow phone screen `object-cover` center-crops away the players
          // standing at the left/right edges. Showing the whole width
          // (letterboxed against the navy background) keeps everyone in
          // frame. Desktop has enough width that object-cover never crops
          // the sides, only a little off the top/bottom, so it stays full-bleed.
          className="object-contain sm:object-cover object-center"
          priority
          sizes="100vw"
          quality={100}
          unoptimized
        />

        {/* Gradient overlay — subtle, mostly for the button row at the bottom.
            The headline/date is now baked into the photo itself, so this no
            longer darkens the top (that would double up with the photo's
            own caption treatment and wash it out). */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-goda-navy/5 to-goda-navy/65" />

        {/* CTA buttons only — desktop. The "GODA FC" / anniversary copy that
            used to live here is now printed on the photo itself (top of the
            image); keeping both would duplicate and visually overlap it. */}
        <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-end pb-10 md:pb-12 px-4">
          <div className="flex gap-4">
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
