## Summary
<!-- Provide a clear, concise summary of this PR's changes -->


## Linked Issue
<!-- Link the issue this PR addresses, e.g., Fixes #123 or Closes #456 -->
Fixes #


## Type of Change
<!-- Mark the relevant box with an "x" -->
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♿ Accessibility improvement
- [ ] ⚡ Performance improvement

## Changes Made
<!-- Describe the specific changes in this PR -->


## Test Plan
<!-- Describe how to test this change. What scenarios did you verify? -->


## Performance Impact
<!-- Note any performance considerations (bundle size, load time, etc.) -->
- [ ] No performance impact
- [ ] Performance impact: [describe]
- [ ] Performance improvement: [describe]

## UX/Accessibility Impact
<!-- Note any UX or accessibility changes -->
- [ ] No UX changes
- [ ] UX changes: [describe]
- [ ] Accessibility impact: [describe]
- [ ] Accessibility improvements: [describe]

## Checklist — Code Quality (Constitution §1)
- [ ] Functions are small and focused (guideline: < 60 lines)
- [ ] Code follows naming conventions and is self-documenting
- [ ] Non-obvious behavior includes a one-sentence comment
- [ ] Lint checks pass (`npm run lint`)
- [ ] Format checks pass (`npm run format:check`)
- [ ] APIs are documented and backward compatible (or migration plan included)

## Checklist — Testing (Constitution §2)
- [ ] New logic or bug fixes include tests
- [ ] Tests are isolated and don't depend on external systems (no network calls)
- [ ] Tests assert behavior, not implementation details
- [ ] Unit tests run quickly (no unnecessary waits)
- [ ] Coverage report reviewed; changes are adequately tested

## Checklist — UX Consistency (Constitution §3)
- [ ] UI changes use shared design tokens (no magic values)
- [ ] Interaction patterns match existing conventions
- [ ] Loading, empty, and error states are handled
- [ ] Responsive design verified at key breakpoints

## Checklist — Performance (Constitution §4)
- [ ] Bundle size impact is acceptable (or trade-off justified)
- [ ] No unnecessary re-renders or watchers
- [ ] Critical path is optimized
- [ ] Lazy-loading used for non-critical resources

## Screenshots/Videos (if applicable)
<!-- Add screenshots or videos demonstrating the changes, especially for UI changes -->


## Additional Context
<!-- Add any other context about the PR here (dependencies, migration notes, etc.) -->


---

## Reviewer Reminders
- [ ] Verify scope aligns with linked issue
- [ ] Review code for single responsibility and clarity
- [ ] Check that meaningful tests are included
- [ ] Confirm accessibility and UX consistency
- [ ] Validate performance impact
- [ ] Ensure CI checks pass before merging

**Constitution Reference:** See [CONSTITUTION.md](../../CONSTITUTION.md) and [CONSTITUTION_CHECKLIST.md](../../.github/CONSTITUTION_CHECKLIST.md)
