---
title: "QA Drill — QA & ISTQB CTFL Study App"
summary: "A free, bilingual (ID/EN) study app for QA fundamentals and ISTQB CTFL prep, with spaced repetition and mock exams."
status: "completed"
featured: true
order: 7
tags: ["JavaScript", "ISTQB CTFL", "Spaced Repetition", "AI-Assisted"]
demo: "https://learn.naradipta.com/"
showDemo: true
---

## Problem

After years of hands-on QA work, theory gaps remain: terminology, test
design techniques, and the exact framing ISTQB CTFL questions expect.
Generic quiz sites are scattered, rarely bilingual, and don't schedule
review around what you actually get wrong.

## Role & Contribution

I designed and built QA Drill end to end with AI assistance: the learning
objective map, the original study notes, the question bank design, the
scheduling logic, and the test suite. I reviewed and validated all content
myself.

## Solution

QA Drill is a dependency-free web app (plain HTML, CSS, and JavaScript) served
from its own subdomain. The learning app is static; an optional small Node API
adds email-and-password accounts so progress syncs across devices. It maps the CTFL learning objectives to
original notes and bilingual questions (multiple choice, true/false, short
answer), and offers spaced-repetition practice, a timed 40-question mock
exam with per-chapter distribution, a term flashcard deck, and a study plan
counted back from the exam date. Short answers are graded by keyword
matching with no AI, and the final judgment stays with the learner. 
Progress is stored in the browser and, for signed-in learners, merged across
devices without losing work from either one; export and import remain available.
All content is original and links to the official ISTQB syllabus.

## Impact

Turns a vague study goal into a daily routine, and doubles as a working
example of QA thinking applied to a product: pure grading functions covered
by automated tests, validated data at load, and safe DOM rendering.
