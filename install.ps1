<#
.SYNOPSIS
  Installs (copies) this wallpaper project into Wallpaper Engine's "My Projects"
  folder so it shows up in the Wallpaper Engine editor/library for local testing.

.DESCRIPTION
  Wallpaper Engine doesn't need a build step - it just reads project.json +
  index.html from a folder under:
    <WallpaperEngineDir>\projects\myprojects\<your-project-folder>

  This script finds your Wallpaper Engine installation (or lets you specify it),
  then copies this repo's files into that folder, excluding dev-only files
  (.git, .claude, node_modules, install scripts).

.EXAMPLE
  # Auto-detect Wallpaper Engine and install
  .\install.ps1

.EXAMPLE
  # Specify Wallpaper Engine install directory manually
  .\install.ps1 -WallpaperEngineDir "D:\SteamLibrary\steamapps\common\wallpaper_engine"

.EXAMPLE
  # Use a different name for the project folder
  .\install.ps1 -ProjectName "anatomy-wallpaper-dev"
#>

param(
  [string]$WallpaperEngineDir,
  [string]$ProjectName = "anatomy-wallpaper"
)

$ErrorActionPreference = "Stop"

function Find-WallpaperEngineDir {
  $candidates = @()

  # Common Steam library locations
  $steamPaths = @(
    "C:\Program Files (x86)\Steam",
    "C:\Program Files\Steam",
    "C:\Steam"
  )

  # Also check all drive letters for a SteamLibrary folder
  foreach ($drive in [System.IO.DriveInfo]::GetDrives()) {
    if ($drive.DriveType -eq "Fixed") {
      $steamPaths += Join-Path $drive.RootDirectory.FullName "SteamLibrary"
      $steamPaths += Join-Path $drive.RootDirectory.FullName "Steam"
    }
  }

  foreach ($steamPath in $steamPaths) {
    $wePath = Join-Path $steamPath "steamapps\common\wallpaper_engine"
    if (Test-Path $wePath) {
      $candidates += $wePath
    }

    # Steam supports additional library folders configured in libraryfolders.vdf
    $libraryFoldersVdf = Join-Path $steamPath "steamapps\libraryfolders.vdf"
    if (Test-Path $libraryFoldersVdf) {
      $content = Get-Content $libraryFoldersVdf -Raw
      $vdfMatches = [regex]::Matches($content, '"path"\s*"([^"]+)"')
      foreach ($m in $vdfMatches) {
        $libPath = ($m.Groups[1].Value -replace '\\\\', '\').TrimEnd('\')
        $wePath2 = "$libPath\steamapps\common\wallpaper_engine"
        if (Test-Path $wePath2 -ErrorAction SilentlyContinue) {
          $candidates += $wePath2
        }
      }
    }
  }

  return @($candidates | Select-Object -Unique)
}

# --- Resolve Wallpaper Engine directory ---

if (-not $WallpaperEngineDir) {
  Write-Host "Searching for Wallpaper Engine installation..." -ForegroundColor Cyan
  $found = @(Find-WallpaperEngineDir)

  if ($found.Count -eq 0) {
    Write-Host ""
    Write-Host "Could not auto-detect Wallpaper Engine." -ForegroundColor Yellow
    Write-Host "Re-run this script with -WallpaperEngineDir pointing at your install, e.g.:" -ForegroundColor Yellow
    Write-Host '  .\install.ps1 -WallpaperEngineDir "D:\SteamLibrary\steamapps\common\wallpaper_engine"' -ForegroundColor Yellow
    exit 1
  }
  elseif ($found.Count -eq 1) {
    $WallpaperEngineDir = $found[0]
    Write-Host "Found: $WallpaperEngineDir" -ForegroundColor Green
  }
  else {
    Write-Host "Found multiple Wallpaper Engine installations:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $found.Count; $i++) {
      Write-Host "  [$i] $($found[$i])"
    }
    $choice = Read-Host "Select one by number"
    $WallpaperEngineDir = $found[[int]$choice]
  }
}

if (-not (Test-Path $WallpaperEngineDir)) {
  throw "Wallpaper Engine directory not found: $WallpaperEngineDir"
}

# --- Resolve target "myprojects" folder ---

$myProjectsDir = Join-Path $WallpaperEngineDir "projects\myprojects"
if (-not (Test-Path $myProjectsDir)) {
  New-Item -ItemType Directory -Path $myProjectsDir -Force | Out-Null
}

$targetDir = Join-Path $myProjectsDir $ProjectName

Write-Host ""
Write-Host "Installing to: $targetDir" -ForegroundColor Cyan

# --- Copy files, excluding dev-only paths ---

$sourceDir = $PSScriptRoot
$excludeDirs = @(".git", ".claude")
$excludeFiles = @("install.ps1", "install.bat", ".gitignore")

if (-not (Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# robocopy: mirror source -> target, excluding dev directories/files.
# /MIR keeps the target in sync (including removing files deleted from source).
$robocopyArgs = @(
  "`"$sourceDir`"",
  "`"$targetDir`"",
  "/MIR",
  "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS", "/NP"
)
foreach ($dir in $excludeDirs) {
  $robocopyArgs += "/XD"
  $robocopyArgs += "`"$(Join-Path $sourceDir $dir)`""
}
foreach ($file in $excludeFiles) {
  $robocopyArgs += "/XF"
  $robocopyArgs += "`"$file`""
}

$process = Start-Process -FilePath "robocopy.exe" -ArgumentList $robocopyArgs -NoNewWindow -Wait -PassThru

# robocopy exit codes 0-7 are "success" (different levels of "files copied/changed")
if ($process.ExitCode -ge 8) {
  throw "robocopy failed with exit code $($process.ExitCode)"
}

Write-Host ""
Write-Host "Done! Installed to:" -ForegroundColor Green
Write-Host "  $targetDir"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open Wallpaper Engine"
Write-Host "  2. Go to your Wallpaper Library (it should appear under 'My Wallpapers' / local projects)"
Write-Host "     - If it doesn't show up immediately, use the Editor's 'Open Project' and browse to:"
Write-Host "       $targetDir\project.json"
Write-Host "  3. Apply it as your wallpaper, then open Properties to test layer toggles"
Write-Host ""
Write-Host "Re-run this script anytime after making changes to update the installed copy." -ForegroundColor Cyan
