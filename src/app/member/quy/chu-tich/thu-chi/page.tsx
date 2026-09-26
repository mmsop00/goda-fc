"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBillForm } from "@/components/finance/create-bill-form";
import { FundEntryForm } from "@/components/finance/fund-entry-form";
import { AutoMonthlyCard } from "@/components/finance/auto-monthly-card";
import { formatPeriod, formatVnd } from "@/lib/finance/format";
import type { Direction } from "@/lib/finance/categories";

type Mode = "thu_thanh_vien" | "thu_ngoai" | "chi";

interface BillRow {
  id: string;
  title: string;
  period: string | null;
  createdAt: string;
  amountPerMember: number;
  _count: { items: number };
}

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

/** Danh sách khoản thu đã tạo, bấm "Sửa" để mở form sửa. */
function BillList({ onEdit, refreshKey }: { onEdit: (id: string) => void; refreshKey: number }) {
  const [bills, setBills] = useState<BillRow[] | null>(null);
  useEffect(() => {
    fetch("/api/finance/bills")
      .then((r) => r.json())
      .then((d) => setBills(Array.isArray(d) ? d : []));
  }, [refreshKey]);

  if (!bills || bills.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Khoản thu đã tạo</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="divide-y divide-border/60">
          {bills.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onEdit(b.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-goda-navy/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">
                    Kỳ {formatPeriod(b.period ?? b.createdAt.slice(0, 7))} · {b._count.items} người · {formatVnd(b.amountPerMember)}/người
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-goda-navy">
                  <Pencil className="size-4" />
                  Sửa
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ThuChiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billParam = searchParams.get("bill");
  const entryParam = searchParams.get("entry");

  const [mode, setMode] = useState<Mode>(entryParam ? "chi" : "thu_thanh_vien");
  const [editBillId, setEditBillId] = useState<string | null>(billParam);
  const [editEntryId, setEditEntryId] = useState<string | null>(entryParam);
  const [billsRefresh, setBillsRefresh] = useState(0);
  const [entryResolved, setEntryResolved] = useState(!entryParam);
  const direction = mode === "chi" ? "chi" : "thu";

  // Mở từ nút "Sửa" trong sổ thu chi: cần biết dòng đó là thu hay chi để chọn đúng tab
  useEffect(() => {
    if (!entryParam) return;
    fetch(`/api/finance/entries/${entryParam}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((e: { direction: Direction } | null) => {
        if (e) setMode(e.direction === "chi" ? "chi" : "thu_ngoai");
        setEntryResolved(true);
      });
  }, [entryParam]);

  function changeMode(m: Mode) {
    setMode(m);
    setEditBillId(null);
    setEditEntryId(null);
    if (billParam || entryParam) router.replace("/member/quy/chu-tich/thu-chi");
  }

  function finishBillEdit() {
    setEditBillId(null);
    setBillsRefresh((n) => n + 1);
    if (billParam) router.replace("/member/quy/chu-tich/thu-chi");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!entryResolved) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
      <Choice<"thu" | "chi">
        value={direction}
        onChange={(d) => changeMode(d === "chi" ? "chi" : "thu_thanh_vien")}
        options={[
          ["thu", "Thu", "Tiền vào quỹ"],
          ["chi", "Chi", "Tiền ra khỏi quỹ"],
        ]}
      />
      {direction === "thu" && (
        <Choice<Mode>
          value={mode}
          onChange={changeMode}
          options={[
            ["thu_thanh_vien", "Thành viên đóng", "Quỹ tháng, ủng hộ..."],
            ["thu_ngoai", "Thu ngoài", "Tài trợ, số dư..."],
          ]}
        />
      )}

      {mode === "thu_thanh_vien" && (
        <>
          {!editBillId && <AutoMonthlyCard />}
          <CreateBillForm
            key={editBillId ?? "moi"}
            editId={editBillId ?? undefined}
            onDone={editBillId ? finishBillEdit : undefined}
          />
          <BillList
            refreshKey={billsRefresh}
            onEdit={(id) => {
              setEditBillId(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
      {mode === "thu_ngoai" && <FundEntryForm key={`thu-${editEntryId}`} direction="thu" editId={editEntryId ?? undefined} />}
      {mode === "chi" && <FundEntryForm key={`chi-${editEntryId}`} direction="chi" editId={editEntryId ?? undefined} />}
    </div>
  );
}

export default function ThuChiPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải...</div>}>
      <ThuChiContent />
    </Suspense>
  );
}
