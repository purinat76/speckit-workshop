# GitHub Configuration & Constitution Enforcement

This directory contains all GitHub-specific configuration, including automated workflows and documentation for enforcing the Speckit Constitution principles.

## 📋 Quick Navigation

### For Everyone
- **[CONSTITUTION_CHECKLIST.md](./CONSTITUTION_CHECKLIST.md)** — Step-by-step checklist for reviewing PRs and ensuring Constitution compliance

### For Developers
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** — Complete guide: how the system works, common workflows, troubleshooting
- **[pull_request_template.md](./pull_request_template.md)** — Auto-filled template with Constitution sections

### For Admins/Tech Leads
- **[BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md)** — How to set up branch protection rules in GitHub
- **[WORKFLOWS_IMPLEMENTATION_SUMMARY.md](./WORKFLOWS_IMPLEMENTATION_SUMMARY.md)** — Overview of all automated workflows

### Philosophy & Principles
- **[../../CONSTITUTION.md](../CONSTITUTION.md)** — Core principles (Code Quality, Testing, UX, Performance)

---

## 📁 Directory Structure

```
.github/
├── workflows/
│   ├── lint.yml                    # Linting & formatting checks
│   ├── test.yml                    # Unit tests & coverage
│   ├── build.yml                   # Build & bundle size validation
│   ├── constitution-enforcement.yml # Master workflow (all checks)
│   └── accessibility.yml           # Placeholder for future a11y tests
│
├── CONSTITUTION_CHECKLIST.md       # PR review checklist
├── IMPLEMENTATION_GUIDE.md         # How-to guide for developers
├── BRANCH_PROTECTION.md            # Branch protection setup
├── WORKFLOWS_IMPLEMENTATION_SUMMARY.md # Workflow overview
├── pull_request_template.md        # PR template (auto-filled)
├── README.md                       # This file
│
├── prompts/                        # Speckit agent prompts
│   ├── speckit.constitution.prompt.md
│   ├── speckit.implement.prompt.md
│   ├── speckit.tasks.prompt.md
│   └── ...
│
└── agents/                         # Speckit agent configurations
```

---

## 🎯 Constitution Principles & Automation

### 1. Code Quality (§1)

**Principle:** Small, readable, well-styled code with clear APIs

**Automated Checks:**
- ✅ ESLint (`workflows/lint.yml`)
- ✅ Prettier formatting (`workflows/lint.yml`)
- ✅ Build success (`workflows/build.yml`)

**Manual Review:**
- Follow: `CONSTITUTION_CHECKLIST.md` → Code Quality Review section

---

### 2. Testing (§2)

**Principle:** Fast, deterministic tests with meaningful assertions

**Automated Checks:**
- ✅ Unit tests pass (`workflows/test.yml`)
- ✅ Coverage report generated (`workflows/test.yml`)

**Manual Review:**
- Follow: `CONSTITUTION_CHECKLIST.md` → Testing Review section

---

### 3. UX Consistency (§3)

**Principle:** Consistent design, patterns, accessibility, error handling

**Automated Checks:**
- ⏳ Accessibility (planned in `workflows/accessibility.yml`)

**Manual Review:**
- Follow: `CONSTITUTION_CHECKLIST.md` → UX & Accessibility Review section

---

### 4. Performance (§4)

**Principle:** Measurable budgets, lazy loading, efficient APIs

**Automated Checks:**
- ✅ Bundle size validation (`workflows/build.yml`)
- ✅ Build performance (`workflows/build.yml`)

**Manual Review:**
- Follow: `CONSTITUTION_CHECKLIST.md` → Performance Review section

---

## 🚀 Getting Started

### Step 1: Understand the Constitution
Read [CONSTITUTION.md](../CONSTITUTION.md) to understand the principles.

### Step 2: Set Up (Admin Only)
Follow [BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md) to enable branch protection on `main`.

### Step 3: Work with the System
As a developer or reviewer:
- Developers: Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Reviewers: Use [CONSTITUTION_CHECKLIST.md](./CONSTITUTION_CHECKLIST.md)

### Step 4: Monitor
Track metrics and trends via GitHub Actions and Insights.

---

## ✅ Automated Workflows

### Constitution Enforcement (Master Workflow)
**File:** `workflows/constitution-enforcement.yml`

Runs on every PR and commit to `main`. Includes:
- Code Quality checks (lint + format)
- Testing (tests + coverage)
- Performance (build + bundle size)
- PR compliance validation

**Status:** ✅ Active

---

### Individual Workflows
**Files:** `workflows/lint.yml`, `workflows/test.yml`, `workflows/build.yml`

Standalone checks that are called by the master workflow.

**Status:** ✅ Active

---

### Accessibility (Future)
**File:** `workflows/accessibility.yml`

Placeholder for when UI component testing framework is added.

**Status:** 📋 Configuration ready, awaiting implementation

---

## 📝 PR Template

**File:** `pull_request_template.md`

Auto-filled for all new PRs. Includes:
- Summary & type of change
- Testing & performance impact
- Constitution checklists (all 4 sections)
- Reviewer reminders

**Status:** ✅ Ready to use

---

## 📊 Key Metrics & Monitoring

### What to Track
| Metric | Target | Where |
|--------|--------|-------|
| CI Pass Rate | > 95% | GitHub Actions |
| Test Coverage | > 70% | Coverage reports |
| Bundle Size | < 512KB | Build workflow output |
| Code Review Cycle | < 24h | GitHub Insights |
| Monthly Exceptions | < 2 | GitHub labels |

### How to View
1. **Workflows:** Go to **Actions** tab
2. **Coverage:** See report in test workflow artifacts
3. **Bundle Size:** See output in build workflow
4. **Trends:** Check **Insights > Pulse** or run details

---

## 🔧 Maintenance

### Regular Tasks
- **Weekly:** Monitor failed CI runs and address promptly
- **Monthly:** Review metrics for trends
- **Quarterly:** Audit Constitution exceptions for patterns

### When to Update
- **Workflows:** When tools (ESLint, Prettier, Vitest) are upgraded
- **Checklist:** When Constitution principles change
- **Documentation:** When process changes

### Troubleshooting
See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) → Troubleshooting section

---

## 🤝 Contributing

When contributing:
1. Create a feature branch
2. Make changes and run local checks: `npm run lint && npm run format:check && npm test && npm run build`
3. Open a PR (template auto-fills)
4. Ensure all Constitution checklists are completed
5. Wait for CI to pass
6. Request review
7. Address feedback
8. Merge when approved ✅

**Full guide:** [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CONSTITUTION_CHECKLIST.md` | Practical checklist for reviews |
| `IMPLEMENTATION_GUIDE.md` | Complete how-to guide |
| `BRANCH_PROTECTION.md` | Branch protection setup |
| `WORKFLOWS_IMPLEMENTATION_SUMMARY.md` | Workflow overview |
| `pull_request_template.md` | PR template |
| `README.md` | This file |

---

## 🆘 Support & Questions

### Before asking:
1. Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Review [CONSTITUTION.md](../CONSTITUTION.md)
3. See [CONSTITUTION_CHECKLIST.md](./CONSTITUTION_CHECKLIST.md)

### Common issues:
- **"PR failing CI"** → See Troubleshooting in IMPLEMENTATION_GUIDE
- **"How to review a PR?"** → Use CONSTITUTION_CHECKLIST
- **"How to set up branch protection?"** → See BRANCH_PROTECTION

### Questions about Constitution?
File an issue in the repository or discuss in team sync.

---

## 📋 Status Summary

- ✅ Constitution principles defined
- ✅ Automated workflows configured
- ✅ PR template created
- ✅ Checklist created
- ✅ Documentation complete
- ⏳ Branch protection setup (admin action needed)
- ⏳ Team training (recommend sharing documents)

---

## Version History

| Date | Changes |
|------|---------|
| Nov 17, 2025 | Created Constitution enforcement system, workflows, checklists, and documentation |

---

**Last Updated:** Nov 17, 2025

For full Constitution details, see [CONSTITUTION.md](../CONSTITUTION.md)

