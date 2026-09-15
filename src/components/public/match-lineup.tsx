import type { MatchPlayer } from "@/lib/mock-data";

interface MatchLineupProps {
  godaLineup: MatchPlayer[];
  opponentLineup: MatchPlayer[];
  /** Tên đội nhà / đội khách thực tế — dùng cho cả trận có GODA lẫn trận
   * trung lập (GODA không thi đấu), thay vì mặc định gán "GODA FC". */
  homeName: string;
  awayName: string;
  /** Which side GODA is on — must match the home/away order shown in the hero above. */
  isHome: boolean;
}

export function MatchLineup({ godaLineup, opponentLineup, homeName, awayName, isHome }: MatchLineupProps) {
  // "GODA slot" trong du lieu (godaLineup/opponentLineup) tuong ung voi doi
  // nha hay doi khach tuy theo isHome - khong phai luon la "GODA FC".
  const godaLabel = isHome ? homeName : awayName;
  const opponentLabel = isHome ? awayName : homeName;

  const godaBlock = (
    <div>
      <h3 className="font-display font-semibold text-base text-goda-navy bg-goda-navy/5 px-4 py-2 rounded-lg mb-3 text-center">
        {godaLabel}
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
  );

  const opponentBlock = (
    <div>
      <h3 className="font-display font-semibold text-base text-gray-500 bg-gray-100 px-4 py-2 rounded-lg mb-3 text-center">
        {opponentLabel}
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
  );

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-goda-navy text-center mb-8">
          Đội hình ra sân
        </h2>

        {/* Same left/right order as the score header above: home team first. */}
        <div className="grid grid-cols-2 gap-6 md:gap-10">
          {isHome ? godaBlock : opponentBlock}
          {isHome ? opponentBlock : godaBlock}
        </div>
      </div>
    </section>
  );
}
