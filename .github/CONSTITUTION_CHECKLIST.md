# Constitution Checklist — PR Review & Implementation Guide

This checklist helps reviewers and developers ensure compliance with the **Speckit Constitution** principles across code quality, testing, UX, and performance.

---

## Pre-PR Checklist (for developers)

### Code Quality
- [ ] Functions are small and focused (guideline: < 60 lines)
- [ ] Code follows naming conventions and is self-documenting
- [ ] Non-obvious behavior includes a one-sentence comment
- [ ] All lint and formatter checks pass locally
- [ ] APIs are documented and backward compatible (or migration plan included)
- [ ] PR description includes: summary, linked issue, and test plan

### Testing
- [ ] New logic or bug fixes include tests
- [ ] Tests are isolated and don't depend on external systems
- [ ] Tests assert behavior, not implementation details
- [ ] Unit tests run quickly (no unnecessary waits)
- [ ] Coverage report reviewed; critical modules meet team targets

### User Experience
- [ ] UI changes use shared design tokens (no magic values)
- [ ] Interaction patterns match existing conventions
- [ ] Accessibility impact note included in PR description
- [ ] Loading, empty, and error states are handled
- [ ] Responsive design verified at key breakpoints

### Performance
- [ ] Performance impact noted in PR description
- [ ] Bundle size changes are documented
- [ ] No unexpected network requests or slow scripts added
- [ ] Critical resources are properly prioritized

---

## PR Reviewer Checklist

### Scope & Intent ✓
- [ ] PR implements one clear idea or fix
- [ ] Title and description are concise and clear
- [ ] Related issue is linked
- [ ] Scope is justified if larger than typical

### Code Quality Review ✓
- [ ] Single responsibility: each module/function has one clear job
- [ ] Naming is clear and follows team conventions
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] No obvious refactoring opportunities missed
- [ ] Comments explain "why", not "what"
- [ ] Backwards compatibility maintained or migration plan provided

### Testing Review ✓
- [ ] Tests are present for new logic and bug fixes
- [ ] Test names clearly describe what they test
- [ ] Tests are deterministic and don't have flaky patterns
- [ ] No external dependencies in unit tests (mocks/stubs used)
- [ ] Test assertions are meaningful and test behavior
- [ ] Coverage for changed files is adequate

### UX & Accessibility Review ✓
- [ ] Visual design is consistent with existing patterns
- [ ] Colors, spacing, and typography use design tokens
- [ ] Interactive elements have clear, consistent behavior
- [ ] Error messages are clear and actionable
- [ ] Accessibility impact note reviewed
- [ ] Critical UI elements are keyboard accessible
- [ ] Responsive design verified for key breakpoints

### Performance Review ✓
- [ ] Bundle size impact is documented and acceptable
- [ ] No unnecessary re-renders or watchers
- [ ] Critical path is optimized
- [ ] Lazy-loading used for non-critical resources
- [ ] No unintended blocking operations

### API & Documentation Review ✓
- [ ] Public APIs are documented
- [ ] Breaking changes have a migration plan
- [ ] CHANGELOG updated if applicable
- [ ] README or docs updated if user-facing

### Merge Readiness ✓
- [ ] CI checks pass (lint, tests, coverage, bundle, a11y)
- [ ] No merge conflicts
- [ ] PR has been approved by at least one reviewer
- [ ] All comments addressed or accepted as follow-up work

---

## CI/CD Automated Checks (required before merge)

### Code Quality Checks
- [ ] Linter passes (ESLint or equivalent)
- [ ] Formatter verification passes (Prettier or equivalent)
- [ ] No complexity violations
- [ ] No unused variables or imports

### Testing Checks
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Coverage report generated
- [ ] No new test skips or ignores

### Performance Checks
- [ ] Bundle size within budget (or change justified)
- [ ] Lighthouse score acceptable
- [ ] No performance regressions detected

### Security & Accessibility Checks
- [ ] No known security vulnerabilities introduced
- [ ] Automated a11y checks pass (axe-core)
- [ ] No hardcoded secrets detected

---

## Post-Merge Verification

### Monitoring
- [ ] Feature deployed successfully
- [ ] No error spikes in monitoring
- [ ] Performance metrics stable or improved
- [ ] User feedback collected (if applicable)

### Documentation
- [ ] Release notes updated
- [ ] Architecture docs updated if applicable
- [ ] Team notified of new patterns or conventions

---

## Exception Process

### When Budget Thresholds are Exceeded

**Performance/Bundle Size:**
1. Document the reason in PR description
2. Get explicit sign-off from tech lead or product lead
3. Commit to remediation in follow-up PR with timeline
4. Add a comment linking to the remediation issue

**Test Coverage:**
1. Explain why coverage is lower (legacy code, external constraint)
2. Commit to increasing coverage with "cover on touch" rule
3. Add TODO comment with issue reference

**Accessibility or UX:**
1. Document the exception and timeline for fix
2. Get sign-off from designer/a11y lead
3. Add issue to backlog with priority

---

## Quick Reference: Principle Categories

| Category | Key Principles | Reviewer Focus |
|----------|---|---|
| **Code Quality** | SRP, Readability, Consistent Style, Clear APIs, Small PRs | Intent, naming, DRY, backwards compatibility |
| **Testing** | Test Pyramid, Deterministic, Meaningful, Enforced | Test coverage, isolation, behavior assertions |
| **UX** | Design Tokens, Consistent Patterns, a11y, Error States | Consistency, accessibility, clarity |
| **Performance** | Budgets, Monitoring, Progressive Enhancement, Efficiency | Bundle, speed, critical path, monitoring |

---

## Tips for Effective Reviews

1. **Be kind and constructive.** Assume good intent.
2. **Focus on principles, not opinions.** Reference the Constitution.
3. **Ask questions to understand intent.** Not all code needs comments.
4. **Praise good practices.** Reinforce the culture.
5. **Use automation where possible.** Don't waste time on lint or formatting.
6. **Escalate thoughtfully.** Flag trade-offs for tech/product leads.

---

## Integration with GitHub

To integrate this checklist into GitHub pull requests:

1. **Add to PR template:** Copy checklist items into `.github/pull_request_template.md`
2. **Create required status checks:** Enable branch protection with all CI checks required
3. **Auto-assign reviewers:** Use CODEOWNERS file to route reviews
4. **Track exceptions:** Use labels like `budget-exception`, `coverage-exception` for auditing

---

## Related Documents

- [Speckit Constitution](./CONSTITUTION.md) — Full principle definitions and rationale
- [Testing Guidelines](./TESTING.md) — Detailed testing strategy
- [Architecture](./ARCHITECTURE.md) — System design and component structure

