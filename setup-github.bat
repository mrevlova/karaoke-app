@echo off
echo 🚀 Настройка GitHub репозитория для Karaoke App...
echo.

echo 📋 Проверка Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git не установлен!
    echo 📥 Скачай Git с https://git-scm.com/
    echo 📥 Установи с настройками по умолчанию
    pause
    exit /b 1
)

echo ✅ Git найден
echo.

echo 🔧 Инициализация Git репозитория...
git init
if %errorlevel% neq 0 (
    echo ❌ Ошибка инициализации Git
    pause
    exit /b 1
)

echo 📝 Добавление файлов...
git add .
if %errorlevel% neq 0 (
    echo ❌ Ошибка добавления файлов
    pause
    exit /b 1
)

echo 💾 Первый коммит...
git commit -m "Initial commit: Karaoke App"
if %errorlevel% neq 0 (
    echo ❌ Ошибка коммита
    pause
    exit /b 1
)

echo.
echo ✅ Локальный репозиторий создан!
echo.
echo 📋 Следующие шаги:
echo 1. Создай репозиторий на GitHub.com
echo 2. Назови его "karaoke-app"
echo 3. НЕ инициализируй с README
echo 4. Скопируй URL репозитория
echo 5. Запусти setup-deploy.bat
echo.
pause 