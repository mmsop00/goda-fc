import type { MatchPlayer } from "@/lib/mock-data";

interface MatchLineupProps {
  godaLineup: MatchPlayer[];
  opponentLineup: MatchPlayer[];
  opponentName: string;
}

export function MatchLineup({ godaLineup, opponentLineup, opponentName }: MatchLineupProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-goda-navy text-center mb-8">
          Đội hình ra sân
        </h2>

        <div className="grid grid-cols-2 gap-6 md:gap-10">
          {/* GODA FC */}
          <div>
            <h3 className="font-display font-semibold text-base text-goda-navy bg-goda-navy/5 px-4 py-2 rounded-lg mb-3 text-center">
              GODA FC
            </h3>
            <div className="space-y-1">
              {godaLineup.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-goda-soft-gray transition-colors text-sm"
                >
                  <span className="font-bold text-goda-yellow w-6 text-center">
                    {player.number}
                  </span>
                  <span className="text-goda-navy font-medium flex-1">
                    {player.name}
                  </span>
                  <span className="text-xs text-gray-400">{player.position}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opponent */}
          <div>
            <h3 className="font-display font-semibold text-base text-gray-500 bg-gray-100 px-4 py-2 rounded-lg mb-3 text-center">
              {opponentName}
            </h3>
            <div className="space-y-1">
              {opponentLineup.map((player, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm"
                >
                  <span className="font-bold text-gray-400 w-6 text-center">
                    {player.number}
                  </span>
                  <span className="text-gray-600 font-medium flex-1">
                    {player.name}
                  </span>
                  <span className="text-xs text-gray-400">{player.position}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
