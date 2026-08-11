"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  date: string;
  time: string;
}

export function CountdownTimer({ date, time }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const parseTarget = () => {
      const [d, m, y] = date.split("/");
      const timeClean = time.replace("h", ":");
      const [hh, mm] = timeClean.split(":");
      return new Date(+y, +m - 1, +d, +hh || 0, +mm || 0);
    };

    const target = parseTarget();
    if (isNaN(target.getTime())) return;

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ days, hours, mins, secs });
    };

    tick();
    const id = setInterval(tick, 1000); // update every second
    return () => clearInterval(id);
  }, [date, time]);

  if (!remaining || (remaining.days === 0 && remaining.hours === 0 && remaining.mins === 0 && remaining.secs === 0)) return null;

  return (
    <div className="flex items-center justify-center gap-0.5 pt-1.5 text-xs">
      <Clock className="size-3 text-goda-yellow shrink-0 animate-pulse" />
      {remaining.days > 0 && (
        <span className="tabular-nums font-mono font-semibold">{remaining.days}<span className="text-[9px] text-gray-400 ml-0.5">d</span></span>
      )}
      <span className="tabular-nums font-mono font-semibold">{String(remaining.hours).padStart(2, "0")}<span className="text-[9px] text-gray-400 ml-0.5">h</span></span>
      <span className="text-goda-yellow font-bold">:</span>
      <span className="tabular-nums font-mono font-semibold">{String(remaining.mins).padStart(2, "0")}<span className="text-[9px] text-gray-400 ml-0.5">m</span></span>
      <span className="text-goda-yellow font-bold">:</span>
      <span className="tabular-nums font-mono font-semibold">{String(remaining.secs).padStart(2, "0")}<span className="text-[9px] text-gray-400 ml-0.5">s</span></span>
    </div>
  );
}
