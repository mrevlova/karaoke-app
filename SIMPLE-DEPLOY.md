# 🚀 Простой деплой Karaoke App

## 📋 Что у тебя есть:

✅ **Аккаунты созданы:** Vercel и Railway  
✅ **Архив готов:** `karaoke-app.zip` (17KB)  
✅ **Код подготовлен:** Все файлы настроены для деплоя  

## 🎯 Самый простой способ:

### 1. Загрузи код на GitHub
**Вариант A - GitHub Desktop (рекомендую):**
1. Скачай [GitHub Desktop](https://desktop.github.com/)
2. Установи и войди в аккаунт
3. "File" → "Clone repository" → выбери свой репозиторий
4. Скопируй все файлы из `karaoke-app.zip` в папку репозитория
5. "Commit to main" → "Push origin"

**Вариант B - Веб-интерфейс:**
1. Зайди в свой репозиторий на GitHub
2. "Add file" → "Upload files"
3. Распакуй `karaoke-app.zip` и перетащи все файлы
4. "Commit changes"

### 2. Деплой на Railway (Backend)
1. Зайди на [railway.app/dashboard](https://railway.app/dashboard)
2. "New Project" → "Deploy from GitHub repo"
3. Выбери свой репозиторий
4. В настройках:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. "Deploy"
6. Скопируй URL (будет что-то вроде `https://project-name-production.up.railway.app`)

### 3. Деплой на Vercel (Frontend)
1. Зайди на [vercel.com/dashboard](https://vercel.com/dashboard)
2. "New Project" → Импортируй свой GitHub репозиторий
3. В настройках:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (оставь пустым)
4. "Deploy"
5. Скопируй URL (будет что-то вроде `https://project-name.vercel.app`)

### 4. Настройка переменных
**В Vercel:**
- Settings → Environment Variables
- Добавь: `NEXT_PUBLIC_SOCKET_URL` = URL твоего Railway

**В Railway:**
- Settings → Variables
- Добавь: `NODE_ENV` = `production`
- Добавь: `PORT` = `3001`

## 🎉 Готово!

Твои ссылки:
- **Зрители:** `https://твой-vercel-url.vercel.app/audience`
- **Музыкант:** `https://твой-vercel-url.vercel.app/musician`
- **Админ:** `https://твой-vercel-url.vercel.app/admin`

## 🔧 Если что-то не работает:

### Ошибка "Module not found":
- В Railway проверь Root Directory = `server`

### Ошибка WebSocket:
- Проверь URL backend в переменных Vercel

### Ошибка CORS:
- В Railway добавь `CORS_ORIGIN` = URL твоего Vercel

## 📞 Поддержка:
- Логи Railway: [railway.app/dashboard](https://railway.app/dashboard)
- Логи Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)

**Начни с GitHub Desktop - это самый простой способ!** 