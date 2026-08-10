# Copy Pcampus Agent OS into a new project directory (Windows — no rsync required).
# Usage: .\scripts\bootstrap.ps1 C:\path\to\repo "My Project Name"

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Target,

    [Parameter(Position = 1)]
    [string]$ProjectName = "My Project"
)

$ErrorActionPreference = "Stop"

if ($ProjectName -eq "--help" -or $ProjectName -eq "-h") {
    Write-Host @"
Usage: bootstrap.ps1 <existing-project-path> ["Project Name"]

  Copies the Pcampus Agent OS framework into the target directory.
  Does not require rsync — uses built-in PowerShell copy.

Examples:
  .\scripts\bootstrap.ps1 ..\pcampus-studio "Pcampus Studio"
  .\scripts\bootstrap.ps1 C:\Projects\my-app "My App"
"@
    exit 0
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$OsRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$Target = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Target)

New-Item -ItemType Directory -Force -Path $Target | Out-Null

Write-Host "==> Agent OS source: $OsRoot"
Write-Host "==> Target:          $Target"
Write-Host "==> Project name:    $ProjectName"
Write-Host "==> Copying framework files (excluding .git)..."

Get-ChildItem -Path $OsRoot -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
    $destPath = Join-Path $Target $_.Name
    if ($_.PSIsContainer) {
        Copy-Item -LiteralPath $_.FullName -Destination $destPath -Recurse -Force
    }
    else {
        Copy-Item -LiteralPath $_.FullName -Destination $destPath -Force
    }
}

$date = Get-Date -Format "yyyy-MM-dd"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

Get-ChildItem -Path $Target -Recurse -File | Where-Object {
    $_.Extension -in ".md", ".mdc"
} | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, $utf8NoBom)
    $updated = $content.Replace("{PROJECT_NAME}", $ProjectName).Replace("{DATE}", $date)
    if ($updated -ne $content) {
        [System.IO.File]::WriteAllText($_.FullName, $updated, $utf8NoBom)
    }
}

Write-Host ""
Write-Host "Bootstrap complete: $Target"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. cd $Target"
Write-Host "  2. Run discovery: prompt Cursor with 'discover' (pcampus-discovery skill)"
Write-Host "     -> knowledge-digest.md, assumptions.md, project-brief.md, mvp-scope.md"
Write-Host "  3. Fill docs/03-architecture/overview.md and AGENTS.md {TEST_COMMANDS}"
Write-Host "  4. Replace docs/05-decisions/0001-example-postgresql.md with real ADR(s)"
Write-Host "  5. Add .cursor/rules/{stack}.mdc if needed (copy from stack-*.example.mdc)"
Write-Host "  6. Copy .github/ci-config.example.yml -> .github/ci-config.yml (at G-001)"
Write-Host "  7. Enable branch protection — docs/06-workflows/github-governance.md"
Write-Host "  8. Set G-001 to ready and prompt: อ่าน AGENTS.md แล้วทำ G-001"
Write-Host ""
Write-Host "Existing project with OS already? Use upgrade-os.sh — see docs/06-workflows/upgrade-agent-os.md"
Write-Host ""
Write-Host "Keep unchanged: design-spec.md, pcampus-* skills, process workflows."
