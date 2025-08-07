@echo off
echo 🚀 Деплой Karaoke App на хостинги...
echo.

set /p GITHUB_URL="Введи URL твоего GitHub репозитория (например: https://github.com/username/karaoke-app): "

echo.
echo 🔗 Подключение к GitHub...
git remote add origin %GITHUB_URL%
if %errorlevel% neq 0 (
    echo ❌ Ошибка подключения к GitHub
    pause
    exit /b 1
)

echo 📤 Отправка кода на GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo 📤 Попытка с веткой master...
    git push -u origin master
    if %errorlevel% neq 0 (
        echo ❌ Ошибка отправки на GitHub
        pause
        exit /b 1
    )
)

echo.
echo ✅ Код загружен на GitHub!
echo.
echo 🌐 Теперь деплой на хостинги:
echo.
echo 📡 Railway (Backend):
echo 1. Зайди на https://railway.app/dashboard
echo 2. Нажми "New Project"
echo 3. Выбери "Deploy from GitHub repo"
echo 4. Выбери свой репозиторий
echo 5. В настройках укажи:
echo    - Root Directory: server
echo    - Build Command: npm install
echo    - Start Command: npm start
echo.
echo 🌐 Vercel (Frontend):
echo 1. Зайди на https://vercel.com/dashboard
echo 2. Нажми "New Project"
echo 3. Импортируй свой GitHub репозиторий
echo 4. В настройках:
echo    - Framework Preset: Next.js
echo    - Root Directory: ./
echo    - Build Command: npm run build
echo.
echo 🔧 После деплоя не забудь настроить переменные окружения!
echo.
pause 