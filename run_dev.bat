@echo off
echo ==========================================
echo  MEMBEBASKAN PORT DAN MENJALANKAN SERVER
echo ==========================================
echo 1. Menghentikan proses Node/TSX lama...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM tsx.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo 2. Menjalankan 'npm run dev' di port 3000...
npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server mengalami kegagalan saat dijalankan.
    pause
)
