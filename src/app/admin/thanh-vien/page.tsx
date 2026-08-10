"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

interface Member {
  id: string;
  name: string;
  nickname: string;
  position: string;
  number: number;
  matches: number;
  goals: number;
  assists: number;
  mvp: number;
  birthday: string;
  joinYear: number | null;
  status: string;
}

const POSITIONS = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];
const STATUSES = ["Đang thi đấu", "Đội trưởng", "Đội phó", "Chấn thương", "Tạm nghỉ"];

const emptyMember = (): Partial<Member> => ({
  name: "",
  nickname: "",
  position: "Tiền vệ",
  number: 0,
  matches: 0,
  goals: 0,
  assists: 0,
  mvp: 0,
  birthday: "",
  joinYear: new Date().getFullYear(),
  status: "Đang thi đấu",
});

// Sort: Đội trưởng → Đội phó → by joinYear (oldest first)
function sortMembers(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const aCapt = a.status === "Đội trưởng" ? 0 : a.status === "Đội phó" ? 1 : 2;
    const bCapt = b.status === "Đội trưởng" ? 0 : b.status === "Đội phó" ? 1 : 2;
    if (aCapt !== bCapt) return aCapt - bCapt;
    if (a.joinYear && b.joinYear) return a.joinYear - b.joinYear;
    return 0;
  });
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/members");
    const data = await res.json();
    if (Array.isArray(data)) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openCreate = () => {
    setEditing(emptyMember());
    setDialogOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing({ ...m });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    setSaving(true);
    try {
      if (editing.id) {
        await fetch(`/api/members/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        });
      } else {
        await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        });
      }
      setDialogOpen(false);
      setEditing(null);
      await fetchMembers();
    } catch (e) {
      console.error("Save failed", e);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa thành viên này? Hành động không thể hoàn tác.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/members/${id}`, { method: "DELETE" });
      await fetchMembers();
    } catch (e) {
      console.error("Delete failed", e);
    }
    setDeleting(null);
  };

  const sorted = sortMembers(members);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-goda-navy">
            👥 Quản lý thành viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} thành viên
          </p>
        </div>
        <Button onClick={openCreate} className="bg-goda-navy hover:bg-goda-navy/90">
          <Plus className="size-4 mr-2" />
          Thêm thành viên
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-goda-navy" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-goda-soft-gray/50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-goda-navy">Tên</th>
                    <th className="text-left px-4 py-3 font-medium text-goda-navy">Biệt danh</th>
                    <th className="text-left px-4 py-3 font-medium text-goda-navy">Vị trí</th>
                    <th className="text-center px-4 py-3 font-medium text-goda-navy">Số áo</th>
                    <th className="text-center px-4 py-3 font-medium text-goda-navy">Trận</th>
                    <th className="text-center px-4 py-3 font-medium text-goda-navy">Bàn</th>
                    <th className="text-left px-4 py-3 font-medium text-goda-navy">Trạng thái</th>
                    <th className="text-right px-4 py-3 font-medium text-goda-navy">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-goda-soft-gray/30">
                      <td className="px-4 py-3 font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-gray-500">{m.nickname || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{m.position}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-goda-yellow">
                        {m.number > 0 ? `#${m.number}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">{m.matches}</td>
                      <td className="px-4 py-3 text-center">{m.goals}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs border-0 ${
                          m.status === "Đội trưởng" ? "bg-goda-yellow text-goda-navy" :
                          m.status === "Đội phó" ? "bg-goda-navy text-white" :
                          "bg-goda-green/10 text-goda-green"
                        }`}>
                          {m.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => openEdit(m)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(m.id)}
                            disabled={deleting === m.id}
                          >
                            {deleting === m.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {dialogOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDialogOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-display font-bold text-goda-navy">
                {editing.id ? "✏️ Sửa thành viên" : "➕ Thêm thành viên mới"}
              </h2>
              <button onClick={() => setDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tên *</Label>
                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <Label>Biệt danh</Label>
                <Input value={editing.nickname || ""} onChange={(e) => setEditing({ ...editing, nickname: e.target.value })} placeholder="Nickname" />
              </div>
              <div>
                <Label>Số áo</Label>
                <Input type="number" value={editing.number || 0} onChange={(e) => setEditing({ ...editing, number: +e.target.value })} />
              </div>
              <div>
                <Label>Vị trí</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editing.position || "Tiền vệ"}
                  onChange={(e) => setEditing({ ...editing, position: e.target.value })}
                >
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <Label>Trạng thái</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editing.status || "Đang thi đấu"}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label>Ngày sinh</Label>
                <Input value={editing.birthday || ""} onChange={(e) => setEditing({ ...editing, birthday: e.target.value })} placeholder="DD/MM" />
              </div>
              <div>
                <Label>Năm tham gia</Label>
                <Input type="number" value={editing.joinYear || ""} onChange={(e) => setEditing({ ...editing, joinYear: +e.target.value || null })} />
              </div>
              <div>
                <Label>Trận</Label>
                <Input type="number" value={editing.matches || 0} onChange={(e) => setEditing({ ...editing, matches: +e.target.value })} />
              </div>
              <div>
                <Label>Bàn</Label>
                <Input type="number" value={editing.goals || 0} onChange={(e) => setEditing({ ...editing, goals: +e.target.value })} />
              </div>
              <div>
                <Label>Kiến tạo</Label>
                <Input type="number" value={editing.assists || 0} onChange={(e) => setEditing({ ...editing, assists: +e.target.value })} />
              </div>
              <div>
                <Label>MVP</Label>
                <Input type="number" value={editing.mvp || 0} onChange={(e) => setEditing({ ...editing, mvp: +e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSave} disabled={saving || !editing.name} className="bg-goda-navy hover:bg-goda-navy/90">
                {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {editing.id ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
