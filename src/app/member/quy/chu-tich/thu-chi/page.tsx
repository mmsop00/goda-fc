"use client";

import { useState } from "react";
import { CreateBillForm } from "@/components/finance/create-bill-form";
import { FundEntryForm } from "@/components/finance/fund-entry-form";

type Mode = "thu_thanh_vien" | "thu_ngoai" | "chi";

function Choice<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string, string][];
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(([v, label, hint]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            value === v ? "border-goda-navy bg-goda-navy text-white" : "border-border bg-white text-goda-navy hover:bg-goda-navy/5"
          }`}
        >
          <span className="block text-sm font-semibold">{label}</span>
          <span className={`block text-xs ${value === v ? "text-white/75" : "text-gray-500"}`}>{hint}</span>
        </button>
      ))}
    </div>
  );
}

export default function ThuChiPage() {
  const [mode, setMode] = useState<Mode>("thu_thanh_vien");
  const direction = mode === "chi" ? "chi" : "thu";

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
      <Choice<"thu" | "chi">
        value={direction}
        onChange={(d) => setMode(d === "chi" ? "chi" : "thu_thanh_vien")}
        options={[
          ["thu", "Thu", "Tiền vào quỹ"],
          ["chi", "Chi", "Tiền ra khỏi quỹ"],
        ]}
      />
      {direction === "thu" && (
        <Choice<Mode>
          value={mode}
          onChange={setMode}
          options={[
            ["thu_thanh_vien", "Thành viên đóng", "Quỹ tháng, ủng hộ..."],
            ["thu_ngoai", "Thu ngoài", "Tài trợ, số dư..."],
          ]}
        />
      )}

      {mode === "thu_thanh_vien" && <CreateBillForm />}
      {mode === "thu_ngoai" && <FundEntryForm key="thu" direction="thu" />}
      {mode === "chi" && <FundEntryForm key="chi" direction="chi" />}
    </div>
  );
}
