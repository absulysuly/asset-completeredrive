# PHOENIX MVP - DEPLOYMENT PLAN
**Branch:** fix/api-validation-gemini-flag  
**Repository:** absulysuly/Copy-of-Hamlet-social  
**Execution Date:** 2025-10-19  
**Owner:** Development Team / Cloud AI  

---

## EXECUTIVE SUMMARY

This deployment plan provides step-by-step execution instructions to implement, validate, and deploy the Phoenix MVP hardening changes. The plan covers local implementation, staging deployment, production rollout, and rollback procedures.

**Total Timeline:** 3-5 days  
**Critical Path:** 8 hours implementation + 48 hours staging validation  
**Risk Level:** Medium (mitigated by feature flags and comprehensive testing)

---

## PREREQUISITES

### Required Access
- [ ] Git push access to absulysuly/Copy-of-Hamlet-social
- [ ] Local development environment: E:\HamletUnified\full_consolidation\frontend-aigoodstudeio
- [ ] Backend access: http://127.0.0.1:4001
- [ ] Staging environment access (Vercel or equivalent)
- [ ] Production environment access (for final deployment)

### Required Tools
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Git configured with proper credentials
- [ ] Text editor / IDE
- [ ] Terminal / PowerShell access

### Required Knowledge
- [ ] Understanding of Zod validation
- [ ] Familiarity with Next.js 14 App Router
- [ ] Basic testing knowledge (Jest/Vitest)
- [ ] GitHub Actions CI/CD basics

---

## PHASE 1: LOCAL IMPLEMENTATION (Day 1 - 8 hours)

### Step 1.1: Environment Setup (15 minutes)

```bash
# Navigate to project root
cd E:\HamletUnified\full_consolidation\frontend-aigoodstudeio

# Verify correct branch
git checkout fix/api-validation-gemini-flag
git pull origin fix/api-validation-gemini-flag

# Verify backend is running
# In separate terminal:
cd E:\HamletUnified\backend
npm start
# Expected output: "Server: http://localhost:4001"

# Test backend connectivity
curl http://127.0.0.1:4001/api/candidates?limit=1
# Should return JSON response
```

**Acceptance Criteria:**
- Branch checked out successfully
- Backend responding on port 4001
- No port conflicts

---

### Step 1.2: Install Dependencies (30 minutes)

```bash
# In frontend directory
cd E:\HamletUnified\full_consolidation\frontend-aigoodstudeio

# Update package.json with new dependencies
# (See FINALIZED_CODEX_PROMPT.txt for exact package.json changes)

# Install dependencies
npm install zod@^3.22.4 --save
npm install --save-dev jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom

# Verify installation
npm list zod
npm list jest

# Create jest.config.js if not present
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};
EOF

# Create jest.setup.js
echo "import '@testing-library/jest-dom';" > jest.setup.js
```

**Acceptance Criteria:**
- Zod installed in dependencies
- Jest and testing libraries in devDependencies
- No installation errors
- `npm list` shows correct versions

---

### Step 1.3: Create Telemetry Module (30 minutes)

```bash
# Create lib/telemetry.ts
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Verify file created
ls -la lib/telemetry.ts

# Quick syntax check
npx tsc --noEmit lib/telemetry.ts
```

**Acceptance Criteria:**
- lib/telemetry.ts exists
- No TypeScript errors
- reportApiFallback function exported

---

### Step 1.4: Rewrite API Client (90 minutes)

```bash
# Backup existing lib/api.ts
cp lib/api.ts lib/api.ts.backup

# Replace with validated version
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Verify syntax
npx tsc --noEmit lib/api.ts

# Test manually
# Start dev server
npm run dev

# In browser, open http://localhost:3000/en
# Check Network tab for /api/candidates calls
# Verify no runtime errors in console
```

**Acceptance Criteria:**
- lib/api.ts updated with Zod schemas
- unwrap() function implemented
- validateOrFallback() function present
- No TypeScript compilation errors
- Dev server starts successfully

---

### Step 1.5: Update Gemini Service (30 minutes)

```bash
# Backup existing services/geminiService.ts
cp services/geminiService.ts services/geminiService.ts.backup

# Add GEMINI_MODE gating
# (Apply changes from FINALIZED_CODEX_PROMPT.txt)

# Verify syntax
npx tsc --noEmit services/geminiService.ts

# Create .env.local if not present
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4001
GEMINI_MODE=stub
EOF

# Test stub mode
npm run dev
# Verify Gemini functions return stub responses
```

**Acceptance Criteria:**
- GEMINI_MODE check implemented
- Stub mode returns deterministic responses
- Remote mode preserved
- .env.local configured

---

### Step 1.6: Create Unit Tests (120 minutes)

```bash
# Create test directories
mkdir -p __tests__/lib
mkdir -p __tests__/services

# Create __tests__/lib/api.test.ts
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Create __tests__/services/geminiService.test.ts
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Run tests
npm test

# Expected output: All tests pass
```

**Acceptance Criteria:**
- API tests cover: arrays, wrapped objects, invalid data, network errors
- Gemini tests cover: stub mode, deterministic responses
- All tests pass locally
- No jest configuration errors

---

### Step 1.7: Create Smoke Test Script (20 minutes)

```bash
# Create scripts directory
mkdir -p scripts

# Create scripts/smoke.js
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Make executable
chmod +x scripts/smoke.js

# Test smoke script
npm run smoke

# Expected output: 4/4 tests passed
```

**Acceptance Criteria:**
- scripts/smoke.js exists
- Tests all critical endpoints
- Exits 0 on success, 1 on failure
- Works with backend at http://127.0.0.1:4001

---

### Step 1.8: Create CI Workflow (20 minutes)

```bash
# Create .github directory structure
mkdir -p .github/workflows

# Create .github/workflows/ci.yml
# (Copy complete implementation from FINALIZED_CODEX_PROMPT.txt)

# Verify YAML syntax
# Install yamllint if available
yamllint .github/workflows/ci.yml

# Or use online validator: https://www.yamllint.com/
```

**Acceptance Criteria:**
- CI workflow includes: build, test, smoke
- Uses matrix strategy for Node 18 and 20
- Smoke step is continue-on-error
- GEMINI_MODE=stub in all steps

---

### Step 1.9: Update Documentation (30 minutes)

```bash
# Backup README.md
cp README.md README.md.backup

# Add new sections to README.md
# (Copy sections from FINALIZED_CODEX_PROMPT.txt)

# Verify markdown syntax
# Use VS Code or online markdown previewer
```

**Acceptance Criteria:**
- Environment variables documented
- Development workflow explained
- Verification checklist included
- Troubleshooting guide added

---

### Step 1.10: Create Git Commits (30 minutes)

```bash
# Verify all changes are ready
git status

# COMMIT 1: Dependencies + Telemetry
git add package.json package-lock.json lib/telemetry.ts jest.config.js jest.setup.js
git commit -m "feat(api): add Zod dependency and telemetry module

- Add zod@^3.22.4 for runtime validation
- Add jest and testing-library for unit tests
- Create lib/telemetry.ts with reportApiFallback function
- Telemetry logs to console (dev: debug, prod: error)
- Designed for future Sentry/CloudWatch integration
- Truncates payload samples to 1KB in dev only"

# COMMIT 2: API Validation
git add lib/api.ts
git commit -m "feat(api): add Zod validation schemas and safe fallbacks

- Define Zod schemas: Candidate, PaginatedCandidates, Stats, Governorate
- Implement unwrap() for multiple response formats
- Add validateOrFallback() with telemetry integration
- Return safe fallbacks on validation failures (never throw)
- Normalize array responses to paginated format
- Handle network errors gracefully"

# COMMIT 3: Gemini Feature Flag
git add services/geminiService.ts .env.local
git commit -m "feat(gemini): gate Gemini API behind GEMINI_MODE env var

- Add GEMINI_MODE environment variable check
- Default to 'stub' mode for safe local development
- 'remote' mode preserves original Gemini API calls
- Stub mode returns deterministic mocks
- Prevents API costs during development
- Production capability fully preserved"

# COMMIT 4: i18n Comment (if changes made)
git add app/[lang]/layout.tsx
git commit -m "docs(i18n): clarify server-side dir computation

- Add comment explaining dir(lang) prevents hydration mismatch
- No functional changes (already uses i18next server-side)"

# COMMIT 5: Tests + Smoke + CI
git add __tests__/ scripts/smoke.js .github/workflows/ci.yml
git commit -m "test(ci): add unit tests, smoke script, and CI workflow

- Add unit tests for API normalization (array, wrapped, invalid)
- Add tests for Gemini service (stub/remote modes)
- Create cross-platform smoke test script (Node.js)
- Add GitHub Actions workflow (build, test, smoke)
- Smoke step continues-on-error if backend unavailable
- All tests use GEMINI_MODE=stub"

# COMMIT 6: Documentation
git add README.md
git commit -m "docs: add environment variables and verification guide

- Document GEMINI_MODE usage (stub vs remote)
- Add local development setup instructions
- Include verification checklist
- Add troubleshooting guide
- Document smoke test and unit test commands"

# Verify commits
git log --oneline -7

# Expected: 6 new commits with proper messages

# Push to remote
git push origin fix/api-validation-gemini-flag
```

**Acceptance Criteria:**
- 6 focused commits created
- Each commit has descriptive message
- Commits pushed successfully to GitHub
- No merge conflicts

---

### Step 1.11: Create Pull Request (15 minutes)

```bash
# Using GitHub CLI
gh pr create \
  --base main \
  --head fix/api-validation-gemini-flag \
  --title "Fix: Add API runtime validation, GEMINI_MODE flag, i18n SSR fix & CI smoke" \
  --body-file PR_BODY.md

# Or use GitHub web interface:
# 1. Navigate to https://github.com/absulysuly/Copy-of-Hamlet-social
# 2. Click "Pull requests" > "New pull request"
# 3. Select base: main, compare: fix/api-validation-gemini-flag
# 4. Copy PR body from FINALIZED_CODEX_PROMPT.txt
# 5. Create pull request
```

**Acceptance Criteria:**
- PR created successfully
- Title matches specification
- Body includes all sections
- CI checks automatically triggered

---

### Step 1.12: Collect Verification Artifacts (30 minutes)

```bash
# Build log
npm run build > build.log 2>&1
cat build.log | tail -50

# Test log
npm test > test.log 2>&1
cat test.log

# Smoke test log
npm run smoke > smoke.log 2>&1
cat smoke.log

# Sample API responses
curl http://127.0.0.1:4001/api/candidates?limit=2 | jq '.' > sample_candidates.json
curl http://127.0.0.1:4001/api/stats | jq '.' > sample_stats.json

# Screenshot: Open browser to http://localhost:3000/en
# 1. Open Developer Console (F12)
# 2. Navigate to /en page
# 3. Screenshot showing: no hydration warnings, rendered content
# 4. Navigate to /ar page
# 5. Screenshot showing: RTL layout, no warnings

# Attach all artifacts to PR as comments
```

**Acceptance Criteria:**
- build.log shows successful build
- test.log shows all tests passing
- smoke.log shows 4/4 tests passed
- Sample JSON responses collected
- Screenshots show no console errors

---

## PHASE 2: STAGING DEPLOYMENT (Day 2 - 4 hours)

### Step 2.1: Merge PR to Staging Branch (15 minutes)

```bash
# Wait for CI checks to pass
# Review PR with team
# Merge PR to staging branch (or main if staging deploys from main)

# Pull latest changes
git checkout main
git pull origin main

# Tag staging deployment
git tag -a v1.0.0-mvp-staging -m "Phoenix MVP staging deployment"
git push --tags
```

**Acceptance Criteria:**
- CI checks all passed
- PR approved by reviewer
- Changes merged to main/staging
- Tag created for tracking

---

### Step 2.2: Deploy to Staging (30 minutes)

```bash
# Using Vercel
vercel --prod --confirm

# Or using your deployment platform
# Record deployment URL
export STAGING_URL="https://your-staging-url.vercel.app"

# Wait for deployment to complete
# Expected: Deployment successful message
```

**Acceptance Criteria:**
- Staging deployment successful
- Deployment URL accessible
- No build errors in platform logs

---

### Step 2.3: Configure Staging Environment (15 minutes)

```bash
# Set environment variables in staging platform
# (Vercel example - adjust for your platform)

vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter: https://api-staging.your-domain.com

vercel env add GEMINI_MODE production
# Enter: stub

# Redeploy with new env vars
vercel --prod --force
```

**Acceptance Criteria:**
- NEXT_PUBLIC_API_BASE_URL points to staging backend
- GEMINI_MODE set to 'stub' initially
- Environment variables visible in platform dashboard

---

### Step 2.4: Run Staging Smoke Tests (20 minutes)

```bash
# Update smoke script to test staging
export NEXT_PUBLIC_API_BASE_URL="https://api-staging.your-domain.com"
npm run smoke

# Manual smoke test checklist:
# [ ] Open $STAGING_URL/en
# [ ] Verify page loads
# [ ] Check featured candidates render
# [ ] Check stats display
# [ ] Open $STAGING_URL/ar
# [ ] Verify RTL layout
# [ ] Check no hydration warnings in console
# [ ] Test candidate search
# [ ] Test navigation

# Record results
```

**Acceptance Criteria:**
- Automated smoke tests pass (if backend accessible)
- Manual smoke tests pass
- No console errors or warnings
- UI renders correctly in en/ar/ku

---

### Step 2.5: Validate Telemetry (20 minutes)

```bash
# Trigger API validation failure (for testing)
# Modify staging backend to return invalid data temporarily
# OR use browser DevTools to break API response

# Check staging logs for telemetry events
vercel logs --follow

# Expected output:
# [Telemetry] API Fallback: /api/candidates - validation_failed

# Verify telemetry format is structured JSON
# Verify sample payload is NOT included in production logs

# Restore backend to normal
```

**Acceptance Criteria:**
- Telemetry logs appear in staging
- Log format is structured and parseable
- No PII or sensitive data in logs
- Fallback behavior works correctly

---

### Step 2.6: Test GEMINI_MODE Remote (30 minutes)

```bash
# Update staging env to use remote Gemini
vercel env add GEMINI_MODE production
# Enter: remote

# Add Gemini API key (if needed)
vercel env add GOOGLE_GEMINI_API_KEY production
# Enter: <your-api-key>

# Redeploy
vercel --prod --force

# Test Gemini features in staging
# 1. Generate post suggestion
# 2. Test translation
# 3. Test MP response generation

# Monitor logs for Gemini API calls
vercel logs --follow | grep -i gemini

# Switch back to stub after validation
vercel env add GEMINI_MODE production
# Enter: stub
vercel --prod --force
```

**Acceptance Criteria:**
- GEMINI_MODE='remote' works in staging
- Real Gemini API calls succeed
- No API errors or rate limits hit
- Switched back to stub after validation

---

### Step 2.7: Performance Testing (30 minutes)

```bash
# Load test staging (if applicable)
# Use Apache Bench, k6, or similar tool

# Example with Apache Bench:
ab -n 100 -c 10 $STAGING_URL/en/candidates

# Monitor:
# - Response times
# - Error rate
# - Fallback usage frequency

# Check for:
# - No memory leaks
# - No excessive API fallback logging
# - Reasonable response times (<2s)
```

**Acceptance Criteria:**
- Staging handles expected load
- No performance regressions
- API validation doesn't significantly impact latency
- Fallback behavior is performant

---

### Step 2.8: Stakeholder Review (60 minutes)

```bash
# Schedule demo with stakeholders
# Walkthrough:
# 1. Show new validation behavior
# 2. Demonstrate fallback safety
# 3. Review telemetry logs
# 4. Show test coverage
# 5. Explain GEMINI_MODE flagging

# Collect feedback
# Document any concerns or change requests
```

**Acceptance Criteria:**
- Stakeholders approve staging deployment
- All concerns addressed or documented
- Sign-off received for production deployment

---

### Step 2.9: 48-Hour Monitoring (2 days)

```bash
# Monitor staging for 48 hours
# Check daily:

# Day 1 Morning
vercel logs --since 24h | grep -i "telemetry\|error\|warning"

# Day 1 Evening
# Review telemetry dashboard (if integrated)
# Check API fallback frequency
# Verify no unexpected issues

# Day 2 Morning
# Same checks as Day 1

# Day 2 Evening
# Final review before production
# Confirm: no critical issues, stable performance

# Document monitoring results
```

**Acceptance Criteria:**
- No critical errors in 48 hours
- API fallback rate is acceptable (<5%)
- No user-reported issues
- Monitoring data looks healthy

---

## PHASE 3: PRODUCTION DEPLOYMENT (Day 4-5 - 4 hours)

### Step 3.1: Production Environment Preparation (30 minutes)

```bash
# Review production checklist
# [ ] All staging tests passed
# [ ] 48-hour monitoring complete
# [ ] Stakeholder sign-off received
# [ ] Rollback plan documented
# [ ] Telemetry integrated (or plan in place)

# Configure production environment variables
# (Use your platform's production env settings)

# Set:
# - NEXT_PUBLIC_API_BASE_URL: https://api.your-domain.com
# - GEMINI_MODE: remote
# - GOOGLE_GEMINI_API_KEY: <production-key>
# - Any telemetry service keys (Sentry, CloudWatch, etc.)
```

**Acceptance Criteria:**
- All environment variables configured
- Secrets stored securely
- Production backend accessible
- Monitoring tools ready

---

### Step 3.2: Integrate Production Telemetry (60 minutes)

**Note:** This step is OPTIONAL for MVP launch but REQUIRED before full production.

```bash
# Option A: Sentry Integration
npm install --save @sentry/nextjs

# Configure Sentry in lib/telemetry.ts:
import * as Sentry from '@sentry/nextjs';

export function reportApiFallback(endpoint, reason, sample) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(`API Fallback: ${endpoint}`, {
      level: 'warning',
      extra: { reason, endpoint },
    });
  } else {
    console.debug('[Telemetry]', { endpoint, reason, sample });
  }
}

# Option B: CloudWatch (AWS)
# Use AWS SDK to push custom metrics

# Option C: Datadog
# Use Datadog SDK to log events

# Test telemetry in staging first
```

**Acceptance Criteria:**
- Telemetry service integrated (or tracked as post-launch task)
- Test events appear in telemetry dashboard
- Alert rules configured for fallback spikes

---

### Step 3.3: Create Production Deployment (20 minutes)

```bash
# Final code review
git checkout main
git pull origin main

# Create production tag
git tag -a v1.0.0-mvp-launch -m "Phoenix MVP production launch"
git push --tags

# Deploy to production
vercel --prod --confirm

# Record production URL
export PROD_URL="https://your-domain.com"

# Wait for deployment
# Monitor deployment logs
```

**Acceptance Criteria:**
- Deployment completes successfully
- No build errors
- Production URL accessible
- All assets loaded correctly

---

### Step 3.4: Production Smoke Tests (20 minutes)

```bash
# Run automated smoke tests against production
export NEXT_PUBLIC_API_BASE_URL="https://api.your-domain.com"
npm run smoke

# Manual production smoke test:
# [ ] Open $PROD_URL/en
# [ ] Verify home page loads
# [ ] Test candidate search
# [ ] Check stats page
# [ ] Open $PROD_URL/ar
# [ ] Verify RTL layout works
# [ ] Test navigation
# [ ] Verify no console errors

# Test GEMINI_MODE='remote':
# [ ] Generate post suggestion
# [ ] Test translation feature
# [ ] Verify MP response works
```

**Acceptance Criteria:**
- All smoke tests pass
- UI renders correctly
- GEMINI_MODE='remote' works
- No console errors

---

### Step 3.5: Monitor Production Launch (4 hours)

```bash
# Hour 0-1: Intensive monitoring
# Check every 5 minutes:
vercel logs --follow | grep -i "error\|fallback"

# Monitor:
# - Error rate (should be near zero)
# - API fallback frequency (should be low)
# - Gemini API usage (within limits)
# - Page load times

# Hour 1-4: Standard monitoring
# Check every 15 minutes

# Set up alerts:
# - Spike in API fallbacks (>10% of requests)
# - Error rate increase (>1%)
# - Slow response times (>5s p95)
```

**Acceptance Criteria:**
- No critical errors in first 4 hours
- Error rate < 1%
- API fallback rate < 5%
- User feedback is positive

---

### Step 3.6: Post-Launch Communication (30 minutes)

```bash
# Notify stakeholders
# Send email/message:

Subject: Phoenix MVP Production Launch - Successful

The Phoenix MVP has been successfully deployed to production.

Deployment Details:
- URL: https://your-domain.com
- Version: v1.0.0-mvp-launch
- Deploy Time: [timestamp]

Key Features:
✅ Runtime API validation with Zod
✅ GEMINI_MODE feature flag (currently: remote)
✅ Comprehensive testing (unit + smoke)
✅ Telemetry for observability

Initial Monitoring (First 4 Hours):
- Error rate: <1%
- API fallback rate: <5%
- User feedback: Positive
- No critical issues

Next Steps:
1. Continue 24-hour monitoring
2. Integrate full telemetry (Sentry/CloudWatch) within 7 days
3. Add E2E tests (planned for v1.1)
4. Gather user feedback

Rollback Plan: [link to plan below]

# Document in project wiki/docs
```

**Acceptance Criteria:**
- Stakeholders notified
- Launch details documented
- Success metrics shared

---

## PHASE 4: POST-DEPLOYMENT (Week 1)

### Step 4.1: Extended Monitoring (7 days)

```bash
# Daily checks for 7 days:

# Morning check (9 AM)
vercel logs --since 24h > daily_log_$(date +%Y%m%d).log
# Review for:
# - Error patterns
# - API fallback frequency
# - Gemini API usage
# - Performance metrics

# Afternoon check (2 PM)
# Review telemetry dashboard (if integrated)
# Check user feedback channels

# Evening check (6 PM)
# Final daily review

# Weekly summary
# After 7 days, compile summary report:
# - Total requests
# - Error rate
# - API fallback rate
# - User satisfaction
# - Issues encountered and resolved
```

**Acceptance Criteria:**
- No critical issues in 7 days
- Error rate remains <1%
- API fallback rate acceptable
- No rollback required

---

### Step 4.2: Telemetry Integration (if not done)

```bash
# Complete telemetry integration within 7 days
# Follow Step 3.2 instructions

# Test in staging first
# Deploy to production

# Configure dashboards and alerts
# Document runbook for on-call team
```

---

### Step 4.3: Performance Optimization (ongoing)

```bash
# Analyze telemetry data for optimization opportunities:
# - Which API endpoints trigger most fallbacks?
# - Are schemas too strict or too lenient?
# - Is GEMINI_MODE causing issues?

# Create optimization backlog:
# - Adjust Zod schemas if needed
# - Add request caching if appropriate
# - Implement telemetry sampling if logs too noisy

# Plan for v1.1 improvements
```

---

## ROLLBACK PLAN

### When to Rollback

Trigger rollback if any of:
- Error rate >5% for >15 minutes
- Critical functionality broken
- API fallback rate >20% sustained
- Security issue discovered
- Data integrity issue

### Rollback Procedure

```bash
# OPTION A: Revert deployment (fastest)
# Use platform's rollback feature
vercel rollback

# OR redeploy previous version
git checkout v0.9.0-pre-validation  # Previous stable tag
vercel --prod --confirm

# OPTION B: Feature flag disable
# Set GEMINI_MODE=stub if Gemini is the issue
vercel env add GEMINI_MODE production
# Enter: stub
vercel --prod --force

# OPTION C: Emergency fix
# Quickly fix critical bug
# Create hotfix branch
# Fast-track PR review
# Deploy hotfix

# POST-ROLLBACK
# 1. Notify stakeholders
# 2. Investigate root cause
# 3. Fix issues in staging
# 4. Re-test thoroughly
# 5. Re-deploy when ready
```

---

## VERIFICATION CHECKLIST

### Pre-Deployment
- [ ] All unit tests pass locally
- [ ] Smoke tests pass against dev backend
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] All 6 commits created and pushed
- [ ] PR created with full description
- [ ] CI checks pass
- [ ] Code review approved

### Staging
- [ ] Deployed to staging successfully
- [ ] Environment variables configured
- [ ] Smoke tests pass in staging
- [ ] Manual UI testing complete (en/ar/ku)
- [ ] No hydration warnings
- [ ] Telemetry logging works
- [ ] GEMINI_MODE tested in both modes
- [ ] 48-hour monitoring complete
- [ ] Stakeholder sign-off received

### Production
- [ ] Production env vars configured
- [ ] Secrets stored securely
- [ ] Telemetry integrated (or planned)
- [ ] Production tag created
- [ ] Deployment successful
- [ ] Smoke tests pass in production
- [ ] Manual testing complete
- [ ] Monitoring active
- [ ] First 4 hours: no critical issues
- [ ] Stakeholders notified

### Post-Deployment
- [ ] 7-day monitoring complete
- [ ] Weekly report compiled
- [ ] Optimization backlog created
- [ ] Rollback plan tested (optional)
- [ ] Team trained on new features

---

## ARTIFACTS TO COLLECT

### Implementation Phase
- [ ] `build.log` - Build output
- [ ] `test.log` - Unit test results
- [ ] `smoke.log` - Smoke test output
- [ ] `sample_candidates.json` - API response sample
- [ ] `sample_stats.json` - Stats API sample
- [ ] Screenshots: /en and /ar pages (no warnings)

### Staging Phase
- [ ] Staging deployment URL
- [ ] Staging smoke test results
- [ ] Telemetry log samples
- [ ] Performance test results
- [ ] Stakeholder feedback notes

### Production Phase
- [ ] Production deployment URL
- [ ] Production smoke test results
- [ ] First 4-hour monitoring report
- [ ] 7-day monitoring summary
- [ ] Issue log (if any)
- [ ] User feedback compilation

---

## SUCCESS METRICS

### Technical Metrics
- Build success rate: 100%
- Test pass rate: 100%
- Deployment success rate: 100%
- Error rate: <1%
- API fallback rate: <5%
- Page load time: <2s (p95)
- Uptime: >99.9%

### Business Metrics
- User satisfaction: >4/5
- Zero critical bugs in first week
- No rollback required
- Feature flag adoption: 100%
- Test coverage: >80% for new code

---

## CONTACTS AND ESCALATION

### Team Contacts
- **Development Lead:** [Name] - [Email] - [Phone]
- **DevOps:** [Name] - [Email] - [Phone]
- **Product Owner:** [Name] - [Email] - [Phone]
- **On-Call Engineer:** [Rotation] - [Contact Method]

### Escalation Path
1. **Level 1:** Development team handles issues
2. **Level 2:** DevOps + Development Lead (if L1 can't resolve in 30 min)
3. **Level 3:** Product Owner + CTO (critical business impact)

### Communication Channels
- **Slack:** #phoenix-mvp-deploy
- **Email:** team-phoenix@your-domain.com
- **Incident:** [Your incident management tool]

---

## APPENDIX: QUICK REFERENCE COMMANDS

### Local Development
```bash
# Start backend
cd E:\HamletUnified\backend && npm start

# Start frontend
cd E:\HamletUnified\full_consolidation\frontend-aigoodstudeio
npm run dev

# Run tests
npm test
npm run smoke

# Build
npm run build
```

### Git Operations
```bash
# Check branch
git branch --show-current

# Pull latest
git pull origin fix/api-validation-gemini-flag

# Push commits
git push origin fix/api-validation-gemini-flag

# Create tag
git tag -a v1.0.0-mvp-launch -m "Production launch"
git push --tags
```

### Deployment
```bash
# Deploy to staging/production
vercel --prod --confirm

# Rollback
vercel rollback

# View logs
vercel logs --follow

# Set env var
vercel env add VAR_NAME production
```

### Monitoring
```bash
# View recent logs
vercel logs --since 1h

# Filter errors
vercel logs | grep -i error

# Watch real-time
vercel logs --follow | grep -i "telemetry\|fallback"
```

---

**Plan Version:** 1.0  
**Last Updated:** 2025-10-19  
**Next Review:** After 7-day monitoring period

