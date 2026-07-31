# Where to Edit What

> `dist/` is **generated output** from `npm run build`. Never edit it — it gets wiped every build. Everything below lives in `src/` or `public/`.

## Want to change text/data? → `src/config/site.ts`

The single source of truth for everything personal: your name, role, tagline,
About text, quote, "What I Do" cards, experience history, skills list, and
contact/availability info. Almost every text edit you want to make (except
project write-ups and gallery photos) happens here.

```
src/config/site.ts
```

## Want to add/edit a case study? → `src/content/projects/`

One `.md` file per case study. Frontmatter (top, between `---`) is structured
data (title, tags, status...); everything below is the Problem → Role →
Solution → Impact write-up in plain Markdown.

```
src/content/projects/
└── tracker-validation-framework.md   ← your one existing case study
```

To add a new one: copy this file, rename it, change the frontmatter + body.
The site picks it up automatically — no component editing needed.

## Want to add/edit a gallery photo? → `src/content/gallery/` + `public/gallery/`

Two-part: the actual image file goes in `public/gallery/`, and a small `.md`
file per photo in `src/content/gallery/` points to it + sets alt text/caption.

```
public/gallery/gallery-01.jpg ... gallery-09.jpg   ← the image files
src/content/gallery/photo-01.md ... photo-09.md    ← one entry per photo
```

## Want to change your profile photo? → `public/profile/avatar.jpg`

Replace the file (same name), or change the path in `site.ts`'s `avatar` field
if you rename it.

## Want to change how a section looks (not the words)? → `src/components/`

Each section of the page is one file. The `<style>` block at the bottom of
each file is scoped CSS just for that component.

```
src/components/
├── Hero.astro            ← name, photo, tagline, buttons at the top
├── ProjectCard.astro      ← the card design used in "What I've Built"
├── WhatIDoSection.astro   ← the 6-card "What I Do" grid + quote
├── ExperienceSection.astro← the "Where I've Worked" timeline
├── AboutSection.astro     ← "How I Work"
├── SkillsGrid.astro       ← the skill category cards
├── GallerySection.astro   ← the photo grid + "Load More" button
├── ContactSection.astro   ← bottom CTA + availability line
├── Footer.astro
└── ProjectFilter.tsx      ← the only interactive (React) piece — tag filter buttons
```

## Want to change global colors/fonts/spacing? → `src/styles/global.css`

CSS variables at the top (`--color-primary`, `--text-lg`, `--space-6`, etc.)
control the whole site's look. Change a variable here and it updates
everywhere that uses it.

## Site-wide shell (nav, `<head>`, footer wrapper)? → `src/layouts/BaseLayout.astro`

Controls the sticky nav bar links, page `<title>`/meta tags, and wraps every
page.

## The pages themselves → `src/pages/`

```
src/pages/
├── index.astro           ← the landing page — assembles all the sections above in order
└── projects/[slug].astro ← the detail page template for a single case study
```

You rarely need to touch these two — they mostly just pull in components and
content automatically. `index.astro` is where you'd reorder sections if you
ever want a different section order on the landing page.

---

### Quick decision guide

| I want to... | Edit this |
|---|---|
| Change my bio, tagline, skills, experience text | `src/config/site.ts` |
| Add a new case study | new file in `src/content/projects/` |
| Add a new gallery photo | image in `public/gallery/` + new `.md` in `src/content/gallery/` |
| Change a section's colors/spacing/layout | the matching file in `src/components/` |
| Change the whole site's color palette/fonts | `src/styles/global.css` |
| Change nav links or page `<title>` | `src/layouts/BaseLayout.astro` |

### After editing

```bash
npm run dev     # preview locally at localhost:4321, auto-reloads on save
npm run build   # regenerates dist/ for deploy — do this before shipping
```
