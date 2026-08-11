"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  date: string; // "DD/MM/YYYY"
  time: string; // "16:00" or "16h00"
}

function TimeDigit({ value, label }: { value: string; label: string }) {
  const prevValue = useRef(value);

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  const changed = prevValue.current !== value;

  return (
    <span className="flex items-baseline gap-0.5">
      <span
        key={value}
        className={`inline-block tabular-nums font-mono font-semibold text-sm bg-goda-navy/10 rounded-md px-1.5 py-0.5 min-w-[2ch] text-center ${changed ? "animate-in zoom-in-95 duration-200" : ""}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </span>
  );
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
    <div className="flex items-center justify-center gap-2 pt-2">
      <Clock className="size-3.5 text-goda-yellow shrink-0 animate-pulse" />
      {remaining.days > 0 && (
        <TimeDigit value={String(remaining.days)} label="ngày" />
      )}
      <TimeDigit value={String(remaining.hours).padStart(2, "0")} label="h" />
      <span className="text-sm font-bold text-goda-yellow animate-pulse">:</span>
      <TimeDigit value={String(remaining.mins).padStart(2, "0")} label="m" />
      <span className="text-sm font-bold text-goda-yellow animate-pulse">:</span>
      <TimeDigit value={String(remaining.secs).padStart(2, "0")} label="s" />
    </div>
  );
}
