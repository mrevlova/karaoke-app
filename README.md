# 🎤 Karaoke App

Веб-приложение для живого караоке с синхронизированным отображением текстов песен.

## 🚀 Возможности

- **Для музыканта:** Поиск песен и отображение текста с аккордами для фортепьяно
- **Для зрителей:** Автоматическое отображение текста песни без аккордов
- **Синхронизация:** Мгновенное обновление для всех участников через WebSocket
- **Поиск:** Поддержка русских и зарубежных песен с кэшированием
- **Админ панель:** Статистика и управление кэшем

## 🛠 Технологии

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Поиск песен:** Web scraping (Musixmatch, ultra-music.ru, teksty-pesenok.ru)
- **Хостинг:** Vercel (frontend) + Railway (backend)

## 📱 Ссылки

- **Зрители:** `/audience` - отображение текста песен
- **Музыкант:** `/musician` - поиск и управление песнями
- **Админ:** `/admin` - статистика и управление

## 🔧 Установка и запуск

### Локально:

```bash
# Установка зависимостей
npm install
cd server && npm install && cd ..

# Запуск
npm run dev          # Frontend (порт 3000)
cd server && npm run dev  # Backend (порт 3001)
```

### На хостинге:

1. **Railway (Backend):** Импортируй репозиторий, укажи root directory = `server`
2. **Vercel (Frontend):** Импортируй репозиторий, выбери Next.js

## 🌐 API Endpoints

- `GET /health` - проверка состояния сервера
- `GET /current-song` - текущая песня
- `GET /stats` - статистика
- `GET /cache/stats` - статистика кэша
- `POST /cache/cleanup` - очистка кэша

## 📊 WebSocket Events

- `join-audience` - присоединение зрителя
- `join-musician` - присоединение музыканта
- `search-song` - поиск песни
- `select-song` - выбор песни
- `song-updated` - обновление песни
- `participants-updated` - обновление количества участников

## 🎵 Источники песен

- **Musixmatch** - зарубежные песни
- **ultra-music.ru** - русские песни
- **teksty-pesenok.ru** - русские песни

## 📝 TODO

- [x] Базовый функционал
- [x] WebSocket синхронизация
- [x] Поиск песен
- [x] Кэширование
- [x] Админ панель
- [ ] Реальный парсинг сайтов
- [ ] Аутентификация админа
- [ ] Больше источников песен

## 📄 Лицензия

MIT License 