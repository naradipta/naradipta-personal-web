---
title: "Oculon Cast — Vision-AI Test Generator"
summary: "A tool that turns screen recordings into runnable Playwright and Appium test scripts using vision AI, with no app instrumentation required."
status: "in-progress"
featured: true
order: 6
tags: ["Python", "Playwright", "Appium", "Vision AI", "Test Automation", "ffmpeg"]
repo: "https://github.com/naradipta/oculon-cast"
showRepo: true
---

## Problem

Writing automated tests still starts with a human translating a manual test
flow into code, one interaction at a time. For teams that already record
screens during manual QA, exploratory sessions, or user bug reports, that
footage is rarely reused — it gets watched once and discarded, while the same
flow gets re-authored by hand as an automation script. Existing approaches to
closing this gap usually require instrumenting the app under test, which adds
setup cost and doesn't work for third-party or already-shipped apps.

## Role & Contribution

I'm the creator and sole developer of Oculon Cast. I designed the end-to-end
pipeline, chose the vision-AI-first approach over traditional computer-vision
libraries, and built the human-in-the-loop review gates that keep generated
tests trustworthy.

## Solution

Oculon Cast converts a screen recording directly into a Playwright (web) or
Appium (mobile) test script, using a multimodal vision model to understand
what's happening on screen instead of relying on app instrumentation or
accessibility trees. The pipeline runs as a disk-based, resumable state
machine through four stages: screencast → action windows → element
identification → action log → test script.

Because fully automated generation can misidentify elements or infer the
wrong intent, the pipeline is built around three human review gates rather
than a single black-box conversion:

- **Gate A — Widget labeling**: confirms which on-screen elements were
  identified and how they map to a per-app widget registry, built either by
  automated crawling or manual labeling.
- **Gate B — Action review**: filters and confirms the inferred action log
  before it's turned into test steps, so low-confidence guesses don't
  silently become test code.
- **Gate C — Validation specification**: lets the reviewer specify the
  assertions the generated test should actually check, since "what happened"
  and "what should be verified" aren't the same thing.

To keep cost predictable, the pipeline uses tiered vision models with prompt
caching rather than sending every frame through the most expensive model
available — bringing the cost of processing a typical recording down to a
fraction of a dollar rather than scaling linearly with model price.

## Impact

- Turns existing screen recordings — manual QA sessions, exploratory testing,
  even user-submitted bug videos — into a source of automated test coverage
  instead of throwaway footage
- Removes the need for app instrumentation, so it can generate tests for apps
  the team doesn't control the source of
- Three-gate review keeps a human in the loop at the points most likely to
  introduce false confidence, rather than trusting generated tests blindly
- Tiered-model cost design keeps generation to roughly $0.40 per 3-minute
  recording, making it viable to run against routine QA sessions rather than
  reserving it for high-value flows only
