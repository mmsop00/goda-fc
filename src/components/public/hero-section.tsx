import Image from "next/image";

const HERO_PHOTO = "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg";

export function HeroSection() {
  return (
    <section>
      {/* Full-width team photo */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={HERO_PHOTO}
          alt="GODA FC team"
          fill
          className="object-contain object-center"
          priority
          sizes="100vw"
          quality={100}
          unoptimized
        />
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}
