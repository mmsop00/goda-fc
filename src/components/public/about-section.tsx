import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, Calendar, Target } from "lucide-react";
import { ABOUT_TEXT } from "@/lib/mock-data";

interface AboutSectionProps {
  data?: typeof ABOUT_TEXT;
}

const STAT_ICONS: Record<string, React.ReactNode> = {
  "Năm thành lập": <Calendar className="size-8 text-goda-yellow" />,
  "Thành viên": <Users className="size-8 text-goda-yellow" />,
  "Trận đấu": <Trophy className="size-8 text-goda-yellow" />,
  "Mùa giải": <Target className="size-8 text-goda-yellow" />,
};

export function AboutSection({ data = ABOUT_TEXT }: AboutSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-warm-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Column */}
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-6">
              {data.title}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {data.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Stats Column */}
          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((stat) => (
              <Card key={stat.label} className="text-center p-6">
                <CardContent className="flex flex-col items-center gap-3 p-0">
                  {STAT_ICONS[stat.label]}
                  <span className="font-display font-extrabold text-3xl text-goda-navy">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
