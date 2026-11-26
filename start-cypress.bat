@echo off
echo Starting Cypress Tests...
echo.
echo IMPORTANT: Make sure backend and frontend are running first!
echo.
pause
cd frontend
npm test
