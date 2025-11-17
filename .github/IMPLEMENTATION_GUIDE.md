# Constitution Implementation Guide

This guide explains how the **Speckit Constitution** is implemented through workflows, checklists, and branch protection in this repository.

## Quick Start

### For Developers: Before Creating a PR

1. **Run local checks:**
   ```bash
   npm run lint          # Fix linting issues
   npm run format        # Format code
   npm test              # Run tests
   npm run test:coverage # Check coverage
   npm run build         # Build for production
   ```

2. **Verify changes meet Constitution principles:**
   - Code is small, focused, and readable (< 60 lines per function)
   - Tests are included for new logic
   - No performance regressions
   - UI changes use design tokens
   - Accessibility considered

3. **Create PR using template:**
   - Use `.github/pull_request_template.md` (auto-filled)
   - Fill out all sections, especially Constitution checklists
   - Link to related issue
   - Add test plan and performance impact notes

### For Reviewers: Reviewing a PR

1. **Check PR completeness:**
   - [ ] Issue linked
   - [ ] Test plan described
   - [ ] Constitution checklists filled

2. **Use the checklist:** Follow `.github/CONSTITUTION_CHECKLIST.md`
   - Verify Code Quality
   - Verify Testing
   - Verify UX/Accessibility
   - Verify Performance

3. **Wait for CI to pass:**
   - Constitution Enforcement workflow must pass
   - Coverage report available
   - Bundle size checked

4. **Merge when ready:**
   - All CI checks green ✅
   - At least 1 approval ✅
   - Conversations resolved ✅

---

## Architecture: How It Works

```
Developer commits code
        ↓
GitHub Actions triggered
        ↓
┌─────────────────────────────────────────┐
│  CONSTITUTION ENFORCEMENT WORKFLOW      │
├─────────────────────────────────────────┤
│  ✓ Code Quality (Lint + Format)         │
│  ✓ Testing (Tests + Coverage)           │
│  ✓ Performance (Build + Bundle Size)    │
│  ✓ PR Compliance (Description quality)  │
└─────────────────────────────────────────┘
        ↓
Results displayed in PR
        ↓
Reviewer checks PR using CONSTITUTION_CHECKLIST
        ↓
Branch Protection Rules enforced:
  - All CI checks must pass
  - At least 1 approval required
  - Conversations must be resolved
        ↓
Merge to main
        ↓
Main branch stays healthy ✅
```

---

## Files & Their Purposes

### Documentation

| File | Purpose |
|------|---------|
| `CONSTITUTION.md` | Core principles for code quality, testing, UX, performance |
| `CONSTITUTION_CHECKLIST.md` | Practical checklist for PR reviews and developer self-checks |
| `BRANCH_PROTECTION.md` | How to set up GitHub branch protection rules |
| `IMPLEMENTATION_GUIDE.md` | This file — how everything works together |

### Automation

| File | Purpose |
|------|---------|
| `.github/workflows/lint.yml` | ESLint + Prettier checks |
| `.github/workflows/test.yml` | Unit tests + coverage reporting |
| `.github/workflows/build.yml` | Build verification + bundle size check |
| `.github/workflows/constitution-enforcement.yml` | Master workflow tying all checks together |
| `.github/workflows/accessibility.yml` | Placeholder for future a11y testing |

### Configuration

| File | Purpose |
|------|---------|
| `.github/pull_request_template.md` | Template for all PRs, includes Constitution checklists |
| `.github/CODEOWNERS` | Auto-assign reviewers (when configured) |

---

## Constitution Principles → Automated Checks

### Code Quality (Constitution §1)

**Principle:** Small, readable, well-styled code with clear APIs.

**Automated Checks:**
```
ESLint         → Enforces naming, complexity, unused variables
Prettier       → Enforces consistent formatting
Build Success  → Verifies no syntax errors
```

**Manual Checks:**
- Code review verifies single responsibility
- Functions < 60 lines
- APIs documented and backward compatible

**What Fails CI:**
- Linting errors (max-warnings: 0)
- Formatting issues
- Build errors

---

### Testing (Constitution §2)

**Principle:** Fast, deterministic tests with meaningful assertions.

**Automated Checks:**
```
Test Suite     → All tests must pass
Coverage       → Reports coverage percentage
Performance    → Fails if tests timeout
```

**Manual Checks:**
- Reviewer verifies tests are for behavior, not implementation
- Tests are isolated (no external deps)
- Critical modules covered

**What Fails CI:**
- Any test failure
- No tests for new logic

---

### UX Consistency (Constitution §3)

**Principle:** Consistent design, patterns, accessibility, and error handling.

**Automated Checks:**
```
Accessibility  → (Future) axe-core scanning
Build Output   → Verifies no UX build errors
```

**Manual Checks:**
- Reviewer verifies design tokens used
- Interaction patterns consistent
- Loading/error states handled
- a11y considerations noted

**What Fails CI:**
- (Currently none automated; manual review enforces)
- (Future: a11y failures will fail CI)

---

### Performance (Constitution §4)

**Principle:** Measurable performance budgets, lazy loading, efficient APIs.

**Automated Checks:**
```
Bundle Size    → ❌ Fails if > 1MB, ⚠️ Warns if > 512KB
Build Speed    → Tracks build duration
Coverage       → Reports test coverage (proxy for quality)
```

**Manual Checks:**
- Reviewer verifies no unnecessary re-renders
- Critical path optimized
- Lazy-loading used appropriately

**What Fails CI:**
- Bundle size > 1MB (can request exception)
- Build errors

---

## Exception Handling

### When Something Exceeds Thresholds

**Scenario 1: Bundle size increased by 200KB for critical feature**

1. Add comment in PR explaining trade-off
2. Tag tech lead: "@tech-lead Please review bundle exception"
3. Tech lead approves and comments: `[APPROVED] Bundle exception for feature X`
4. Add label: `budget-exception`
5. Merge proceeds
6. File issue for optimization in next sprint

**Scenario 2: Test coverage dropped below target**

1. Reviewer comments: "Coverage below target"
2. Developer explains: "Legacy module, adding tests in follow-up"
3. Developer files issue #XYZ for coverage improvement
4. Add label: `coverage-debt`
5. Merge proceeds
6. Follow up on #XYZ next sprint

**Scenario 3: Critical hotfix needed for production**

1. Bypass branch protection (admin only)
2. Merge to main directly
3. File issue immediately for post-deployment review
4. Conduct async review of changes
5. Document in CHANGELOG as emergency hotfix
6. Re-enable branch protection

---

## Monitoring & Metrics

### Track These Key Metrics

| Metric | Target | Tool |
|--------|--------|------|
| CI Pass Rate | > 95% | GitHub Actions |
| Test Coverage | > 70% | Codecov/CI Report |
| Bundle Size | < 512KB | Build workflow |
| Code Review Cycle | < 24h | GitHub Insights |
| Exceptions/Month | < 2 | GitHub labels |

### How to Monitor

1. **GitHub Insights:**
   - Go to **Insights > Pulse** for health overview
   - Check **Insights > Network** for merge patterns

2. **CI Status:**
   - Green badge on README = all checks passing
   - View workflow runs at **Actions > Constitution Enforcement**

3. **Coverage:**
   - Coverage badge (if using Codecov)
   - Coverage report uploaded each CI run

4. **Exceptions:**
   - Use GitHub labels: `budget-exception`, `coverage-debt`, `a11y-exception`
   - Query: `is:merged label:budget-exception`

---

## Common Workflows

### Fixing a Failed PR

```bash
# 1. Pull latest changes
git pull origin main

# 2. Fix linting issues
npm run lint          # See what's wrong
npm run format        # Auto-fix formatting

# 3. Fix test failures
npm test              # Run tests locally
# Edit code to fix failing tests

# 4. Verify all checks pass
npm run lint
npm run format:check
npm test
npm run test:coverage
npm run build

# 5. Push changes
git push origin feature-branch

# 6. CI runs again automatically on PR
```

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes with tests
# 3. Run local checks
npm run lint
npm run format:check
npm test
npm run test:coverage
npm run build

# 4. Create PR using template
git push origin feature/new-feature
# Open PR on GitHub

# 5. Fill PR template completely
# 6. CI checks run automatically
# 7. Request review
# 8. Address review comments
# 9. Merge when approved and all checks pass
```

### Handling a Performance Regression

```bash
# 1. CI alerts: "Bundle size exceeds budget"
# 2. Developer investigates
npm run build
ls -lh dist/

# 3. Options:
#   a) Optimize: Remove unused code, lazy-load
#   b) Request exception: Justify in PR comment

# 4. If optimization:
#    - Make code changes
#    - Re-run build
#    - Push updates
#    - CI re-checks

# 5. If exception:
#    - Add detailed comment
#    - Tag tech lead
#    - Get approval
#    - File optimization issue for later
```

---

## Integration with IDE

### VS Code Setup

1. **Install extensions:**
   - ESLint
   - Prettier
   - Vitest (for test runner integration)

2. **Settings (.vscode/settings.json):**
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

3. **Pre-commit hook (optional but recommended):**
   ```bash
   npm install husky lint-staged --save-dev
   npx husky install
   # Runs lint/format/tests before commit
   ```

---

## Troubleshooting

### "Linter keeps failing on format"
- Run: `npm run format`
- Commit formatted code
- ESLint checks should pass

### "Tests pass locally but fail in CI"
- Usually: Missing test isolation or timing issue
- Check: CI logs for specific error
- Solution: Add proper test setup/teardown

### "CI taking too long"
- Check: Which job is slow (see workflow run details)
- Solutions:
  - Optimize tests (mock external calls)
  - Cache dependencies
  - Parallel test runs (if using Vitest)

### "Bundle size keeps growing"
- Check: What was added (see build output)
- Solutions:
  - Code splitting
  - Lazy loading
  - Tree shaking optimization
  - Remove unused dependencies

---

## Next Steps

1. **Enable branch protection** — Follow instructions in `BRANCH_PROTECTION.md`
2. **Set up CODEOWNERS** — Auto-assign reviewers by directory
3. **Configure CodeCov** — Detailed coverage tracking (optional)
4. **Add pre-commit hooks** — Run checks before commit (optional)
5. **Train team** — Share this guide and Constitution with team

---

## Questions?

Refer to:
- **Constitution Principles?** → Read `CONSTITUTION.md`
- **How to Review?** → Read `CONSTITUTION_CHECKLIST.md`
- **How to Set Up Branch Protection?** → Read `BRANCH_PROTECTION.md`
- **CI Configuration details?** → Check `.github/workflows/`

