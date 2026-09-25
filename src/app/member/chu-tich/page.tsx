"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVnd } from "@/lib/finance/format";

interface MemberBreakdown {
  memberId: string;
  name: string;
  chuaDong: number;
  choDuyet: number;
  daDong: number;
}

interface SummaryResponse {
  totalFund: number;
  breakdown: MemberBreakdown[];
}

export default function ChairmanOverviewPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    fetch("/api/finance/summary")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
  }

  const totalChuaDong = data.breakdown.reduce((s, m) => s + m.chuaDong, 0);
  const totalChoDuyet = data.breakdown.reduce((s, m) => s + m.choDuyet, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Tổng quỹ đã xác nhận</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-goda-navy">
            {formatVnd(data.totalFund)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Tổng đang chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-amber-600">
            {formatVnd(totalChoDuyet)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-gray-500">Tổng chưa đóng</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-red-600">
            {formatVnd(totalChuaDong)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết từng thành viên</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-border">
                <th className="py-2 pr-3">Thành viên</th>
                <th className="py-2 px-3 text-right">Chưa đóng</th>
                <th className="py-2 px-3 text-right">Chờ duyệt</th>
                <th className="py-2 pl-3 text-right">Đã đóng</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((m) => (
                <tr key={m.memberId} className="border-b border-border/50">
                  <td className="py-2 pr-3 font-medium">{m.name}</td>
                  <td className="py-2 px-3 text-right text-red-600">
                    {m.chuaDong > 0 ? formatVnd(m.chuaDong) : "—"}
                  </td>
                  <td className="py-2 px-3 text-right text-amber-600">
                    {m.choDuyet > 0 ? formatVnd(m.choDuyet) : "—"}
                  </td>
                  <td className="py-2 pl-3 text-right text-green-600">
                    {m.daDong > 0 ? formatVnd(m.daDong) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
