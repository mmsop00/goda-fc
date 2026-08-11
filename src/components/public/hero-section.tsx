import Image from "next/image";

const HERO_PHOTO = "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg";

export function HeroSection() {
  return (
    <section>
      {/* Full-width team photo */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[560px] lg:h-[640px]">
        <Image
          src={HERO_PHOTO}
          alt="GODA FC team"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}
