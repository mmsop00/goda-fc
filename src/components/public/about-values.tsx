import { Card, CardContent } from "@/components/ui/card";
import { Heart, Scale, Flame, Home } from "lucide-react";
import type { CoreValue } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="size-8 text-goda-yellow" />,
  Scale: <Scale className="size-8 text-goda-yellow" />,
  Flame: <Flame className="size-8 text-goda-yellow" />,
  Home: <Home className="size-8 text-goda-yellow" />,
};

interface AboutValuesProps {
  values: CoreValue[];
}

export function AboutValues({ values }: AboutValuesProps) {
  return (
    <section className="py-16 md:py-20 bg-goda-soft-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-goda-navy mb-3">
            Giá trị cốt lõi
          </h2>
          <p className="text-gray-500">
            Những nguyên tắc định hình bản sắc GODA FC
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="p-6 text-center">
              <CardContent className="flex flex-col items-center gap-4 p-0">
                <div className="size-16 rounded-2xl bg-goda-navy/5 flex items-center justify-center">
                  {ICON_MAP[value.icon]}
                </div>
                <h3 className="font-display font-semibold text-lg text-goda-navy">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
