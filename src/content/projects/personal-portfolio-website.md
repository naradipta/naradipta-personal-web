---
title: "Personal Portfolio Website"
summary: "A content-first, zero-JS static portfolio built with Astro and Content Collections, self-hosted on a GCP VPS — built end-to-end with AI-assisted development."
status: "completed"
featured: true
order: 1
tags: ["Astro", "TypeScript", "Content Collections", "VPS", "AI-Assisted Development"]
#repo: "https://github.com/naradipta/naradipta-personal-web"
demo: "https://naradipta.com"
showRepo: true
showDemo: true
---

## Problem

As a QA Engineer, I needed a way to show recruiters and clients concrete
evidence of my work — automation frameworks, tracker validation systems,
testing strategy — rather than just listing skills on a resume. A generic
portfolio template wouldn't scale well as new case studies got added, and a
heavy CMS or backend would be overkill for what is fundamentally a set of
static case studies.

## Role & Contribution

I designed and built the entire site myself, from architecture to
deployment, using Astro with AI-assisted development (Claude Code) to move
faster through scaffolding, styling, and infrastructure debugging while
still reviewing and owning every decision. I defined the content model,
wrote all the case studies, and set up the production deployment on a
self-managed VPS.

## Solution

The site is content-first and static: every case study is a single Markdown
file validated against a Zod schema through Astro Content Collections, so
adding a new project never requires touching a component — just adding one
`.md` file with the right frontmatter. Pages are zero-JS by default, with
only a couple of small vanilla-JS touches (no framework) where real
interactivity was needed, like a mobile nav toggle.

For deployment, the site builds to static HTML/CSS and is served directly
by Nginx on a GCP VPS — no Node runtime needed at request time, only during
the build step. A `deploy.sh` script handles the git pull → build → sync
pipeline, with guardrails to prevent the source and web-serving directories
from ever colliding (a lesson learned from an early deploy mistake that
briefly wiped the server's file tree).

## Impact

- Every new case study is a single Markdown file — zero component changes needed to publish new work
- Zero-JS-by-default architecture keeps the site fast and simple to reason about
- Fully self-hosted on a GCP VPS with Nginx and HTTPS via Let's Encrypt, with a guarded deploy script that prevents the source/web-root collision that caused an earlier incident
- Used as the live, primary artifact recruiters see — directly demonstrating both the QA/automation case studies and the AI-assisted engineering workflow described in them
