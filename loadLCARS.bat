@echo off
REM Navigate to the folder where this script is located
cd /d "%~dp0"

REM Open a command prompt and run the command
cmd /k "npm run dev:all"
