# 🚀 Быстрый деплой Karaoke App

## 📋 Пошаговая инструкция:

### 1. Подготовка GitHub
```bash
# Запусти этот файл:
setup-github.bat
```

### 2. Создай репозиторий на GitHub
1. Зайди на [github.com](https://github.com)
2. Нажми "New repository"
3. Назови его `karaoke-app`
4. **НЕ** ставь галочку "Add a README file"
5. Нажми "Create repository"
6. Скопируй URL (будет что-то вроде `https://github.com/username/karaoke-app`)

### 3. Загрузи код на GitHub
```bash
# Запусти этот файл и введи URL:
setup-deploy.bat
```

### 4. Деплой на Railway (Backend)
1. Зайди на [railway.app/dashboard](https://railway.app/dashboard)
2. Нажми "New Project"
3. Выбери "Deploy from GitHub repo"
4. Выбери свой репозиторий `karaoke-app`
5. В настройках укажи:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Нажми "Deploy"
7. Скопируй URL (будет что-то вроде `https://project-name-production.up.railway.app`)

### 5. Деплой на Vercel (Frontend)
1. Зайди на [vercel.com/dashboard](https://vercel.com/dashboard)
2. Нажми "New Project"
3. Импортируй свой GitHub репозиторий `karaoke-app`
4. В настройках:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (оставь пустым)
   - **Build Command:** `npm run build`
5. Нажми "Deploy"
6. Скопируй URL (будет что-то вроде `https://project-name.vercel.app`)

### 6. Настройка переменных окружения

#### В Vercel:
1. Зайди в настройки проекта
2. Перейди в "Environment Variables"
3. Добавь:
   - **Name:** `NEXT_PUBLIC_SOCKET_URL`
   - **Value:** URL твоего Railway backend
4. Нажми "Save"

#### В Railway:
1. Зайди в настройки проекта
2. Перейди в "Variables"
3. Добавь:
   - **Name:** `NODE_ENV`
   - **Value:** `production`
4. Добавь:
   - **Name:** `PORT`
   - **Value:** `3001`
5. Нажми "Save"

### 7. Готово! 🎉

Твои ссылки:
- **Зрители:** `https://твой-vercel-url.vercel.app/audience`
- **Музыкант:** `https://твой-vercel-url.vercel.app/musician`
- **Админ:** `https://твой-vercel-url.vercel.app/admin`

## 🔧 Если что-то не работает:

### Ошибка "Module not found":
- В Railway проверь, что Root Directory = `server`

### Ошибка WebSocket:
- Проверь URL backend в переменных окружения Vercel
- Убедись, что Railway проект запущен

### Ошибка CORS:
- В Railway добавь переменную `CORS_ORIGIN` = URL твоего Vercel сайта

## 📞 Поддержка:
- Проверь логи в Railway Dashboard
- Проверь логи в Vercel Dashboard
- Убедись, что все URL правильные 