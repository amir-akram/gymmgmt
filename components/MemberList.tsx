"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Member, MemberFormData, FilterTab } from "@/types/member";
import { getMembershipStatus } from "@/lib/utils-gym";
import MemberCard from "./MemberCard";
import { FiUsers, FiCheckCircle, FiAlertTriangle, FiXCircle, FiSearch } from "react-icons/fi";

interface MemberListProps {
  members: Member[];
  onUpdate: (id: string, data: MemberFormData) => void;
  onDelete: (id: string) => void;
}

const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Members", icon: <FiUsers /> },
  { key: "active", label: "Active", icon: <FiCheckCircle /> },
  { key: "expiring_soon", label: "Expiring Soon", icon: <FiAlertTriangle /> },
  { key: "expired", label: "Expired", icon: <FiXCircle /> },
];

const tabActiveStyle: Record<FilterTab, string> = {
  all: "bg-[#d4ff00] text-black",
  active: "bg-[#4ade80] text-black",
  expiring_soon: "bg-[#fb923c] text-black",
  expired: "bg-[#f87171] text-black",
};

export default function MemberList({ members, onUpdate, onDelete }: MemberListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = members.filter((m) => {
    const matchesTab = activeTab === "all" || getMembershipStatus(m) === activeTab;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone_number.includes(search);
    return matchesTab && matchesSearch;
  });

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".member-card-wrapper");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [activeTab, search]);

  const counts = {
    all: members.length,
    active: members.filter((m) => getMembershipStatus(m) === "active").length,
    expiring_soon: members.filter((m) => getMembershipStatus(m) === "expiring_soon").length,
    expired: members.filter((m) => getMembershipStatus(m) === "expired").length,
  };

  return (
    <section>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-['DM_Mono'] text-xs tracking-widest uppercase transition-all duration-200 border ${
              activeTab === key
                ? `${tabActiveStyle[key]} border-transparent shadow-lg`
                : "bg-[#111] border-[#222] text-[#555] hover:text-white hover:border-[#333]"
            }`}
          >
            {icon}
            {label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === key ? "bg-black/20" : "bg-[#1e1e1e] text-[#666]"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2 bg-[#111] border border-[#222] rounded-xl px-3 py-2 min-w-[220px]">
          <FiSearch className="text-[#555] text-sm flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone..."
            className="bg-transparent text-white placeholder:text-[#444] font-['DM_Mono'] text-xs outline-none w-full tracking-wide"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mb-4">
            <FiUsers className="text-[#333] text-2xl" />
          </div>
          <p className="font-['Bebas_Neue'] text-2xl text-[#333] tracking-widest">No Members Found</p>
          <p className="font-['DM_Mono'] text-xs text-[#444] mt-1">Try changing your filter or search term</p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((member) => (
            <div key={member.id} className="member-card-wrapper">
              <MemberCard member={member} onUpdate={onUpdate} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}