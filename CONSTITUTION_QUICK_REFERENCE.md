# Quick Reference Card — Constitution Enforcement

**Printing-friendly one-pager for your team**

---

## 🎯 Constitution Principles Quick Overview

| Principle | What It Means | Key Checks |
|-----------|--------------|-----------|
| **Code Quality** | Small, readable, well-styled code | ESLint, Prettier, <60 lines/function |
| **Testing** | Fast, deterministic, meaningful tests | Tests pass, coverage tracked |
| **UX Consistency** | Consistent design, patterns, a11y, errors | Design tokens, accessible, clear errors |
| **Performance** | Measurable budgets, lazy loading | < 512KB bundle, fast build |

---

## 📋 For Developers: Before Creating a PR

### 1️⃣ Run Checks Locally
```bash
npm run lint              # Fix linting
npm run format            # Fix formatting
npm test                  # Run tests
npm run test:coverage     # Check coverage
npm run build             # Verify build
```

### 2️⃣ Create PR
- Push branch → Open PR
- Template auto-fills
- **Complete ALL checklists**

### 3️⃣ Wait for CI
- Constitution Enforcement workflow runs
- All checks must pass ✅
- Review feedback if needed

### 4️⃣ Merge
- Get 1 approval
- All checks green ✅
- Merge when ready

**Problems?** → See `IMPLEMENTATION_GUIDE.md` Troubleshooting

---

## ✅ For Reviewers: Using the Checklist

### Step 1: Check PR Completeness
- [ ] Issue linked
- [ ] Test plan described
- [ ] Constitution checklists filled

### Step 2: Review Code
- [ ] Single responsibility (one job per function)
- [ ] Functions < 60 lines
- [ ] Clear naming and comments
- [ ] DRY (no duplication)
- [ ] Backwards compatible

### Step 3: Review Tests
- [ ] Tests included for new logic
- [ ] Tests assert behavior (not implementation)
- [ ] No external dependencies in unit tests
- [ ] Coverage adequate

### Step 4: Review UX/Performance
- [ ] Design tokens used (no magic values)
- [ ] Interaction patterns consistent
- [ ] Error states handled
- [ ] Bundle size acceptable

### Step 5: Approve or Request Changes
- [ ] Approve when all good ✅
- [ ] Request changes if issues
- [ ] Comment with specific feedback

**Full checklist?** → See `.github/CONSTITUTION_CHECKLIST.md`

---

## 🚨 What Fails CI?

| Check | Tool | Status |
|-------|------|--------|
| Linting errors | ESLint | ❌ FAIL |
| Format issues | Prettier | ❌ FAIL |
| Test failures | Vitest | ❌ FAIL |
| Build errors | Vite | ❌ FAIL |
| Bundle > 1MB | Build script | ❌ FAIL |
| Bundle > 512KB | Build script | ⚠️ WARN |

---

## 🆘 My PR Failed CI. What Do I Do?

| Error | Solution |
|-------|----------|
| Linting errors | `npm run lint` (see errors, fix manually) |
| Format issues | `npm run format` (auto-fixes most) |
| Test failures | `npm test` (run locally, debug) |
| Build errors | `npm run build` (see errors) |
| Bundle exceeded | Optimize code or request exception |

### Request Exception
1. Comment in PR: "Bundle increase justified because..."
2. Tag tech lead: "@tech-lead Please review"
3. Get approval
4. Can proceed after approval

---

## 📍 Key Documents

| For | Document | Location |
|-----|----------|----------|
| **Developers** | How to work with system | `.github/IMPLEMENTATION_GUIDE.md` |
| **Developers** | What to check before PR | `.github/CONSTITUTION_CHECKLIST.md` (Pre-PR section) |
| **Reviewers** | Step-by-step review | `.github/CONSTITUTION_CHECKLIST.md` (Reviewer section) |
| **Admins** | Branch protection setup | `.github/BRANCH_PROTECTION.md` |
| **Everyone** | Principles explanation | `CONSTITUTION.md` |
| **Everyone** | Quick navigation | `.github/README.md` |

---

## 🔧 For Admins: First-Time Setup

1. **Enable Branch Protection** (`.github/BRANCH_PROTECTION.md`)
   - GitHub Settings → Branches → New rule
   - Apply to: `main` branch
   - Require status checks: All Constitution checks
   - Require approvals: 1
   - Time: ~10 min

2. **Optional: Create CODEOWNERS** (`.github/BRANCH_PROTECTION.md`)
   - Auto-assign reviewers by path
   - Time: ~5 min

3. **Test It**
   - Create test PR
   - Verify workflows run
   - Check output
   - Time: ~10 min

---

## 📊 Success Metrics

### Track These
- **CI Pass Rate:** Target > 95%
- **Test Coverage:** Target > 70%
- **Bundle Size:** Target < 512KB
- **Code Review Cycle:** Target < 24h
- **Monthly Exceptions:** Target < 2

### Where to View
- GitHub Actions → Constitution Enforcement runs
- Coverage reports in CI artifacts
- Bundle size in build output

---

## 🎓 Team Onboarding

### For New Team Members

1. **Read:** `CONSTITUTION.md` (understand why)
2. **Read:** `IMPLEMENTATION_GUIDE.md` (understand how)
3. **Reference:** `CONSTITUTION_CHECKLIST.md` (how to review)
4. **Bookmark:** `.github/README.md` (navigation hub)
5. **Ask:** Questions? See Troubleshooting in IMPLEMENTATION_GUIDE

**Time:** ~30 minutes

---

## 🆘 Common Questions

**Q: Template didn't auto-fill?**
A: Make sure file is at `.github/pull_request_template.md`

**Q: Which checks must pass before merge?**
A: All Constitution Enforcement checks + 1 approval + conversations resolved

**Q: Can I skip a checklist item?**
A: If justified. Document why in PR comment.

**Q: Bundle size is too big. What now?**
A: Optimize code OR add comment requesting exception + get tech lead approval

**Q: My test is flaky?**
A: File issue, disable temporarily, fix, re-enable

**Q: More questions?**
A: See IMPLEMENTATION_GUIDE.md Troubleshooting section

---

## 🚀 Quick Command Reference

```bash
# Local checks (run these!)
npm run lint              # Check linting (ESLint)
npm run format            # Fix formatting (Prettier)
npm run format:check      # Check formatting (no changes)
npm test                  # Run tests (Vitest)
npm run test:coverage     # Check coverage
npm run build             # Build for production

# Git workflow
git checkout -b feature/my-feature    # Create branch
git push origin feature/my-feature    # Push branch
# → Create PR on GitHub
# → Fill template and checklists
# → Wait for CI
# → Get review
# → Merge when ready
```

---

## 📞 Support Paths

### "I don't understand the principle"
→ Read `CONSTITUTION.md`

### "I don't know how the system works"
→ Read `IMPLEMENTATION_GUIDE.md`

### "I need to review a PR"
→ Use `CONSTITUTION_CHECKLIST.md` step-by-step

### "My CI failed"
→ See Troubleshooting in `IMPLEMENTATION_GUIDE.md`

### "I need to set up branch protection"
→ Follow `BRANCH_PROTECTION.md`

### "I have other questions"
→ File issue in repository

---

## ✨ Remember

- ✅ Constitution principles make us more efficient
- ✅ Automated checks catch issues early
- ✅ Clear checklists make reviews faster
- ✅ Exception process is there for justified trade-offs
- ✅ Questions? Documentation has answers
- ✅ Team success = shared responsibility

**Let's ship quality code! 🚀**

---

**Last Updated:** November 17, 2025
**Status:** Ready for team

