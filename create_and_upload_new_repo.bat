@echo off
echo ===================================================
echo   OMEGA TEACHER ENGINE - UPLOAD KE REPOSITORI BARU
echo ===================================================
echo.
cd /d "C:\Users\A C E R\Documents\OMEGA TEACHER ENGINE"

echo PERSIAPAN DI GITHUB:
echo 1. Masuk ke github.com, klik tombol "+" di kanan atas, pilih "New repository".
echo 2. Masukkan nama repositori baru Anda (misal: omega-teacher-engine).
echo 3. JANGAN centang pilihan "Add a README file", "Add .gitignore", atau "Choose a license".
echo 4. Klik tombol hijau "Create repository".
echo.
set /p REPO_URL="Masukkan URL Repositori GitHub Baru Anda (contoh: https://github.com/username/nama-repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] URL tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo 1. Menginisialisasi Git lokal khusus di folder ini...
git init
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menginisialisasi Git.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Menghubungkan ke repositori baru...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menghubungkan ke URL repositori baru.
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Mendaftarkan seluruh file proyek...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menambahkan file ke daftar Git.
    pause
    exit /b %errorlevel%
)

echo.
echo 4. Membuat commit pertama...
git commit -m "Initial commit - OMEGA Teacher Engine"
if %errorlevel% neq 0 (
    echo [NOTE] Gagal membuat commit atau tidak ada perubahan.
)

echo.
echo 5. Mengatur branch utama ke 'main'...
git branch -M main

echo.
echo 6. Mengunggah proyek ke GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Gagal mengunggah ke branch 'main'. Mencoba dengan branch 'master'...
    git push -u origin master
)

echo.
echo ===================================================
echo   PROSES SELESAI! Proyek Anda sudah terunggah ke Repositori Baru.
echo ===================================================
pause
