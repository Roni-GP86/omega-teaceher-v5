@echo off
echo Menghentikan seluruh proses Node.js yang aktif...
taskkill /F /IM node.exe
taskkill /F /IM tsx.exe
echo.
echo Selesai! Port 3000 kini telah bebas.
echo Silakan jalankan 'npm run dev' kembali.
pause
