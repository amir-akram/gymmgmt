"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { getMembershipStatus, formatDate, getDaysRemaining } from "@/lib/utils-gym";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FiEdit2, FiTrash2, FiCalendar, FiPhone, FiClock, FiStar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineSms } from "react-icons/md";
import { Member, MemberFormData } from "@/types/member";
import AddMemberModal from "./AddMemberModal";

interface MemberCardProps {
  member: Member;
  onUpdate: (id: string, data: MemberFormData) => void;
  onDelete: (id: string) => void;
}

const planColors: Record<string, string> = {
  basic: "text-[#aaa] border-[#333]",
  standard: "text-[#60a5fa] border-[#60a5fa33]",
  premium: "text-[#d4ff00] border-[#d4ff0033]",
};

const planBg: Record<string, string> = {
  basic: "bg-[#111111]",
  standard: "bg-[#0e1117]",
  premium: "bg-[#0e110a]",
};

const statusConfig = {
  active: { label: "Active", dot: "bg-[#4ade80]", text: "text-[#4ade80]", stripe: "bg-[#4ade80]" },
  expiring_soon: { label: "Expiring Soon", dot: "bg-[#fb923c]", text: "text-[#fb923c]", stripe: "bg-[#fb923c]" },
  expired: { label: "Expired", dot: "bg-[#f87171]", text: "text-[#f87171]", stripe: "bg-[#f87171]" },
};

export default function MemberCard({ member, onUpdate, onDelete }: MemberCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const status = getMembershipStatus(member);
  const daysLeft = getDaysRemaining(member.end_date);
  const { label, dot, text, stripe } = statusConfig[status];

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -4, scale: 1.012, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" });
  };

  const handleDelete = () => {
    gsap.to(cardRef.current, {
      scale: 0.9, opacity: 0, duration: 0.35, ease: "power2.in",
      onComplete: () => onDelete(member.id),
    });
  };

  const whatsappHref = `https://wa.me/${member.phone_number.replace(/\D/g, "")}`;
  const smsHref = `sms:${member.phone_number.replace(/\D/g, "")}`;

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-2xl border border-[#222] ${planBg[member.plan]} overflow-hidden cursor-default transition-shadow duration-300 hover:shadow-[0_0_40px_#d4ff0015]`}
      >
        <div className={`h-0.5 w-full ${stripe}`} />
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#2a2a2a] bg-[#1a1a1a]">
                {member.image_url ? (
                  <Image src={member.image_url} alt={member.name} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#d4ff00] font-['Bebas_Neue'] text-2xl">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#111] ${dot}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Bebas_Neue'] text-xl tracking-wider text-white truncate leading-tight">{member.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FiPhone className="text-[#555] text-xs flex-shrink-0" />
                <span className="font-['DM_Mono'] text-[#666] text-xs truncate">{member.phone_number}</span>
              </div>
            </div>
            <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg border text-[10px] font-['DM_Mono'] tracking-widest uppercase font-bold ${planColors[member.plan]}`}>
              <FiStar className="inline mr-1 text-[9px]" />{member.plan}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 mb-4">
            {[{ label: "Start", date: member.start_date }, { label: "Expires", date: member.end_date }].map(({ label: lbl, date }) => (
              <div key={lbl} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#555]">
                  <FiCalendar className="text-xs" />
                  <span className="font-['DM_Mono'] text-xs uppercase tracking-wider">{lbl}</span>
                </div>
                <span className="font-['DM_Mono'] text-xs text-[#aaa]">{formatDate(date)}</span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <FiClock className={`text-sm ${text}`} />
              <span className={`font-['DM_Mono'] text-xs font-bold tracking-widest uppercase ${text}`}>{label}</span>
            </div>
            <span className={`font-['DM_Mono'] text-xs ${text}`}>
              {daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d ago`}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] text-[#25D366] hover:bg-[#25D36620] hover:border-[#25D366] transition-all duration-200">
              <FaWhatsapp className="text-base" />
              <span className="font-['DM_Mono'] text-[10px] tracking-widest uppercase">WhatsApp</span>
            </a>
            <a href={smsHref}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] text-[#60a5fa] hover:bg-[#60a5fa20] hover:border-[#60a5fa] transition-all duration-200">
              <MdOutlineSms className="text-base" />
              <span className="font-['DM_Mono'] text-[10px] tracking-widest uppercase">SMS</span>
            </a>
            <div className="w-px h-6 bg-[#222]" />
            <Button size="icon" variant="ghost" onClick={() => setShowEditModal(true)}
              className="w-9 h-9 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] text-[#666] hover:text-[#d4ff00] hover:border-[#d4ff0044] hover:bg-[#d4ff0010] transition-all duration-200">
              <FiEdit2 className="text-sm" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setShowDeleteDialog(true)}
              className="w-9 h-9 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] text-[#666] hover:text-[#f87171] hover:border-[#f8717144] hover:bg-[#f8717110] transition-all duration-200">
              <FiTrash2 className="text-sm" />
            </Button>
          </div>
        </div>
      </div>

      <AddMemberModal open={showEditModal} onClose={() => setShowEditModal(false)} onAdd={(data) => onUpdate(member.id, data)} initialData={member} mode="edit" />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#111] border border-[#2a2a2a] rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Bebas_Neue'] text-2xl text-white tracking-wider">Remove Member?</AlertDialogTitle>
            <AlertDialogDescription className="font-['DM_Mono'] text-[#666] text-xs leading-relaxed">
              Permanently remove <span className="text-[#d4ff00]">{member.name}</span> from the system. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="flex-1 bg-transparent border-[#2a2a2a] text-[#666] hover:bg-[#1a1a1a] hover:text-white font-['DM_Mono'] text-xs tracking-widest rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="flex-1 bg-[#f87171] hover:bg-[#ef4444] text-black font-['Bebas_Neue'] tracking-widest text-lg rounded-xl">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}