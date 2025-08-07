@echo off
echo 🎤 Запуск Karaoke App...
echo.

echo 📦 Установка зависимостей frontend...
npm install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки frontend зависимостей
    pause
    exit /b 1
)

echo 📦 Установка зависимостей backend...
cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки backend зависимостей
    pause
    exit /b 1
)
cd ..

echo.
echo 🚀 Запуск серверов...
echo.

echo 📡 Запуск backend сервера (порт 3001)...
start "Backend Server" cmd /k "cd server && npm run dev"

echo ⏳ Ожидание запуска backend...
timeout /t 3 /nobreak > nul

echo 🌐 Запуск frontend приложения (порт 3000)...
start "Frontend App" cmd /k "npm run dev"

echo.
echo ✅ Приложение запущено!
echo.
echo 📱 Ссылки:
echo    Зрители: http://localhost:3000/audience
echo    Музыкант: http://localhost:3000/musician
echo    Админ: http://localhost:3000/admin
echo.
echo 🔧 Для остановки закройте окна командной строки
pause 