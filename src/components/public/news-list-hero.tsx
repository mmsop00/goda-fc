export function NewsListHero() {
  return (
    <section className="relative overflow-hidden bg-goda-navy py-20 md:py-28">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 size-64 rounded-full bg-goda-yellow blur-3xl" />
        <div className="absolute bottom-10 left-10 size-96 rounded-full bg-goda-green blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          Hành trình GODA FC
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Những câu chuyện chưa kể từ 1994
        </p>
      </div>
      <div className="h-1.5 bg-goda-yellow mt-20 md:mt-28" />
    </section>
  );
}
