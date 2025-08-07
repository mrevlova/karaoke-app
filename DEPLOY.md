# 🚀 Инструкции по деплою

## 📋 Что нужно сделать:

### 1. Установить Node.js
- Скачай с [nodejs.org](https://nodejs.org/)
- Выбери LTS версию
- Установи с настройками по умолчанию

### 2. Создать аккаунты на хостингах

#### Vercel (Frontend):
1. Зайди на [vercel.com](https://vercel.com)
2. Зарегистрируйся через GitHub
3. Подключи свой GitHub аккаунт

#### Railway (Backend):
1. Зайди на [railway.app](https://railway.app)
2. Зарегистрируйся через GitHub
3. Подключи свой GitHub аккаунт

### 3. Загрузить код в GitHub

#### Создай репозиторий:
1. Зайди на [github.com](https://github.com)
2. Создай новый репозиторий `karaoke-app`
3. Загрузи туда весь код

### 4. Деплой Backend (Railway)

#### Через GitHub:
1. Зайди в Railway Dashboard
2. Нажми "New Project"
3. Выбери "Deploy from GitHub repo"
4. Выбери свой репозиторий
5. В настройках укажи:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### Через CLI:
```bash
# Установи Railway CLI
npm install -g @railway/cli

# Войди в аккаунт
railway login

# Инициализируй проект
cd server
railway init

# Деплой
railway up
```

### 5. Деплой Frontend (Vercel)

#### Через GitHub:
1. Зайди в Vercel Dashboard
2. Нажми "New Project"
3. Импортируй свой GitHub репозиторий
4. В настройках:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (корень проекта)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### Через CLI:
```bash
# Установи Vercel CLI
npm install -g vercel

# Войди в аккаунт
vercel login

# Деплой
vercel
```

### 6. Настройка переменных окружения

#### В Vercel (Frontend):
1. Зайди в настройки проекта
2. Перейди в "Environment Variables"
3. Добавь:
   - `NEXT_PUBLIC_SOCKET_URL` = URL твоего Railway backend

#### В Railway (Backend):
1. Зайди в настройки проекта
2. Перейди в "Variables"
3. Добавь:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`

### 7. Получение URL

#### Backend URL (Railway):
- Будет что-то вроде: `https://karaoke-backend-production.up.railway.app`
- Скопируй этот URL

#### Frontend URL (Vercel):
- Будет что-то вроде: `https://karaoke-app.vercel.app`
- Это твой основной сайт

### 8. Финальная настройка

#### Обнови URL в коде:
1. Замени `https://karaoke-backend-production.up.railway.app` на твой реальный Railway URL
2. Перезапусти деплой в Vercel

## 🎯 Готовые ссылки:

После деплоя у тебя будут:
- **Зрители:** `https://karaoke-app.vercel.app/audience`
- **Музыкант:** `https://karaoke-app.vercel.app/musician`
- **Админ:** `https://karaoke-app.vercel.app/admin`

## 🔧 Возможные проблемы:

### Ошибка "Module not found":
- Проверь, что все зависимости установлены
- В Railway убедись, что root directory = `server`

### Ошибка WebSocket:
- Проверь URL backend в переменных окружения
- Убедись, что Railway проект запущен

### Ошибка CORS:
- В Railway добавь переменную `CORS_ORIGIN` = URL твоего Vercel сайта

## 📞 Поддержка:

Если что-то не работает:
1. Проверь логи в Railway Dashboard
2. Проверь логи в Vercel Dashboard
3. Убедись, что все URL правильные

## 🎉 Готово!

После успешного деплоя:
- Зрители просто откроют ссылку в браузере
- Никаких скачиваний не нужно
- Работает из любой точки мира 