# Cleanup script for deployment preparation
Write-Host "Cleaning up unnecessary files for deployment..." -ForegroundColor Cyan
Write-Host ""

# List of documentation files to remove (keep only README.md)
$docsToRemove = @(
    "ADMISSION_TYPES_GUIDE.md",
    "ALL_DASHBOARDS_CLEANED_FINAL.md",
    "ALL_DEMO_FIGURES_REMOVED_FINAL.md",
    "ALL_TASKS_COMPLETED.md",
    "ANNOUNCEMENTS_FIXED.md",
    "BUDGET_API_COMPLETE.md",
    "BUGS_FIXED_PRODUCTION_READY.md",
    "BUGS_FIXED_SUMMARY.md",
    "BUGS_FIXED_TODAY.md",
    "CLEANUP_COMPLETE.md",
    "CLEANUP_SUMMARY.md",
    "COMPLETE_SYSTEM_SUMMARY.md",
    "COMPREHENSIVE_FINANCE_GUIDE.md",
    "COMPREHENSIVE_FINANCIAL_SYSTEM.md",
    "CRITICAL_FIX_NEEDED.md",
    "CRUD_FIXED_COMPLETE.md",
    "DASHBOARD_STATS_IMPLEMENTED.md",
    "DATABASE_CONNECTION_FIXED.md",
    "DATA_CLEANED_SUCCESS.md",
    "DATA_CLEANUP_GUIDE.md",
    "DEMO_DATA_REMOVAL_STATUS.md",
    "DEMO_DATA_REMOVED.md",
    "DEMO_FIGURES_REMOVED.md",
    "DEPLOY_TO_RENDER.md",
    "DEPLOY_TO_VERCEL.md",
    "EXPORT_FUNCTIONALITY_ADDED.md",
    "FEE_MANAGEMENT_IMPLEMENTED.md",
    "FINAL_BUG_FIX_SUMMARY.md",
    "FINAL_CLEANUP_STATUS.md",
    "FINAL_FIX_SUMMARY.md",
    "FINANCE_API_PROGRESS.md",
    "FINANCE_SUBPAGES_FIXED.md",
    "FINANCIAL_REPORTS_API_COMPLETE.md",
    "FIX_PRISMA_GENERATE.md",
    "FIX_TYPESCRIPT_ERROR.md",
    "FORGOT_PASSWORD_IMPLEMENTED.md",
    "HOW_TO_INSTALL_APP.md",
    "LOGO_BRANDING_ADDED.md",
    "LOGO_IMPLEMENTATION_COMPLETE.md",
    "NAME_FIELDS_UPDATED.md",
    "PARENTS_BUGS_FIXED_COMPLETE.md",
    "PARENT_COUNT_FIX.md",
    "PARENT_FEATURE_FINAL_STATUS.md",
    "PARENT_LINKING_FIXED.md",
    "PENDING_APPROVAL_FIXED.md",
    "PENDING_REGISTRATIONS_FIX.md",
    "PRODUCTION_IMPLEMENTATION_PLAN.md",
    "PRODUCTION_READY_FINAL.md",
    "PRODUCTION_READY_GUIDE.md",
    "PUSH_TO_NEW_REPO.md",
    "PWA_READY_SUMMARY.md",
    "PWA_SETUP_COMPLETE.md",
    "QUICK_FIX_INSTRUCTIONS.md",
    "QUICK_FIX_REFERENCE.md",
    "QUICK_TEST_REPORTS.md",
    "REAL_WORLD_PRODUCTION_STATUS.md",
    "REGISTRATION_FIXED.md",
    "REGISTRATION_QUICK_GUIDE.md",
    "REGISTRATION_TROUBLESHOOTING.md",
    "REMAINING_CLEANUP_TASKS.md",
    "REPORT_CASES_ALL_ROLES.md",
    "REPORT_CASES_COMPLETE_FIX.md",
    "REPORT_CASES_FEATURE.md",
    "REPORT_CASES_FIXED.md",
    "REPORT_ISSUE_COMPLETE_FIX.md",
    "REPORT_ISSUE_FIXED_FINAL.md",
    "REPORT_SUBMISSION_FIX.md",
    "RESTART_DEV_SERVER.md",
    "SELF_REGISTRATION_ENABLED.md",
    "SETUP_ADMISSION_TYPES.md",
    "SIDEBAR_FIX_SUMMARY.md",
    "SIDEBAR_PAGES_STATUS.md",
    "SYSTEM_STATUS_FINAL.md",
    "TODAYS_FIXES_SUMMARY.md",
    "TYPESCRIPT_ERROR_EXPLANATION.md"
)

# Test/development scripts to remove
$scriptsToRemove = @(
    "scripts/check-data-counts.js",
    "scripts/check-parent-count.js",
    "scripts/check-parent-data.js",
    "scripts/check-reports.js",
    "scripts/check-user-session.html",
    "scripts/clean-demo-data.js",
    "scripts/clear-all-data.js",
    "scripts/clear-teacher-data.js",
    "scripts/create-report-pages.ps1",
    "scripts/fix-missing-parents.js",
    "scripts/restart-dev.ps1",
    "scripts/test-api-endpoint.js",
    "scripts/test-complete-report-flow.js",
    "scripts/test-db-connection.js",
    "scripts/test-parent-api-direct.js",
    "scripts/test-parent-api.js",
    "scripts/test-prisma-client.js",
    "scripts/test-report-api.js",
    "scripts/test-report-submission.html",
    "scripts/test-report-submission.js",
    "fix-params.ps1"
)

# Remove documentation files
Write-Host "Removing development documentation files..." -ForegroundColor Yellow
$removedDocs = 0
foreach ($file in $docsToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
        $removedDocs++
    }
}

# Remove test scripts
Write-Host ""
Write-Host "Removing test/development scripts..." -ForegroundColor Yellow
$removedScripts = 0
foreach ($file in $scriptsToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
        $removedScripts++
    }
}

# Summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETE" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Removed $removedDocs documentation files" -ForegroundColor White
Write-Host "Removed $removedScripts test scripts" -ForegroundColor White
Write-Host ""
Write-Host "Your project is now clean and ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Files kept:" -ForegroundColor Cyan
Write-Host "  ✓ README.md (main documentation)" -ForegroundColor White
Write-Host "  ✓ docs/ folder (essential documentation)" -ForegroundColor White
Write-Host "  ✓ .kiro/specs/ (development specs)" -ForegroundColor White
Write-Host "  ✓ scripts/create-admin.ts (production script)" -ForegroundColor White
Write-Host "  ✓ scripts/quick-admin.ts (production script)" -ForegroundColor White
Write-Host "  ✓ scripts/migrate-admission-types.js (migration script)" -ForegroundColor White
Write-Host ""
