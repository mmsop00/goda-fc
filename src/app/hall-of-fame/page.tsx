import { HallOfFameGrid } from "@/components/public/hall-of-fame-grid";
import { MOCK_HALL_OF_FAME } from "@/lib/mock-data";

export default function HallOfFamePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-goda-navy py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 size-96 rounded-full bg-goda-yellow blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Hall of Fame
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Tôn vinh những huyền thoại — những người đã làm nên tên tuổi GODA FC
          </p>
        </div>
        <div className="h-1.5 bg-goda-yellow mt-20 md:mt-28" />
      </section>

      {/* Grid */}
      <HallOfFameGrid entries={MOCK_HALL_OF_FAME} />
    </>
  );
}
