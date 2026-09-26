// Danh sách thẻ cầu thủ công khai = dữ liệu mặc định + hồ sơ thành viên tự sửa.

import { prisma } from "@/lib/prisma";
import { MOCK_MEMBERS, type MemberPublic } from "@/lib/mock-data";
import { applyProfile, type StoredProfile } from "@/lib/member-profile";

const PROFILE_SELECT = {
  name: true,
  nickname: true,
  position: true,
  preferredFoot: true,
  birthday: true,
  joinDate: true,
  hometown: true,
} as const;

/** Hồ sơ đã tự sửa, theo tên. Lỗi DB thì trả rỗng — trang công khai vẫn hiện dữ liệu mặc định. */
export async function getEditedProfiles(): Promise<Map<string, StoredProfile>> {
  try {
    const rows = await prisma.member.findMany({ where: { profileUpdatedAt: { not: null } }, select: PROFILE_SELECT });
    return new Map(rows.map((r) => [r.name, r]));
  } catch (e) {
    console.error("getEditedProfiles error (dùng dữ liệu mặc định):", e);
    return new Map();
  }
}

export async function getPublicMembers(): Promise<MemberPublic[]> {
  const edited = await getEditedProfiles();
  return MOCK_MEMBERS.map((m) => applyProfile(m, edited.get(m.name)));
}
