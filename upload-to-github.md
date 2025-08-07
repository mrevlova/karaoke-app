# 📤 Загрузка кода на GitHub (без Git)

## 🚀 Альтернативный способ:

### 1. Скачай Git
1. Зайди на [git-scm.com](https://git-scm.com/)
2. Скачай Git для Windows
3. Установи с настройками по умолчанию
4. Перезапусти командную строку

### 2. Или используй GitHub Desktop
1. Скачай [GitHub Desktop](https://desktop.github.com/)
2. Установи и войди в аккаунт
3. Создай новый репозиторий
4. Скопируй все файлы в папку репозитория
5. Сделай коммит и загрузи

### 3. Или загрузи через веб-интерфейс
1. Зайди в свой репозиторий на GitHub
2. Нажми "Add file" → "Upload files"
3. Перетащи все файлы из папки проекта
4. Напиши коммит "Initial commit"
5. Нажми "Commit changes"

## 📁 Какие файлы загружать:

### Обязательные файлы:
- `package.json`
- `next.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `vercel.json`
- `README.md`
- `.gitignore`
- Папка `app/` (все файлы)
- Папка `server/` (все файлы)

### НЕ загружать:
- `node_modules/`
- `.next/`
- `.env` файлы
- `song-cache.json`

## 🔧 После загрузки:

1. **Railway (Backend):**
   - Зайди на [railway.app/dashboard](https://railway.app/dashboard)
   - "New Project" → "Deploy from GitHub repo"
   - Выбери свой репозиторий
   - Root Directory: `server`

2. **Vercel (Frontend):**
   - Зайди на [vercel.com/dashboard](https://vercel.com/dashboard)
   - "New Project" → Импортируй репозиторий
   - Framework: Next.js

## 🎯 Самый простой способ:

**Используй GitHub Desktop!** Это самый удобный способ для новичков. 