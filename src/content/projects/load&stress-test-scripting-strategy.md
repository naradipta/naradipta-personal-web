---
title: "Load & Stress Test Scripting Strategy"
summary: "Author and maintain the load-test scripts that size traffic from real BAU and event data, catching capacity risks before they hit production."
status: "completed"
featured: true
order: 4
tags: ["Load Testing", "Locust", "Performance", "Python", "QA Automation"]
# repo: "https://github.com/you/your-repo"        # optional — omit until ready
# demo: "https://your-demo-video-or-link"          # optional — omit if none
# cover: "/covers/your-image.jpg"                  # optional — image goes in public/covers/ first
---

## Problem

Performance issues were being discovered during high-traffic events rather than
before them. There was no repeatable way to answer the question the BE team kept
asking: "Can we handle this event's traffic?" Load numbers were guessed rather
than derived from real usage, so tests either under-stressed the system (giving
false confidence) or over-stressed it in ways that didn't reflect reality.
Without a defensible sizing method and well-maintained scripts, every event
carried the risk of latency spikes, error cascades, or outright outages under
peak load.

## Role & Contribution

I author and maintain the load-test scripts that run on a Locust-based
platform provided by the internal Platform team. My contribution is the scripting and test strategy layer,
not the framework itself: I design the user-journey scripts, keep them current
as flows change, and define how load is sized by collaborating directly with the
Backend team to translate BAU (business-as-usual) and event traffic into
concrete targets. I also maintain the pass/fail criteria and the rationale
behind each load profile so the numbers stay defensible as traffic patterns
shift.

## Solution

Working within the Platform team's Locust setup, I structure scripts around
actual user journeys rather than isolated endpoints, using weighted task
distributions and realistic think-time so the simulated load mirrors production
behavior.

Load sizing is anchored to real metrics agreed with BE: peak concurrent users
and busy-hour RPS from production, scaled by an event factor and a safety margin
for high-traffic events versus BAU. That formula and its assumptions are
documented separately from the scripts so any target can be justified and
updated without reverse-engineering the code.

Scripts handle authentication and session setup per simulated user and validate
responses so silent errors are caught rather than counted as successful
throughput. Runs are evaluated against SLOs defined upfront with BE — latency
percentiles, error-rate ceiling, throughput floor — turning each run into a
clear go/no-go signal rather than just a completion.

## Impact

- Load sizing shifted from guesswork to a documented method agreed with the BE team, making every target defensible for both BAU and event traffic
- Capacity risks are surfaced ahead of events instead of during them
- Maintained, journey-based scripts keep the suite relevant as flows change,
  reducing rework each testing cycle
- Response validation exposed failures that raw throughput numbers had been
  hiding, improving the accuracy of every run
