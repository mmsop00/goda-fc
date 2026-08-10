import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import Image from "next/image";

const HERO_PHOTO = "/photos/z8053179673964_efe7a825564ab004cb6a5e9da363fdbf.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-goda-navy">
      {/* Background photo */}
      <Image
        src={HERO_PHOTO}
        alt="GODA FC team"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={90}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-goda-navy/50" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          {/* Badge */}
          <Badge className="bg-goda-yellow text-goda-navy text-sm px-4 py-1 font-semibold border-0">
            <Trophy className="size-3.5" />
            Est. 1994
          </Badge>

          {/* Main heading */}
          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
            Câu lạc bộ bóng đá
            <br />
            <span className="text-goda-yellow">GODA FC</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            Hơn 30 năm gắn kết đam mê — Nơi bóng đá là gia đình.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              className="bg-goda-yellow text-goda-navy hover:bg-goda-yellow/90 font-semibold text-base px-8"
            >
              Khám phá GODA FC
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8"
            >
              Liên hệ với chúng tôi
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}
