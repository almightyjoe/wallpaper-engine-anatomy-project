@echo off
REM Double-click wrapper for install.ps1 - copies this project into
REM Wallpaper Engine's "My Projects" folder for local testing.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" %*
pause
