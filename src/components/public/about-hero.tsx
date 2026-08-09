import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-goda-navy">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 size-64 rounded-full bg-goda-yellow blur-3xl" />
        <div className="absolute bottom-10 left-10 size-96 rounded-full bg-goda-green blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-36 text-center">
        <Badge className="bg-goda-yellow text-goda-navy text-sm px-4 py-1 font-semibold border-0 mb-4">
          <Trophy className="size-3.5" />
          Est. 1994
        </Badge>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          Về GODA FC
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Hành trình hơn 30 năm của một đội bóng — từ sân đất C500 đến cộng đồng
          hàng trăm thành viên.
        </p>
      </div>

      <div className="h-1.5 bg-goda-yellow" />
    </section>
  );
}
