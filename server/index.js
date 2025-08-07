const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { searchSongs, getSongLyrics } = require('./songSearcher');
const SongDatabase = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Инициализация базы данных
const db = new SongDatabase();

// Состояние приложения
let currentSong = null;
let participants = 0;
let audienceSockets = new Set();
let musicianSocket = null;

// WebSocket обработчики
io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);

  socket.on('join-audience', () => {
    audienceSockets.add(socket);
    participants = audienceSockets.size;
    
    // Отправляем текущую песню новому участнику
    if (currentSong) {
      socket.emit('song-updated', currentSong);
    }
    
    // Обновляем количество участников
    io.emit('participants-updated', participants);
    console.log('Участник присоединился. Всего:', participants);
  });

  socket.on('join-musician', () => {
    musicianSocket = socket;
    console.log('Музыкант присоединился');
  });

  socket.on('search-song', async (data) => {
    try {
      console.log('Поиск песни:', data.query);
      
      if (!data.query || data.query.trim().length < 2) {
        socket.emit('search-error', 'Введите минимум 2 символа для поиска');
        return;
      }
      
      // Сначала ищем в кэше
      const cacheResults = db.searchInCache(data.query);
      
      // Затем ищем в интернете
      const internetResults = await searchSongs(data.query);
      
      // Объединяем результаты, кэш имеет приоритет
      const allResults = [...cacheResults, ...internetResults];
      
      if (allResults.length === 0) {
        socket.emit('search-error', 'Песни не найдены. Попробуйте другое название');
        return;
      }
      
      socket.emit('search-results', allResults);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      socket.emit('search-error', 'Ошибка поиска. Попробуйте позже');
    }
  });

  socket.on('select-song', async (data) => {
    try {
      console.log('Выбор песни:', data.songId);
      
      if (!data.songId) {
        socket.emit('song-error', 'Неверный ID песни');
        return;
      }
      
      // Сначала проверяем кэш
      let songData = db.getSong(data.songId);
      
      if (!songData) {
        // Если нет в кэше, загружаем из интернета
        songData = await getSongLyrics(data.songId);
        
        // Сохраняем в кэш
        if (songData) {
          db.saveSong(data.songId, songData);
        }
      }
      
      if (!songData || !songData.title) {
        socket.emit('song-error', 'Не удалось загрузить песню');
        return;
      }
      
      currentSong = songData;
      
      // Отправляем песню всем участникам
      io.emit('song-updated', currentSong);
      
      // Отправляем подтверждение музыканту
      socket.emit('song-loaded', currentSong);
      
      console.log('Песня загружена:', currentSong.title);
    } catch (error) {
      console.error('Ошибка загрузки песни:', error);
      socket.emit('song-error', 'Ошибка загрузки песни. Попробуйте другую песню');
    }
  });

  socket.on('disconnect', () => {
    if (audienceSockets.has(socket)) {
      audienceSockets.delete(socket);
      participants = audienceSockets.size;
      io.emit('participants-updated', participants);
      console.log('Участник отключился. Всего:', participants);
    }
    
    if (musicianSocket === socket) {
      musicianSocket = null;
      console.log('Музыкант отключился');
    }
  });
});

// API endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    participants,
    currentSong: currentSong ? {
      title: currentSong.title,
      artist: currentSong.artist
    } : null
  });
});

app.get('/current-song', (req, res) => {
  res.json(currentSong);
});

app.get('/stats', (req, res) => {
  const dbStats = db.getStats();
  res.json({
    participants,
    hasMusician: musicianSocket !== null,
    currentSong: currentSong ? {
      title: currentSong.title,
      artist: currentSong.artist,
      linesCount: currentSong.lines.length
    } : null,
    cache: dbStats
  });
});

app.get('/cache/stats', (req, res) => {
  res.json(db.getStats());
});

app.post('/cache/cleanup', async (req, res) => {
  try {
    await db.cleanupOldCache();
    res.json({ success: true, message: 'Кэш очищен' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Stats: http://localhost:${PORT}/stats`);
  console.log(`Cache stats: http://localhost:${PORT}/cache/stats`);
}); 