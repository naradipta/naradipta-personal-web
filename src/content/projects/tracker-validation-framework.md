---
title: "Tracker Validation Framework"
summary: "A Java and TestNG framework that automatically validates e-commerce tracker event payloads against JSON schema contracts, catching tracking regressions before they reach production."
role: "QA Automation Engineer — designed and built the framework from scratch"
status: "completed"
featured: true
order: 1
tags: ["Java", "TestNG", "Data-Driven", "Tracker", "API"]
---

## Problem

During a large-scale e-commerce platform migration, every change to the
product and checkout pages risked breaking the integrity of tracker event
data (e.g. `product_view`, `add_to_cart`, `checkout_success`) sent to the
analytics system. Manually validating JSON payloads for dozens of events
across platforms (Web, Android, iOS) was slow, error-prone, and hard to
scale as the number of events and fields to check kept growing.

## Role & Contribution

As the QA Automation Engineer, I designed and built this tracker validation
framework from the ground up using Java and TestNG. My responsibilities
covered the data-driven architecture design, writing validators per event
schema, integrating with the test runner, and documenting how other teams
could add new event schemas on their own.

## Solution

The framework follows a data-driven testing approach: each tracker event
schema (e.g. `product_view`, `add_to_cart`, `checkout_success`) is defined
as a JSON contract kept separate from the test code. When an event payload
is captured from the application under test, the framework automatically
matches the payload's `event_name` against the registered schemas, then
calls the matching validator to check for required fields, correct data
types, and allowed enum values.

Adding validation coverage for a new event only requires adding one JSON
schema file, without touching any existing Java code. The full suite runs
through TestNG and is wired into the CI pipeline, so tracker regressions
are caught before release, not after the data has already landed in the
analytics dashboard.

## Impact

- Tracker regression coverage increased significantly, since validation now
  runs automatically on every build instead of relying on manual spot-checks.
- Validation time for dozens of event schemas dropped from hours of manual
  work to minutes through automation.
- Zero critical incidents related to missing or malformed tracker data
  during the platform migration period.
- The data-driven pattern lets other teams add new event schemas
  independently, without depending on a single QA engineer.
