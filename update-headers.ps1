# PowerShell script to update dashboard pages with the new header component

$dashboardPages = @(
    "app\dashboard\add-coach\page.tsx",
    "app\dashboard\create-branch\page.tsx", 
    "app\dashboard\create-course\page.tsx",
    "app\dashboard\create-student\page.tsx",
    "app\dashboard\operations\page.tsx",
    "app\dashboard\payment-tracking\page.tsx",
    "app\dashboard\attendance\students\page.tsx",
    "app\dashboard\attendance\coaches\page.tsx"
)

Write-Host "Dashboard header component has been created at: components\dashboard-header.tsx" -ForegroundColor Green
Write-Host ""
Write-Host "The following pages have been updated to use the reusable header component:" -ForegroundColor Green
Write-Host "✓ app\dashboard\page.tsx" -ForegroundColor Green
Write-Host "✓ app\dashboard\students\page.tsx" -ForegroundColor Green  
Write-Host "✓ app\dashboard\branches\page.tsx" -ForegroundColor Green
Write-Host "✓ app\dashboard\courses\page.tsx" -ForegroundColor Green
Write-Host "✓ app\dashboard\coaches\page.tsx" -ForegroundColor Green
Write-Host ""
Write-Host "Additional pages that need to be updated manually:" -ForegroundColor Yellow
foreach ($page in $dashboardPages) {
    Write-Host "- $page" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "To update these pages, follow these steps for each:" -ForegroundColor Cyan
Write-Host "1. Import DashboardHeader: import DashboardHeader from '@/components/dashboard-header'" -ForegroundColor Cyan
Write-Host "2. Replace the header section with: DashboardHeader component" -ForegroundColor Cyan
Write-Host "3. Remove unused imports like Bell, ChevronDown, MoreHorizontal etc." -ForegroundColor Cyan
Write-Host ""
Write-Host "Benefits of this refactoring:" -ForegroundColor Magenta
Write-Host "✓ No more repeated header code across pages" -ForegroundColor Green
Write-Host "✓ Consistent navigation behavior" -ForegroundColor Green
Write-Host "✓ Automatic active state highlighting" -ForegroundColor Green
Write-Host "✓ Easier maintenance and updates" -ForegroundColor Green
Write-Host "✓ Responsive mobile navigation" -ForegroundColor Green
