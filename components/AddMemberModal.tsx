"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiUser, FiPhone, FiMail, FiCalendar, FiImage, FiZap } from "react-icons/fi";
import { MemberFormData } from "@/types/member";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: MemberFormData) => void;
  initialData?: MemberFormData & { id?: string };
  mode?: "add" | "edit";
}

const emptyForm: MemberFormData = {
  name: "",
  phone_number: "",
  image_url: "",
  start_date: "",
  end_date: "",
  plan: "basic",
  email: "",
};

export default function AddMemberModal({
  open,
  onClose,
  onAdd,
  initialData,
  mode = "add",
}: AddMemberModalProps) {
  const [form, setForm] = useState<MemberFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...initialData } : emptyForm);
      setErrors({});
      setTimeout(() => {
        if (contentRef.current) {
          gsap.fromTo(
            contentRef.current.querySelectorAll(".form-row"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "power3.out" }
          );
        }
      }, 50);
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (!form.start_date) newErrors.start_date = "Start date is required";
    if (!form.end_date) newErrors.end_date = "End date is required";
    if (form.start_date && form.end_date && form.end_date <= form.start_date)
      newErrors.end_date = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd(form);
    onClose();
  };

  const handleChange = (key: keyof MemberFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div
          ref={contentRef}
          className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <DialogHeader className="px-8 pt-8 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-[#d4ff00] rounded-lg flex items-center justify-center">
                <FiZap className="text-black text-base" />
              </div>
              <DialogTitle className="font-['Bebas_Neue'] text-3xl tracking-widest text-white">
                {mode === "add" ? "New Member" : "Edit Member"}
              </DialogTitle>
            </div>
            <p className="text-[#555] font-['DM_Mono'] text-xs tracking-widest uppercase mt-1">
              {mode === "add" ? "Register a new gym member" : "Update member details"}
            </p>
          </DialogHeader>

          <div className="px-8 pt-6 pb-8 space-y-4">
            {/* Name */}
            <div className="form-row space-y-1.5">
              <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                <FiUser className="text-[#d4ff00]" /> Full Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#3a3a3a] focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11"
              />
              {errors.name && <p className="text-red-400 text-xs font-['DM_Mono']">{errors.name}</p>}
            </div>

            {/* Phone + Email */}
            <div className="form-row grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                  <FiPhone className="text-[#d4ff00]" /> Phone
                </Label>
                <Input
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#3a3a3a] focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11"
                />
                {errors.phone_number && (
                  <p className="text-red-400 text-xs font-['DM_Mono']">{errors.phone_number}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                  <FiMail className="text-[#d4ff00]" /> Email
                </Label>
                <Input
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@gym.com"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#3a3a3a] focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="form-row space-y-1.5">
              <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                <FiImage className="text-[#d4ff00]" /> Profile Picture URL
              </Label>
              <Input
                value={form.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                placeholder="https://..."
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#3a3a3a] focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11"
              />
            </div>

            {/* Dates */}
            <div className="form-row grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                  <FiCalendar className="text-[#d4ff00]" /> Start Date
                </Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11 [color-scheme:dark]"
                />
                {errors.start_date && (
                  <p className="text-red-400 text-xs font-['DM_Mono']">{errors.start_date}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                  <FiCalendar className="text-[#d4ff00]" /> End Date
                </Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus-visible:ring-[#d4ff00] focus-visible:border-[#d4ff00] font-['DM_Mono'] rounded-xl h-11 [color-scheme:dark]"
                />
                {errors.end_date && (
                  <p className="text-red-400 text-xs font-['DM_Mono']">{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Plan */}
            <div className="form-row space-y-1.5">
              <Label className="text-[#888] font-['DM_Mono'] text-xs tracking-widest uppercase flex items-center gap-2">
                <FiZap className="text-[#d4ff00]" /> Membership Plan
              </Label>
              <Select value={form.plan} onValueChange={(v) => handleChange("plan", String(v))}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white font-['DM_Mono'] rounded-xl h-11 focus:ring-[#d4ff00]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white font-['DM_Mono']">
                  <SelectItem value="basic" className="focus:bg-[#2a2a2a] focus:text-[#d4ff00]">Basic</SelectItem>
                  <SelectItem value="standard" className="focus:bg-[#2a2a2a] focus:text-[#d4ff00]">Standard</SelectItem>
                  <SelectItem value="premium" className="focus:bg-[#2a2a2a] focus:text-[#d4ff00]">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="form-row flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#2a2a2a] bg-transparent text-[#666] hover:bg-[#1a1a1a] hover:text-white font-['DM_Mono'] tracking-widest uppercase text-xs h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#d4ff00] text-black hover:bg-[#bfea00] font-['Bebas_Neue'] tracking-widest text-lg h-12 rounded-xl transition-all duration-200"
              >
                {mode === "add" ? "Add Member" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}