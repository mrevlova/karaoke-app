@echo off
echo 🚀 Деплой Karaoke App на хостинг...
echo.

echo 📋 Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен!
    echo 📥 Скачай Node.js с https://nodejs.org/
    echo 📥 Выбери LTS версию и установи
    pause
    exit /b 1
)

echo ✅ Node.js найден
echo.

echo 📦 Установка зависимостей...
npm install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей
    pause
    exit /b 1
)

cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки backend зависимостей
    pause
    exit /b 1
)
cd ..

echo.
echo 🌐 Деплой на Vercel (Frontend)...
echo 📝 Следуй инструкциям в браузере...
vercel --prod

echo.
echo 📡 Деплой на Railway (Backend)...
echo 📝 Следуй инструкциям в браузере...
cd server
railway up
cd ..

echo.
echo ✅ Деплой завершен!
echo.
echo 📱 Получи URL в:
echo    Vercel Dashboard: https://vercel.com/dashboard
echo    Railway Dashboard: https://railway.app/dashboard
echo.
echo 🔧 Не забудь настроить переменные окружения!
pause 