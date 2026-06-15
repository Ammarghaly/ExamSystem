import type { GroupDetailsStudent, Student } from "../types/group.types";

export function mapToStudentRow(s: GroupDetailsStudent): Student {
  const name = s?.name || s?.email || "Unknown Student";
  const names = name.trim().split(" ");
  const initials =
    names.length >= 2
      ? names[0][0] + names[names.length - 1][0]
      : name.slice(0, 2);

  return {
    id: s._id,
    studentId: `#${s._id.slice(-8).toUpperCase()}`,
    name: name,
    initials: initials.toUpperCase(),
    avatar: s.avatar || "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png",
    joinDate: s.createdAt
      ? new Date(s.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    status: "Active" as const,
  };
}
