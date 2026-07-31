import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Schema studi kasus project. Field & aturan mengikuti "Content Collection:
// schema `projects`" di CLAUDE.md — build akan gagal kalau frontmatter file
// .md di src/content/projects/ tidak sesuai.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    status: z.enum(["completed", "in-progress"]),
    featured: z.boolean(),
    order: z.number(),
    tags: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
  }),
});

// Foto tim/kerja untuk galeri di landing page. Satu file .md per foto,
// mengikuti pola yang sama seperti `projects`. Caption WAJIB mengikuti
// aturan kerahasiaan di CLAUDE.md — tidak menyebut nama event/proyek internal.
const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: z.object({
    image: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { projects, gallery };
