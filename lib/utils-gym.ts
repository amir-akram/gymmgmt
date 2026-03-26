import { Member, MembershipStatus } from "@/types/member";

export function getMembershipStatus(member: Member): MembershipStatus {
  const today = new Date();
  const end = new Date(member.end_date);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "expiring_soon";
  return "active";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDaysRemaining(endDate: string): number {
  const today = new Date();
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}