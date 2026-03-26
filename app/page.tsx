"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Member, MemberFormData } from "@/types/member";
import { getMembershipStatus } from "@/lib/utils-gym";
import { dummyMembers } from "@/data/members";
import MemberList from "@/components/MemberList";
import AddMemberModal from "@/components/AddMemberModal";
import { Button } from "@/components/ui/button";
import {
  FiPlus,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiZap,
} from "react-icons/fi";
import { FaDumbbell } from "react-icons/fa";
import { MdOutlineFitnessCenter } from "react-icons/md";

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>(dummyMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Derived stats
  const activeCount = members.filter((m) => getMembershipStatus(m) === "active").length;
  const expiringSoonCount = members.filter((m) => getMembershipStatus(m) === "expiring_soon").length;
  const expiredCount = members.filter((m) => getMembershipStatus(m) === "expired").length;
  const retentionRate = members.length > 0 ? Math.round((activeCount / members.length) * 100) : 0;

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Header
    tl.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });

    // Hero text chars
    if (heroRef.current) {
      tl.fromTo(
        heroRef.current.querySelectorAll(".hero-word"),
        { y: 60, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.7 },
        "-=0.3"
      );
      tl.fromTo(
        heroRef.current.querySelectorAll(".hero-sub"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 },
        "-=0.3"
      );
    }

    // Stats cards
    if (statsRef.current) {
      tl.fromTo(
        statsRef.current.querySelectorAll(".stat-card"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
        "-=0.2"
      );
    }

    // Animated dumbbell icon pulse
    gsap.to(".logo-icon", {
      rotate: 10,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const handleAddMember = (data: MemberFormData) => {
    const newMember: Member = {
      ...data,
      id: `m${Date.now()}`,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const handleUpdateMember = (id: string, data: MemberFormData) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const stats = [
    {
      label: "Total Members",
      value: members.length,
      icon: <FiUsers className="text-xl" />,
      color: "text-white",
      accent: "#d4ff00",
      bg: "bg-[#d4ff0010]",
      border: "border-[#d4ff0022]",
    },
    {
      label: "Active",
      value: activeCount,
      icon: <FiActivity className="text-xl" />,
      color: "text-[#4ade80]",
      accent: "#4ade80",
      bg: "bg-[#4ade8010]",
      border: "border-[#4ade8022]",
    },
    {
      label: "Expiring Soon",
      value: expiringSoonCount,
      icon: <FiAlertTriangle className="text-xl" />,
      color: "text-[#fb923c]",
      accent: "#fb923c",
      bg: "bg-[#fb923c10]",
      border: "border-[#fb923c22]",
    },
    {
      label: "Retention Rate",
      value: `${retentionRate}%`,
      icon: <FiTrendingUp className="text-xl" />,
      color: "text-[#60a5fa]",
      accent: "#60a5fa",
      bg: "bg-[#60a5fa10]",
      border: "border-[#60a5fa22]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#d4ff00 1px, transparent 1px), linear-gradient(90deg, #d4ff00 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#d4ff00] opacity-[0.04] blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4ff00] rounded-xl flex items-center justify-center">
              <FaDumbbell className="logo-icon text-black text-xl" />
            </div>
            <div>
              <span className="font-['Bebas_Neue'] text-2xl tracking-[0.15em] text-white">
                Iron<span className="text-[#d4ff00]">Pulse</span>
              </span>
              <p className="font-['DM_Mono'] text-[10px] text-[#444] tracking-widest uppercase leading-none">
                Gym Management
              </p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-6">
            {["Dashboard", "Members", "Plans", "Reports"].map((item, i) => (
              <button
                key={item}
                className={`font-['DM_Mono'] text-xs tracking-widest uppercase transition-colors duration-200 ${
                  i === 0 ? "text-[#d4ff00]" : "text-[#555] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Add Member CTA */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#d4ff00] text-black hover:bg-[#bfea00] font-['Bebas_Neue'] tracking-widest text-lg px-5 h-10 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <FiPlus className="text-base" /> Add Member
          </Button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Hero Section */}
        <div ref={heroRef} className="mb-12 overflow-hidden">
          <div className="flex items-end gap-4 mb-3 perspective-[800px]">
            {["Iron", "Pulse", "—"].map((word, i) => (
              <span
                key={i}
                className={`hero-word inline-block font-['Bebas_Neue'] leading-none tracking-tight ${
                  i === 1 ? "text-[#d4ff00]" : i === 2 ? "text-[#2a2a2a] text-5xl" : "text-white"
                } text-6xl md:text-8xl`}
              >
                {word}
              </span>
            ))}
            <MdOutlineFitnessCenter className="hero-word text-[#1e1e1e] text-6xl md:text-7xl mb-1" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="hero-sub font-['DM_Mono'] text-[#555] text-sm tracking-widest uppercase">
              Manage your gym members
            </p>
            <div className="hero-sub h-px flex-1 max-w-xs bg-[#1e1e1e]" />
            <span className="hero-sub font-['DM_Mono'] text-[10px] text-[#333] tracking-widest uppercase">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon, color, bg, border, accent }) => (
            <div
              key={label}
              className={`stat-card relative p-5 rounded-2xl border ${border} ${bg} overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Decorative corner */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: accent }}
              />
              <div className={`flex items-center gap-2 ${color} mb-3`}>
                {icon}
                <span className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#555]">
                  {label}
                </span>
              </div>
              <div className={`font-['Bebas_Neue'] text-4xl tracking-wider ${color}`}>{value}</div>
              {/* Progress bar for active/expired */}
              {label === "Active" && members.length > 0 && (
                <div className="mt-3 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4ade80] rounded-full transition-all duration-1000"
                    style={{ width: `${(activeCount / members.length) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alert banner if expiring members */}
        {expiringSoonCount > 0 && (
          <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-[#fb923c10] border border-[#fb923c33]">
            <FiZap className="text-[#fb923c] text-lg flex-shrink-0" />
            <p className="font-['DM_Mono'] text-xs text-[#fb923c] tracking-wide">
              <strong>{expiringSoonCount} member{expiringSoonCount > 1 ? "s" : ""}</strong> have memberships expiring within the next 7 days.
              Consider reaching out via WhatsApp or SMS.
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-widest">Members</h2>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="font-['DM_Mono'] text-xs text-[#444] tracking-widest uppercase">
            {members.length} total
          </span>
        </div>

        {/* Member List */}
        <MemberList members={members} onUpdate={handleUpdateMember} onDelete={handleDeleteMember} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#111] mt-16 py-8">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaDumbbell className="text-[#d4ff00] text-lg" />
            <span className="font-['Bebas_Neue'] text-lg tracking-widest text-[#333]">
              IronPulse
            </span>
          </div>
          <p className="font-['DM_Mono'] text-[10px] text-[#333] tracking-widest uppercase">
            Built with Next.js 16 · Tailwind CSS 4.2 · shadcn/ui · GSAP
          </p>
          <p className="font-['DM_Mono'] text-[10px] text-[#333] tracking-widest">
            © {new Date().getFullYear()} IronPulse
          </p>
        </div>
      </footer>

      {/* Add Member Modal */}
      <AddMemberModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddMember} />
    </div>
  );
}