@echo off
echo ===================================================
echo   OMEGA TEACHER ENGINE - AUTO UPDATE TO GITHUB
echo ===================================================
echo.
cd /d "C:\Users\A C E R\Documents\OMEGA TEACHER ENGINE"

echo 1. Menambahkan perubahan ke Git...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menambahkan file ke Git.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Membuat catatan pembaruan (Commit)...
git commit -m "Update KOSP Generator: Add Rapor Pendidikan Analysis and Enriched Profiles"
if %errorlevel% neq 0 (
    echo [NOTE] Mungkin tidak ada perubahan baru untuk disimpan atau di-commit.
)

echo.
echo 3. Mengunggah ke GitHub (Push)...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [PENTING] Gagal push ke branch 'main'. Mencoba dengan branch 'master'...
    git push origin master
)

echo.
echo ===================================================
echo   PROSES SELESAI!
echo ===================================================
pause
