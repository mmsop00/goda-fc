"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FlaskConical } from "lucide-react";
import { DetailSheet, Ledger, Members, Overview, Segmented, type Basis, type Detail } from "@/components/finance/report-views";
import { buildSampleReport } from "@/lib/finance/sample-report";
import { formatVnd } from "@/lib/finance/format";
import type { FinanceReport, LedgerRow } from "@/lib/finance/report-core";

type View = "tong-quan" | "so-thu-chi" | "thanh-vien";

export default function FinanceReportPage() {
  const { data: session } = useSession();
  const isChairman = session?.user?.financeRole === "chairman";
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [reloading, setReloading] = useState(false);
  const [view, setView] = useState<View>("tong-quan");
  const [sample, setSample] = useState(false);
  const [basis, setBasis] = useState<Basis>("cash");
  const [stack, setStack] = useState<Detail[]>([]);
  const sampleReport = useMemo(() => (sample ? buildSampleReport() : null), [sample]);

  function fetchReport() {
    return fetch("/api/finance/report")
      .then((r) => r.json())
      .then(setReport)
      .finally(() => setReloading(false));
  }
  useEffect(() => {
    fetchReport();
  }, []);

  const open = useCallback((d: Detail) => setStack((s) => [...s, d]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const close = useCallback(() => setStack([]), []);

  async function remove(r: LedgerRow) {
    if (!confirm(`Xoá "${r.title}" (${formatVnd(r.amount)}) khỏi sổ quỹ?`)) return;
    const res = await fetch(`/api/finance/entries/${r.id}`, { method: "DELETE" });
    if (!res.ok) return alert("Không xoá được, vui lòng thử lại");
    // Giữ nguyên khung cũ (mờ đi) thay vì nháy "Đang tải".
    setReloading(true);
    fetchReport();
  }

  function toggleSample(on: boolean) {
    setSample(on);
    setStack([]);
  }

  if (!report) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  const data = sampleReport ?? report;
  const isEmpty = report.ledger.length === 0 && report.bills.length === 0;

  return (
    <div className={`min-w-0 max-w-5xl mx-auto p-4 sm:p-6 space-y-4 transition-opacity ${reloading ? "opacity-60" : ""}`}>
      {sample ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span className="flex items-center gap-2">
            <FlaskConical className="size-4 shrink-0" />
            <span>
              Đang xem <strong>DỮ LIỆU MẪU</strong> — số liệu bịa để xem thử, không phải tiền thật của CLB.
            </span>
          </span>
          <button type="button" onClick={() => toggleSample(false)} className="rounded-md bg-amber-900 px-3 py-1 text-xs font-medium text-white">
            Về số liệu thật
          </button>
        </div>
      ) : (
        isEmpty && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm text-gray-600 ring-1 ring-black/10">
            <span>Quỹ chưa có số liệu nào. Muốn xem báo cáo trông thế nào khi có dữ liệu?</span>
            <button type="button" onClick={() => toggleSample(true)} className="rounded-md bg-goda-navy px-3 py-1 text-xs font-medium text-white">
              Xem dữ liệu mẫu
            </button>
          </div>
        )
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Segmented<View>
          value={view}
          onChange={setView}
          options={[
            ["tong-quan", "Tổng quan"],
            ["so-thu-chi", "Sổ thu chi"],
            ["thanh-vien", "Thành viên"],
          ]}
        />
        {!sample && !isEmpty && (
          <button type="button" onClick={() => toggleSample(true)} className="flex items-center gap-1 text-xs text-gray-500 underline">
            <FlaskConical className="size-3.5" />
            Xem dữ liệu mẫu
          </button>
        )}
      </div>

      {view !== "thanh-vien" && (
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Cách tính</span>
            <Segmented<Basis>
              value={basis}
              onChange={setBasis}
              options={[
                ["cash", "Theo dòng tiền"],
                ["accrual", "Theo kỳ áp dụng (chuẩn)"],
              ]}
            />
          </div>
          <p className="text-xs text-gray-500">
            {basis === "cash"
              ? "Tính vào tháng tiền thực sự vào/ra quỹ (ngày đóng, ngày chi)."
              : "Tính vào tháng mà khoản đó thuộc về — vd Quỹ tháng 10 đóng muộn tháng 11 vẫn tính cho tháng 10; tiền sân tháng 9 trả đầu tháng 10 vẫn tính cho tháng 9."}
          </p>
        </div>
      )}

      {/* key: đổi thật ↔ mẫu hoặc đổi cách tính thì bộ lọc về mặc định */}
      <div key={`${sample ? "mau" : "that"}-${basis}`}>
        {view === "tong-quan" && <Overview report={data} onOpen={open} basis={basis} />}
        {view === "so-thu-chi" && (
          <Ledger report={data} onOpen={open} basis={basis} onDelete={isChairman && !sample ? remove : undefined} />
        )}
        {view === "thanh-vien" && <Members report={data} onOpen={open} />}
      </div>

      <DetailSheet report={data} stack={stack} onOpen={open} onBack={back} onClose={close} canEdit={isChairman && !sample} onChanged={() => {
        setReloading(true);
        fetchReport();
      }} />
    </div>
  );
}
