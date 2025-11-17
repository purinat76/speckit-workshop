# Speckit Constitution — Principles for Code Quality, Testing, UX, and Performance

This document captures compact, actionable principles the team agrees to follow. Each section includes why it matters, measurable acceptance criteria, and suggested automated checks for CI/PR.

## Contract
- Inputs: application source, tests, UX specs, performance budgets.
- Outputs: maintainable code; reliable test coverage; consistent UX; performance within defined budgets.
- Error modes: regressions detected by CI checks, UX deviations flagged in reviews, performance budget breaches reported in CI.

---

## 1. Code Quality Principles

1. Single Responsibility and Readability
   - Principle: Each module, class, and function has one clear responsibility and obvious intent.
   - Why: Easier to reason about, test, and change.
   - Acceptance criteria: PRs should keep functions small (guideline: < 60 lines), use clear names, and include a one-sentence comment for non-obvious behavior.
   - Checks: Lint rules for naming and complexity; human review verifies intent.

2. Consistent Style and Tooling
   - Principle: Follow a single style guide and enforce it automatically.
   - Why: Reduces cognitive load and noisy diffs.
   - Acceptance criteria: Code formats automatically on save/CI; lint errors fail CI.
   - Checks: Run formatter and linter in CI; include config files in repo.

3. Clear and Stable APIs
   - Principle: Public interfaces are documented, backward compatible, and evolved via deprecation policy.
   - Why: Consumers aren't surprised; upgrades are predictable.
   - Acceptance criteria: Major breaking changes require a migration plan and version bump.
   - Checks: API docs updated in PR; add communication to CHANGELOG.

4. Small, Focused PRs
   - Principle: PRs should implement one idea or fix.
   - Why: Easier review and faster iteration.
   - Acceptance criteria: PR description links to issue and contains a short summary and test plan; keep PRs small unless justified.
   - Checks: Reviewer checklist verifying scope.

---

## 2. Testing Standards

1. Test Pyramid & Responsible Coverage
   - Principle: Favor fast unit tests at the base, integration tests in the middle, and minimal slow end-to-end tests at the top.
   - Why: Fast feedback and high confidence without prohibitive test runtime.
   - Acceptance criteria: Team-defined targets for critical modules (example: 80% for core logic), but prioritize meaningful tests over raw percentage.
   - Checks: CI coverage report; require tests for new logic and bug fixes.

2. Deterministic and Fast Tests
   - Principle: Tests must be deterministic, isolated, and run quickly in CI.
   - Why: Flaky or slow tests erode trust in CI.
   - Acceptance criteria: No network or external-system dependency in unit tests; use mocks or test doubles.
   - Checks: Run tests in CI with fixed seeds; fail CI on timeouts or detected flakiness.

3. Meaningful Assertions and Behavior Tests
   - Principle: Tests assert behavior, not implementation.
   - Why: Allows refactors without fragile test rewrites.
   - Acceptance criteria: Tests assert outcomes and side effects rather than internal calls unless interaction tests are explicit.
   - Checks: Test review checklist and unit test examples in repo.

4. Continuous Test Enforcement
   - Principle: All commits merged to main must pass the test suite.
   - Why: Maintain a green main branch.
   - Acceptance criteria: PRs must pass CI and include tests for new functionality or fixes.
   - Checks: CI gating; automated test runs on branch and PR.

---

## 3. User Experience (UX) Consistency

1. Shared Design Tokens and Component Library
   - Principle: Use a single source of truth for colors, spacing, typography, and common components.
   - Why: Consistent look/feel and reduced duplication.
   - Acceptance criteria: UI uses the central token set; avoid inline "magic values".
   - Checks: Visual review, lint rules for CSS variables, Storybook or component catalog smoke tests.

2. Predictable Interaction Patterns
   - Principle: Interaction patterns (modals, toasts, navigation) behave consistently across the product.
   - Why: Reduces user confusion.
   - Acceptance criteria: Interaction patterns documented in the style guide; components expose consistent props/behaviors.
   - Checks: Storybook stories for interactive states; UX checklist in PR templates.

3. Accessibility by Default
   - Principle: Accessibility (a11y) is a first-class requirement.
   - Why: Reach more users and reduce compliance risk.
   - Acceptance criteria: Core UI components pass automated a11y checks and key views pass manual spot checks.
   - Checks: CI runs axe/core checks; PR includes an a11y impact note for UI changes.

4. Clear Error and Edge-state Communication
   - Principle: Users always see clear states for loading, empty, and error conditions.
   - Why: Better perceived reliability and easier troubleshooting.
   - Acceptance criteria: Every major view documents and implements loading/empty/error states.
   - Checks: UI tests or stories that render these states; UX review sign-off.

---

## 4. Performance Requirements

1. Define and Enforce Budgets
   - Principle: Set measurable performance budgets (load time, bundle size, key metrics) and enforce them in CI.
   - Why: Prevents regressions and keeps product snappy.
   - Acceptance criteria: Example budgets: initial page load < 1.5s (lab), JS bundle < 200 KB gzipped for app shell. Tailor to project.
   - Checks: CI performance checks (Lighthouse, bundle-size tool); PR fails when budgets exceeded.

2. Quantify and Monitor Real-world Metrics
   - Principle: Measure field metrics (FCP, TTFB, error rates) and track trends.
   - Why: Lab numbers don't always reflect user experience.
   - Acceptance criteria: Instrumentation in place to collect core metrics; dashboards show trends.
   - Checks: Alerts when metrics degrade beyond thresholds.

3. Progressive Enhancement and Lazy Loading
   - Principle: Deliver a usable baseline quickly; lazy-load non-critical resources.
   - Why: Improves perceived and actual performance on varied networks.
   - Acceptance criteria: Critical path resources prioritized; non-critical features loaded asynchronously.
   - Checks: Audit for critical path coverage and lazy-load patterns.

4. Efficient Server-side Behavior
   - Principle: Server endpoints must be predictable in latency and resource usage.
   - Why: Prevents cascading slowdowns and supports scaling.
   - Acceptance criteria: API SLOs (example: 95% < 300ms); endpoints implement pagination and sensible defaults.
   - Checks: Load tests for critical APIs; CI smoke tests for pagination and response sizes.

---

## Examples & Practical Acceptance Checklist (for PR reviewers)
- PR includes: short summary, linked issue, test plan, UX screenshots (if applicable), a11y note, performance impact note.
- CI checks must pass: linter/formatter, unit tests, coverage report, bundle-size/perf budget, automated a11y checks (where relevant).
- Reviewer verifies: scope, one-responsibility-per-change, meaningful tests added, and migration/deprecation notes if APIs change.

---

## Edge Cases & Risks
- Flaky tests: mitigate with retries and by isolating external dependencies behind stable test doubles.
- Legacy code with no tests: adopt a "cover on touch" rule—add tests when modifying legacy modules.
- Performance tradeoffs vs. features: require explicit product sign-off when a PR increases bundle size or latency beyond budgets.
- Accessibility conflicts with legacy UI: plan phased remediation and document exceptions.

---

## Implementation Notes & Suggested Automated Checks
- Lint + format: run in pre-commit and CI (ESLint/Prettier, flake8/black) depending on stack.
- Complexity: enforce with complexity/maintainability rules (e.g., eslint-plugin-complexity).
- Coverage: CI report and badge; require tests for changed files.
- Bundle/perf: integrate bundle-size or Lighthouse checks into CI; reject PRs that exceed budgets.
- Accessibility: run axe-core in CI for pages/stories modified by PRs.
- Telemetry: add basic web vitals instrumentation and a dashboard for trend tracking.

---

## Assumptions
- Team uses CI and can add the checks listed.
- Performance budgets and coverage targets are to be tuned by product/tech leads.
- Design tokens and component library either exist or the team will create them as a first step.

---

## Completion summary
- Created an actionable, measurable set of principles covering code quality, testing, UX consistency, and performance.
- Included acceptance criteria, CI/PR checks, and implementation suggestions.

---

## Next steps
- Add a badge or link to this file from the README.
- Optionally add GitHub Actions snippets to enforce the checks.
