# 🏋️ IronPulse — Gym Management App

A premium gym membership management system built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4.2**, **shadcn/ui**, and **GSAP** animations.

---

## ⚡ Setup (after `create-next-app`)

### 1. Install dependencies
```bash
npm install gsap react-icons
```

### 2. Install shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button input label select dialog alert-dialog
```

### 3. Copy files into your project
Place each file into the matching path in your Next.js project root:

```
types/member.ts
lib/utils-gym.ts
data/members.ts
components/AddMemberModal.tsx
components/MemberCard.tsx
components/MemberList.tsx
app/layout.tsx       ← replaces default
app/page.tsx         ← replaces default
app/globals.css      ← replaces default
```

### 4. next.config.ts — allow external image domains
Add this to your `next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
```

### 5. Run
```bash
npm run dev
```

---

## 🗂️ File Structure

| File | Purpose |
|------|---------|
| `types/member.ts` | Global TypeScript interfaces (`Member`, `MemberFormData`, `FilterTab`) |
| `lib/utils-gym.ts` | Helper functions (status, date formatting, days remaining) |
| `data/members.ts` | 8 dummy members with varied statuses |
| `components/AddMemberModal.tsx` | Add/Edit member modal with validation & GSAP stagger animation |
| `components/MemberCard.tsx` | Member card with WhatsApp/SMS links, edit, delete, GSAP hover |
| `components/MemberList.tsx` | Filtered list with tab navigation + search bar |
| `app/layout.tsx` | Root layout importing **Bebas Neue** + **DM Mono** via `next/font/google` |
| `app/page.tsx` | Full homepage: hero, stats, alert banner, member list |
| `app/globals.css` | Tailwind v4 `@import`, scrollbar, CSS vars |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary accent | `#d4ff00` (electric yellow-green) |
| Background | `#0a0a0a` |
| Surface | `#111111`, `#1a1a1a` |
| Active status | `#4ade80` |
| Expiring status | `#fb923c` |
| Expired status | `#f87171` |
| Display font | **Bebas Neue** (condensed, impactful) |
| Mono/body font | **DM Mono** (technical, precise) |

---

## ✨ Features

- **Add Member** modal with form validation and stagger reveal animation
- **Edit Member** inline using the same modal
- **Delete Member** with animated card removal and confirmation dialog
- **WhatsApp** deep-link button per member
- **SMS** deep-link button per member
- **Filter tabs** — All / Active / Expiring Soon / Expired
- **Search** by name or phone number
- **Stats dashboard** — total, active, expiring, retention rate
- **Alert banner** when members are expiring within 7 days
- **GSAP animations** — hero reveal, card hover lift, modal stagger, delete collapse
- **Google Fonts** loaded via `next/font/google` in root layout