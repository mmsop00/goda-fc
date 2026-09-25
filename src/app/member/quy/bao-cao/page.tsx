"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Ledger, Members, Overview, Segmented } from "@/components/finance/report-views";
import type { FinanceReport } from "@/lib/finance/report";

type View = "tong-quan" | "so-thu-chi" | "thanh-vien";

export default function FinanceReportPage() {
  const { data: session } = useSession();
  const isChairman = session?.user?.financeRole === "chairman";
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [reloading, setReloading] = useState(false);
  const [view, setView] = useState<View>("tong-quan");

  function fetchReport() {
    return fetch("/api/finance/report")
      .then((r) => r.json())
      .then(setReport)
      .finally(() => setReloading(false));
  }
  useEffect(() => {
    fetchReport();
  }, []);

  // Tải lại sau khi xoá: giữ nguyên khung cũ (mờ đi) thay vì nháy "Đang tải".
  function reload() {
    setReloading(true);
    fetchReport();
  }

  if (!report) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className={`min-w-0 max-w-5xl mx-auto p-4 sm:p-6 space-y-4 transition-opacity ${reloading ? "opacity-60" : ""}`}>
      <Segmented<View>
        value={view}
        onChange={setView}
        options={[
          ["tong-quan", "Tổng quan"],
          ["so-thu-chi", "Sổ thu chi"],
          ["thanh-vien", "Thành viên"],
        ]}
      />
      {view === "tong-quan" && <Overview report={report} />}
      {view === "so-thu-chi" && <Ledger report={report} isChairman={isChairman} onDeleted={reload} />}
      {view === "thanh-vien" && <Members report={report} />}
    </div>
  );
}
