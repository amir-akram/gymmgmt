export type MembershipStatus = "active" | "expiring_soon" | "expired";

export interface Member {
  id: string;
  name: string;
  phone_number: string;
  image_url: string;
  start_date: string; // ISO date string YYYY-MM-DD
  end_date: string;   // ISO date string YYYY-MM-DD
  plan: "basic" | "standard" | "premium";
  email?: string;
}

export interface MemberFormData {
  name: string;
  phone_number: string;
  image_url: string;
  start_date: string;
  end_date: string;
  plan: "basic" | "standard" | "premium";
  email?: string;
}

export type FilterTab = "all" | "active" | "expiring_soon" | "expired";