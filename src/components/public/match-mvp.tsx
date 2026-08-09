import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

interface MatchMVPProps {
  playerName: string;
}

export function MatchMVP({ playerName }: MatchMVPProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-2 border-goda-yellow bg-goda-yellow/5">
          <CardContent className="flex flex-col items-center py-8 gap-4 text-center">
            <div className="size-16 rounded-full bg-goda-yellow flex items-center justify-center">
              <Award className="size-8 text-goda-navy" />
            </div>
            <div>
              <p className="text-sm text-goda-navy/70 font-medium">
                Cầu thủ xuất sắc nhất trận
              </p>
              <h3 className="font-display font-bold text-2xl text-goda-navy mt-1">
                {playerName}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
