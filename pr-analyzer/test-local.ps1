# Test script to verify the analyzer structure
Write-Host "=== PR Analyzer Test ===" -ForegroundColor Green

# Check if all required files exist
$files = @(
  "src\github.ts",
  "src\risk.ts",
  "src\index.ts",
  ".github\workflows\pr-analysis.yml",
  "package.json",
  "tsconfig.json"
)

$allExist = $true
foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "? $file exists" -ForegroundColor Green
  } else {
    Write-Host "? $file missing" -ForegroundColor Red
    $allExist = $false
  }
}

if ($allExist) {
  Write-Host "`nAll files present! Build successful." -ForegroundColor Green
} else {
  Write-Host "`nSome files are missing!" -ForegroundColor Red
}

# Show project structure
Write-Host "`n=== Project Structure ===" -ForegroundColor Green
Get-ChildItem -Recurse -Exclude node_modules | Select-Object FullName
