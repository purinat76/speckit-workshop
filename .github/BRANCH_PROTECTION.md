# Branch Protection & Enforcement Configuration

This document describes the recommended GitHub branch protection settings to enforce the **Speckit Constitution** principles.

## GitHub Branch Protection Rules

To set up branch protection for the `main` branch:

1. Go to **Settings > Branches > Branch protection rules**
2. Create a rule for `main` with the following settings:

### Require Status Checks to Pass Before Merging

**Required checks (from Constitution Enforcement workflow):**
- ✅ `Constitution Enforcement / constitution-check` — All code quality, testing, and performance checks
- ✅ `Constitution Enforcement / coverage-check` — Coverage verification
- ✅ `Constitution Enforcement / pr-compliance` — PR description quality
- ✅ `Build / build` — Successful build with no errors
- ✅ `Lint / lint` — ESLint and Prettier checks
- ✅ `Test / test` — All tests passing

### Require Code Reviews

- **Required approving reviews:** 1
- **Require review from Code Owners:** ✅ (if using CODEOWNERS file)
- **Dismiss stale pull request approvals when new commits are pushed:** ✅
- **Require approval of the most recent reviewable push:** ✅

### Additional Protections

- ✅ **Require conversation resolution before merging** — Resolve all review comments
- ✅ **Require status checks to be up to date before merging** — Latest changes must pass CI
- ✅ **Require branches to be up to date before merging** — Avoid merge conflicts
- ✅ **Include administrators** — Apply rules to admins too

### Dismissal Restrictions (Optional)

- **Only allow admins to dismiss pull request reviews**

---

## Enforcement Workflow Summary

The `constitution-enforcement.yml` workflow performs:

### Code Quality Gates 🛑
```
ESLint → Prettier → Linter passing (max-warnings: 0)
```
- Blocks merge if linting fails
- Enforces formatting standards

### Testing Gates 🛑
```
Unit Tests → Coverage Report → Minimum thresholds verified
```
- Blocks merge if tests fail
- Tracks coverage progress

### Performance Gates 🛑
```
Build → Bundle Size Check → Fails if > 1MB (warns if > 512KB)
```
- Prevents performance regressions
- Provides artifact audit trail

### PR Quality Checks ⚠️
```
PR Description validation → Issue linking → Test plan verification
```
- Warnings (non-blocking) for incomplete PR descriptions
- Ensures context for changes

---

## Setting Up CODEOWNERS

Create `.github/CODEOWNERS` to auto-assign reviewers:

```
# Default reviewer for all files
* @purinat76

# Core logic requires specific reviewer
/src/db/ @purinat76
/src/state/ @purinat76

# UI changes require design/UX reviewer (add when team grows)
/src/ui/ @purinat76

# Tests reviewed by QA lead (add when team grows)
/tests/ @purinat76
```

---

## Handling Exceptions

### When to Request Exception 🚨

1. **Performance Budget Exceeded:** Document reason, get tech lead approval
2. **Coverage Below Target:** Legacy code or external blocker — commit to remediation
3. **Flaky Test:** File issue, disable flaky test, fix, and re-enable

### Exception Process

1. Add comment in PR explaining exception
2. Tag relevant lead (tech, product, design)
3. Get explicit approval (via PR review)
4. Link to follow-up issue with remediation plan
5. Document in commit message: `[EXCEPTION] <reason>`

Example:
```
[EXCEPTION] Performance: +120KB bundle size for critical feature X
- Approval: @tech-lead agreed on Nov 17, 2025
- Remediation: #456 (scheduled for next sprint)
```

---

## Bypassing Protection (Emergency Only)

For critical production hotfixes:

1. **Admin can temporarily disable protection** — Never commit directly without review if possible
2. **Add follow-up check** — File issue to review changes in post-deployment review
3. **Document in CHANGELOG** — Mark as emergency hotfix
4. **Re-enable protection** — Immediately after merge

**Principle:** Exceptions should be rare; they signal process improvements needed.

---

## Monitoring Compliance

### Key Metrics to Track

- **CI Pass Rate:** Target > 95% (investigate failures)
- **Code Review Cycle Time:** Track time from PR to merge
- **Coverage Trend:** Ensure not declining month-over-month
- **Bundle Size Trend:** Flag increases > 10% without justification
- **Exception Rate:** Target < 2 exceptions/month (indicates process issues)

### GitHub Insights

Use **GitHub Insights** to monitor:
- Merge queue health
- CI job duration trends
- Code review metrics

---

## Integration with CI/CD

### Automated Checks Run On

- **Every commit to PR:** Quick checks (lint, format, tests)
- **Before merge:** Full suite including coverage and bundle
- **On main after merge:** Deployment checks (if configured)

### Artifact Retention

- Build artifacts: 7 days
- Coverage reports: 7 days
- Test reports: Indefinite (in CI logs)

---

## Escalation Path

| Issue | Severity | Action | Owner |
|-------|----------|--------|-------|
| Test failures | 🔴 High | Stop merge, investigate, fix | Developer |
| Coverage drop | 🟡 Medium | Add tests or document exception | Developer + Lead |
| Bundle increase | 🟡 Medium | Justify or optimize | Developer + Tech Lead |
| Performance regression | 🔴 High | Revert or fix before merge | Developer + Product |
| Flaky test | 🟠 Low-Medium | Disable and file issue | Developer + QA |

---

## Related Documents

- [Constitution](../../CONSTITUTION.md) — Principles this enforces
- [Constitution Checklist](./CONSTITUTION_CHECKLIST.md) — Manual review checklist
- [GitHub Actions Workflows](./workflows/) — Automated check implementations

