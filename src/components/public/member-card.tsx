import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";
import type { MemberPublic } from "@/lib/mock-data";

interface MemberCardProps {
  member?: MemberPublic;
  isLoading?: boolean;
}

export function MemberCard({ member, isLoading }: MemberCardProps) {
  if (isLoading) {
    return (
      <Card className="p-4 items-center text-center gap-3">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-12" />
        <div className="grid grid-cols-4 gap-2 w-full pt-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </Card>
    );
  }

  if (!member) return null;

  return (
    <Card className="p-4 items-center text-center gap-0 h-full">
      <CardContent className="flex flex-col items-center gap-2.5 p-0 h-full">
        {/* Avatar initials */}
        <div className="size-16 rounded-full bg-goda-navy flex items-center justify-center text-white font-bold text-lg shrink-0">
          {member.name
            .split(" ")
            .pop()!
            .charAt(0)}
        </div>

        {/* Name & Nickname */}
        <div className="min-h-[2.5rem]">
          <h3 className="font-display font-semibold text-sm text-goda-navy leading-tight">
            {member.name}
          </h3>
          <p className="text-xs text-gray-400">&ldquo;{member.nickname}&rdquo;</p>
        </div>

        {/* Position + Number */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {member.position}
          </Badge>
          <span className="text-lg font-bold text-goda-yellow">
            #{member.number}
          </span>
        </div>

        {/* Birthday + Join Year */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 min-h-[1.25rem]">
          {member.birthday && <span>🎂 {member.birthday}</span>}
          <span>Tham gia: {member.joinYear && member.joinYear > 0 ? member.joinYear : "xx"}</span>
        </div>

        {/* Stats — PUBLIC FIELDS ONLY */}
        <div className="grid grid-cols-4 gap-1 w-full pt-2 border-t border-gray-100 text-center mt-auto">
          <div>
            <span className="block text-xs font-bold text-goda-navy">{member.matches}</span>
            <span className="text-[10px] text-gray-400">Trận</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-goda-navy">{member.goals}</span>
            <span className="text-[10px] text-gray-400">Bàn</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-goda-navy">{member.assists}</span>
            <span className="text-[10px] text-gray-400">K.tạo</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-0.5">
              <Award className="size-2.5 text-goda-yellow" />
              <span className="text-xs font-bold text-goda-yellow">{member.mvp}</span>
            </div>
            <span className="text-[10px] text-gray-400">MVP</span>
          </div>
        </div>

        {/* Chức vụ — only show for Đội trưởng / Đội phó */}
        {member.status && member.status !== "Đang thi đấu" && (
          <Badge
            className={`text-xs border-0 ${
              member.status === "Đội trưởng"
                ? "bg-goda-yellow text-goda-navy"
                : "bg-goda-navy text-white"
            }`}
          >
            {member.status}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
