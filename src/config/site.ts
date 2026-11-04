// Tipe + pemuat data pribadi (nama, kontak, skills, dll).
// Komponen dan halaman WAJIB mengambil data dari sini, bukan hardcode
// (lihat CLAUDE.md, prinsip #1). Nilai bawaan ada di site.json; bila env
// CONTENT_DIR diset (build dari admin), site.json di folder itu dipakai. Skills & ringkasan pengalaman diambil dari
// resume pemilik; tidak memuat detail internal perusahaan (lihat "Aturan
// Konten" di CLAUDE.md).

export interface ContactInfo {
  email: string;
  /** Link wa.me siap-klik, bukan nomor mentah. */
  whatsapp: string;
  linkedin: string;
  github: string;
}

export type SkillCategory =
  | "Languages"
  | "Testing Tools"
  | "Frameworks"
  | "AI-Assisted QA"
  | "Testing Types"
  | "Project & Monitoring Tools"
  | "Methodologies"
  | "Soft Skills";

export interface SkillGroup {
  category: SkillCategory;
  skills: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export type WhatIDoIcon = "bug" | "gear" | "cloud" | "mobile" | "shield" | "sparkle" | "doc" | "checklist";

export interface WhatIDoItem {
  icon: WhatIDoIcon;
  title: string;
  description: string;
}

export interface Availability {
  location: string;
  timezone: string;
  statusLine: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  /** Path ke foto profil, mis. "/profile/avatar.jpg" (taruh file di public/). Opsional. */
  avatar?: string;
  /** Path ke file resume/CV PDF, mis. "/resume.pdf" (taruh file di public/). Opsional. */
  resumeUrl?: string;
  tagline: string;
  valueProposition: string;
  whatIDo: WhatIDoItem[];
  availability: Availability;
  contact: ContactInfo;
  experience: ExperienceEntry[];
  skills: SkillGroup[];
}

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import defaults from "./site.json";

function load(): SiteConfig {
  const dir = process.env.CONTENT_DIR;
  const file = dir ? join(dir, "site.json") : "";
  return file && existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : (defaults as SiteConfig);
}

export const siteConfig: SiteConfig = load();
