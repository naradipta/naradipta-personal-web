---
title: "Tracker Event Validation Framework"
summary: "A data-driven framework that validates analytics tracker payloads against per-event JSON contracts across Web, Android, and iOS — catching tracking regressions during testing before they reach the dashboard."
status: "completed"
featured: true
order: 2
tags: ["Test Automation", "Java", "TestNG", "XPath", "Event Tracking"]
# repo: "https://github.com/you/your-repo"        # optional — omit until ready
# demo: "https://your-demo-video-or-link"          # optional — omit if none
# cover: "/covers/your-image.jpg"                  # optional — image goes in public/covers/ first
---

## Problem

During a large-scale e-commerce platform migration, every change to the product and checkout pages risked breaking the integrity of tracker event data — events like `product_view`, `product_click`, `widget_view`, `widget_click`, and `add_to_cart` sent to the analytics system. Validating these JSON payloads by hand, across dozens of events on three platforms (Web, Android, iOS), was slow and error-prone, and it did not scale as the number of events and fields kept growing. A single missed field or wrong data type could corrupt the analytics dashboard without anyone noticing until after release.

## Role & Contribution

As the QA Engineer, I designed and built this framework from the ground up using Java and TestNG. I owned the data-driven architecture and wrote the per-schema validators that check each captured payload against its contract.

## Solution

The framework follows a data-driven approach: each tracker event is defined as a JSON contract kept separate from the test code. When a payload is captured from the application under test, the framework matches it using XPath expressions with conditions rather than a plain event-name lookup. This lets a single expression cover many scenarios that share a similar payload structure — including widgets that carry the same name but differ by parameters and values — so near-identical events are matched precisely without writing a separate rule for each one. Once matched, the corresponding validator checks required fields, correct data types, and allowed enum values.

Adding coverage for a new event means adding one JSON schema file — no existing Java code is touched. The full suite runs through TestNG, so tracker regressions are caught during testing — before bad data has a chance to land in the analytics dashboard.

## Impact

- Replaced manual JSON checking with automated, repeatable validation across Web, Android, and iOS
- Cut new-event onboarding to a single JSON schema file, with zero changes to test code
- Caught tracking regressions during testing, before they reached the analytics dashboard
- Scaled cleanly as events and fields grew, keeping maintenance cost flat
