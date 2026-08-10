"use client";

// ═══════════════════════════════════════
// GODA FC — Admin: Quản lý trận đấu (CRUD)
// ═══════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";

// ── Types ──

interface MatchGoal {
  id?: string;
  player: string;
  minute: number;
  assist?: string;
  side: "GODA" | "opponent";
}

interface MatchCard {
  id?: string;
  player: string;
  minute: number;
  type: "yellow" | "red";
  side: "GODA" | "opponent";
}

interface Match {
  id: string;
  season: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  tournament?: string | null;
  isHome: boolean;
  opponent: string;
  opponentScore: number;
  godaScore: number;
  godaLineup: { name: string; number: number; position: string }[];
  opponentLineup: { name: string; number: number; position: string }[];
  mvp?: string | null;
  imageUrl: string;
  videoUrl?: string | null;
  googleMapsUrl?: string | null;
  goals: MatchGoal[];
  cards: MatchCard[];
}

const EMPTY_FORM: Omit<Match, "id" | "goals" | "cards"> = {
  season: "2026",
  date: "",
  time: "16:00",
  venue: "",
  type: "Giao hữu",
  tournament: "",
  isHome: false,
  opponent: "",
  opponentScore: 0,
  godaScore: 0,
  godaLineup: [],
  opponentLineup: [],
  mvp: "",
  imageUrl: "",
  videoUrl: "",
  googleMapsUrl: "",
};

// ── Helpers ──

function getResultLabel(goda: number, opp: number) {
  if (goda > opp) return "Thắng";
  if (goda < opp) return "Thua";
  return "Hòa";
}

function getResultColor(goda: number, opp: number) {
  if (goda > opp) return "bg-goda-green text-white border-0";
  if (goda < opp) return "bg-red-500 text-white border-0";
  return "bg-goda-yellow text-goda-navy border-0";
}

function sortByDateDesc(a: Match, b: Match) {
  const da = a.date.split("/").reverse().join("");
  const db = b.date.split("/").reverse().join("");
  return db.localeCompare(da);
}

// ── Page ──

export default function AdminMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Fetch ──

  const fetchMatches = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/matches");
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) throw new Error();
      const data: Match[] = await res.json();
      setMatches(data.sort(sortByDateDesc));
    } catch (e) {
      console.error("fetchMatches error:", e);
      setError("Không thể tải danh sách trận đấu.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // ── Open form ──

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(m: Match) {
    setEditingId(m.id);
    setForm({
      season: m.season,
      date: m.date,
      time: m.time,
      venue: m.venue,
      type: m.type,
      tournament: m.tournament || "",
      isHome: m.isHome,
      opponent: m.opponent,
      opponentScore: m.opponentScore,
      godaScore: m.godaScore,
      godaLineup: m.godaLineup,
      opponentLineup: m.opponentLineup,
      mvp: m.mvp || "",
      imageUrl: m.imageUrl,
      videoUrl: m.videoUrl || "",
      googleMapsUrl: m.googleMapsUrl || "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  // ── Save ──

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tournament: form.tournament || null,
        mvp: form.mvp || null,
        videoUrl: form.videoUrl || null,
        googleMapsUrl: form.googleMapsUrl || null,
      };

      const url = editingId
        ? `/api/matches/${editingId}`
        : "/api/matches";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lỗi lưu");
      }

      closeModal();
      fetchMatches();
    } catch (e) {
      console.error("handleSave error:", e);
      alert(e instanceof Error ? e.message : "Lỗi khi lưu trận đấu");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──

  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xóa trận đấu này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/matches/${id}`, { method: "DELETE" });
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) throw new Error();
      fetchMatches();
    } catch (e) {
      console.error("handleDelete error:", e);
      alert("Không thể xóa trận đấu.");
    } finally {
      setDeletingId(null);
    }
  }

  // ── Form field helper ──

  function setField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ── Render ──

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-goda-navy">
            ⚽ Quản lý trận đấu
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {matches.length} trận đấu
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-goda-navy hover:bg-goda-navy/90">
          <Plus className="size-4" />
          Thêm trận đấu
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 text-goda-navy animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-4">
          <CardContent className="py-4 text-red-600 text-sm">{error}</CardContent>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-goda-soft-gray/50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-2">Ngày</div>
            <div className="col-span-2">Đối thủ</div>
            <div className="col-span-2">Tỉ số</div>
            <div className="col-span-1">KQ</div>
            <div className="col-span-2">Loại</div>
            <div className="col-span-2">Sân</div>
            <div className="col-span-1 text-right"></div>
          </div>

          {/* Rows */}
          {matches.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-1">📭 Chưa có trận đấu nào</p>
              <p className="text-sm">Nhấn &ldquo;Thêm trận đấu&rdquo; để bắt đầu.</p>
            </div>
          ) : (
            matches.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 border-b last:border-0 hover:bg-goda-soft-gray/30 transition-colors items-center"
              >
                {/* Mobile card layout */}
                <div className="md:hidden space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="size-3" /> {m.date}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="size-3" /> {m.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-goda-navy">
                      {m.isHome ? "GODA FC" : m.opponent}{" "}
                      <span className="text-gray-400">vs</span>{" "}
                      {m.isHome ? m.opponent : "GODA FC"}
                    </p>
                    <Badge className={getResultColor(m.godaScore, m.opponentScore)}>
                      {getResultLabel(m.godaScore, m.opponentScore)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{m.type}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" /> {m.venue}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                      <Pencil className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Desktop row */}
                <div className="hidden md:flex col-span-2 items-center gap-1.5 text-sm text-gray-700">
                  <Calendar className="size-3 text-gray-400 shrink-0" />
                  <span>{m.date}</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="size-3 text-gray-400 shrink-0" />
                  <span>{m.time}</span>
                </div>
                <div className="hidden md:block col-span-2 text-sm font-medium text-goda-navy">
                  {m.isHome ? "GODA FC" : m.opponent}{" "}
                  <span className="text-gray-400">vs</span>{" "}
                  {m.isHome ? m.opponent : "GODA FC"}
                </div>
                <div className="hidden md:block col-span-2 text-sm">
                  <span className="font-bold text-goda-navy">{m.godaScore}</span>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-gray-500">{m.opponentScore}</span>
                </div>
                <div className="hidden md:block col-span-1">
                  <Badge className={`text-xs ${getResultColor(m.godaScore, m.opponentScore)}`}>
                    {getResultLabel(m.godaScore, m.opponentScore)}
                  </Badge>
                </div>
                <div className="hidden md:block col-span-2 text-sm text-gray-600">
                  {m.type}
                  {m.tournament && (
                    <span className="text-xs text-gray-400 ml-1">({m.tournament})</span>
                  )}
                </div>
                <div className="hidden md:flex col-span-2 items-center gap-1 text-sm text-gray-500">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate">{m.venue}</span>
                </div>
                <div className="hidden md:flex col-span-1 gap-1 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(m)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Modal Form ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="font-display font-bold text-lg text-goda-navy">
                {editingId ? "✏️ Sửa trận đấu" : "➕ Thêm trận đấu mới"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {/* Row 1: date + time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Ngày *</Label>
                  <Input
                    id="date"
                    placeholder="DD/MM/YYYY"
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time">Giờ</Label>
                  <Input
                    id="time"
                    placeholder="16:00"
                    value={form.time}
                    onChange={(e) => setField("time", e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: opponent + venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="opponent">Đối thủ *</Label>
                  <Input
                    id="opponent"
                    placeholder="Tên đội đối thủ"
                    value={form.opponent}
                    onChange={(e) => setField("opponent", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="venue">Sân *</Label>
                  <Input
                    id="venue"
                    placeholder="Địa điểm thi đấu"
                    value={form.venue}
                    onChange={(e) => setField("venue", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 3: type + tournament + isHome */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Loại trận</Label>
                  <select
                    id="type"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                  >
                    <option>Giao hữu</option>
                    <option>Giải đấu</option>
                    <option>Cúp</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tournament">Giải đấu</Label>
                  <Input
                    id="tournament"
                    placeholder="Tên giải (nếu có)"
                    value={form.tournament || ""}
                    onChange={(e) => setField("tournament", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isHome}
                      onChange={(e) => setField("isHome", e.target.checked)}
                      className="rounded"
                    />
                    Sân nhà
                  </label>
                </div>
              </div>

              {/* Row 4: scores + MVP */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="godaScore">Bàn GODA</Label>
                  <Input
                    id="godaScore"
                    type="number"
                    min={0}
                    value={form.godaScore}
                    onChange={(e) => setField("godaScore", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="opponentScore">Bàn đối thủ</Label>
                  <Input
                    id="opponentScore"
                    type="number"
                    min={0}
                    value={form.opponentScore}
                    onChange={(e) => setField("opponentScore", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mvp">MVP</Label>
                  <Input
                    id="mvp"
                    placeholder="Cầu thủ xuất sắc nhất"
                    value={form.mvp || ""}
                    onChange={(e) => setField("mvp", e.target.value)}
                  />
                </div>
              </div>

              {/* Row 5: season + Google Maps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="season">Mùa giải</Label>
                  <Input
                    id="season"
                    value={form.season}
                    onChange={(e) => setField("season", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                  <Input
                    id="googleMapsUrl"
                    placeholder="https://maps.app.goo.gl/..."
                    value={form.googleMapsUrl || ""}
                    onChange={(e) => setField("googleMapsUrl", e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-goda-navy hover:bg-goda-navy/90 gap-2"
                  disabled={saving}
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {editingId ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
