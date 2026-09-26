"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MemberCard } from "@/components/public/member-card";
import type { MemberPublic } from "@/lib/mock-data";
import { applyProfile, FOOT_LABEL, POSITIONS, type MemberProfile, type PreferredFoot } from "@/lib/member-profile";

const toInput = (ddmmyyyy: string | null) => (ddmmyyyy && /^\d{2}\/\d{2}\/\d{4}$/.test(ddmmyyyy) ? ddmmyyyy.split("/").reverse().join("-") : "");
const fromInput = (iso: string) => (iso ? iso.split("-").reverse().join("/") : null);
const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export default function ProfilePage() {
  const [base, setBase] = useState<MemberPublic | null>(null);
  const [form, setForm] = useState<MemberProfile | null>(null);
  const [joinYearOnly, setJoinYearOnly] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/member/profile")
      .then((r) => r.json())
      .then((d: { profile?: MemberProfile; card?: MemberPublic; error?: string }) => {
        if (!d.profile || !d.card) return setError(d.error || "Không tải được hồ sơ");
        setBase(d.card);
        setForm(d.profile);
        setJoinYearOnly(!!d.profile.joinDate && /^\d{4}$/.test(d.profile.joinDate));
      });
  }, []);

  // Thẻ xem trước cập nhật theo từng chữ đang gõ
  const preview = useMemo(() => (base && form ? applyProfile(base, form) : null), [base, form]);

  function set<K extends keyof MemberProfile>(key: K, value: MemberProfile[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error || "Không lưu được");
      setBase(json.card);
      setForm(json.profile);
      setSaved(true);
    } catch {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  }

  if (!form || !preview) {
    return <div className="p-8 text-center text-gray-500">{error || "Đang tải..."}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
      <div className="mx-auto w-full max-w-[260px] space-y-2 md:sticky md:top-20">
        <MemberCard member={preview} />
        <p className="text-center text-xs text-gray-500">Xem trước thẻ cầu thủ trên trang Thành viên</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ cầu thủ</CardTitle>
          <p className="text-sm text-gray-500">
            Tự cập nhật thông tin của bạn. Số áo, chức vụ và thống kê trận/bàn/kiến tạo do ban quản lý cập nhật.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saved && (
              <Alert>
                <AlertDescription>Đã lưu — thẻ cầu thủ trên trang Thành viên đã cập nhật.</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="nickname">Biệt danh</Label>
                <Input id="nickname" value={form.nickname} maxLength={40} onChange={(e) => set("nickname", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Vị trí</Label>
                <select id="position" value={form.position} onChange={(e) => set("position", e.target.value as MemberProfile["position"])} className={selectClass}>
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chân thuận</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(FOOT_LABEL) as PreferredFoot[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("preferredFoot", form.preferredFoot === f ? null : f)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      form.preferredFoot === f ? "border-goda-navy bg-goda-navy text-white" : "border-border bg-white text-goda-navy hover:bg-goda-navy/5"
                    }`}
                  >
                    {FOOT_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input id="birthday" type="date" value={toInput(form.birthday)} onChange={(e) => set("birthday", fromInput(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Ngày gia nhập đội</Label>
                {joinYearOnly ? (
                  <Input
                    id="joinDate"
                    inputMode="numeric"
                    placeholder="Vd: 1994"
                    maxLength={4}
                    value={form.joinDate ?? ""}
                    onChange={(e) => set("joinDate", e.target.value.replace(/\D/g, "") || null)}
                  />
                ) : (
                  <Input id="joinDate" type="date" value={toInput(form.joinDate)} onChange={(e) => set("joinDate", fromInput(e.target.value))} />
                )}
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    className="size-3.5"
                    checked={joinYearOnly}
                    onChange={(e) => {
                      setJoinYearOnly(e.target.checked);
                      set("joinDate", e.target.checked ? (form.joinDate?.slice(-4) ?? null) : null);
                    }}
                  />
                  Chỉ nhớ năm
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hometown">Quê quán</Label>
              <Input id="hometown" placeholder="Vd: Hà Nội" maxLength={60} value={form.hometown ?? ""} onChange={(e) => set("hometown", e.target.value || null)} />
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-goda-navy hover:bg-goda-navy/90">
              {saving ? "Đang lưu..." : "Lưu hồ sơ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
