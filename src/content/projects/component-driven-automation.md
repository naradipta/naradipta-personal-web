---
title: "Component-Driven Automation Framework for Discovery"
summary: "A data-driven Java framework that auto-generates validations from live page structure, making thousands of Discovery pages testable without per-page scripts."
status: "completed"
featured: true
order: 3
tags: ["Java", "TestNG", "Test Automation", "Data-Driven Testing", "GraphQL", "ExtentReports"]
# repo: "https://github.com/you/your-repo"        # optional — omit until ready
# demo: "https://your-demo-video-or-link"          # optional — omit if none
# cover: "/covers/your-image.jpg"                  # optional — image goes in public/covers/ first
---

## Problem

The Discovery module contains thousands of pages, making it impossible to write
and maintain a dedicated automation script for each one. Traditional page-by-page
test creation would never scale — coverage would always lag behind the product,
scripts would rot as pages changed, and the QA team would spend more time
maintaining tests than catching regressions. Without a scalable approach, most
Discovery pages would go completely untested.

## Role & Contribution

I designed and built the entire framework end-to-end. This included the
data-driven architecture, the modular component-level validation system, the
GraphQL integration that pulls page structure at runtime, and the reporting
layer. I owned the key design decision to validate by reusable page *component*
rather than by page, which is what makes the whole approach scale.

## Solution

The framework is built in Java using a Data-Driven Design (DDD) approach: a single
validation is written once and exercised against many data sets, instead of
duplicating logic per case. Each data set is fed in through TestNG's `@DataProvider`,
so one validation method runs iteratively across every page or component supplied
without any duplicated test code.

Rather than building automation for individual pages, I designed modular
validations keyed to page components. A tester supplies only the page names that
need to be validated. At runtime, the automation queries the page's GraphQL (GQL)
endpoint to retrieve that page's information — its structure and the components it
contains. The framework then maps each component to its corresponding validation
module and executes them automatically based on the returned page structure.

This means a single set of component validations covers any page built from those
components. New pages that reuse existing components are testable immediately, with
no new script required — the tester just adds the page name.

Because validations run automatically from the input page list, the framework
doubles as a regression suite — it can be scheduled to run daily or weekly to
catch regressions across Discovery pages as the product changes, with no manual
setup between runs.

Results are captured with the ExtentReports library, producing clear, readable
reports of what ran and what passed or failed across every validated page.

## Impact

- Made thousands of previously untestable Discovery pages coverable without
  writing per-page scripts
- Reduced new-page test setup from full script development to simply adding a
  page name to the input
- Component-level modularity keeps maintenance low — a fix to one validation
  propagates to every page using that component
- Doubles as a scheduled regression suite (daily/weekly), catching regressions
  across Discovery without manual re-setup
- ExtentReports gives stakeholders clear, shareable visibility into automation
  results
