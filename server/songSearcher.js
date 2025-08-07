const axios = require('axios');
const cheerio = require('cheerio');

// Кэш для найденных песен
const songCache = new Map();

// Поиск песен по запросу
async function searchSongs(query) {
  try {
    console.log('Поиск песен для запроса:', query);
    
    // Проверяем кэш
    const cacheKey = query.toLowerCase().trim();
    if (songCache.has(cacheKey)) {
      return songCache.get(cacheKey);
    }

    const results = [];
    
    // Поиск на Musixmatch (зарубежные песни)
    const musixmatchResults = await searchMusixmatch(query);
    results.push(...musixmatchResults);
    
    // Поиск на русских сайтах
    const russianResults = await searchRussianSites(query);
    results.push(...russianResults);
    
    // Сортируем по релевантности
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Ограничиваем количество результатов
    const limitedResults = results.slice(0, 10);
    
    // Сохраняем в кэш
    songCache.set(cacheKey, limitedResults);
    
    return limitedResults;
  } catch (error) {
    console.error('Ошибка поиска песен:', error);
    return [];
  }
}

// Поиск на Musixmatch
async function searchMusixmatch(query) {
  try {
    // Используем поиск через веб-интерфейс Musixmatch
    const searchUrl = `https://www.musixmatch.com/search/${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const results = [];
    
    // Парсим результаты поиска
    $('.track-card').each((index, element) => {
      if (index < 5) {
        const title = $(element).find('.track-card-title').text().trim();
        const artist = $(element).find('.track-card-artist').text().trim();
        const url = $(element).find('a').attr('href');
        
        if (title && artist) {
          results.push({
            id: `musixmatch_${index}`,
            title,
            artist,
            url: `https://www.musixmatch.com${url}`,
            source: 'musixmatch',
            relevance: calculateRelevance(query, title, artist)
          });
        }
      }
    });
    
    return results;
  } catch (error) {
    console.error('Ошибка поиска на Musixmatch:', error);
    return [];
  }
}

// Поиск на русских сайтах
async function searchRussianSites(query) {
  try {
    // Поиск на ultra-music.ru
    const ultraResults = await searchUltraMusic(query);
    
    // Поиск на teksty-pesenok.ru
    const tekstyResults = await searchTekstyPesenok(query);
    
    return [...ultraResults, ...tekstyResults];
  } catch (error) {
    console.error('Ошибка поиска на русских сайтах:', error);
    return [];
  }
}

// Поиск на ultra-music.ru
async function searchUltraMusic(query) {
  try {
    const searchUrl = `https://ultra-music.ru/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const results = [];
    
    $('.search-result').each((index, element) => {
      if (index < 5) {
        const title = $(element).find('.song-title').text().trim();
        const artist = $(element).find('.artist-name').text().trim();
        const url = $(element).find('a').attr('href');
        
        if (title && artist) {
          results.push({
            id: `ultra_${index}`,
            title,
            artist,
            url: `https://ultra-music.ru${url}`,
            source: 'ultra-music',
            relevance: calculateRelevance(query, title, artist)
          });
        }
      }
    });
    
    return results;
  } catch (error) {
    console.error('Ошибка поиска на ultra-music:', error);
    return [];
  }
}

// Поиск на teksty-pesenok.ru
async function searchTekstyPesenok(query) {
  try {
    const searchUrl = `https://teksty-pesenok.ru/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const results = [];
    
    $('.search-item').each((index, element) => {
      if (index < 5) {
        const title = $(element).find('.song-name').text().trim();
        const artist = $(element).find('.artist-name').text().trim();
        const url = $(element).find('a').attr('href');
        
        if (title && artist) {
          results.push({
            id: `teksty_${index}`,
            title,
            artist,
            url: `https://teksty-pesenok.ru${url}`,
            source: 'teksty-pesenok',
            relevance: calculateRelevance(query, title, artist)
          });
        }
      }
    });
    
    return results;
  } catch (error) {
    console.error('Ошибка поиска на teksty-pesenok:', error);
    return [];
  }
}

// Получение текста песни
async function getSongLyrics(songId) {
  try {
    console.log('Загрузка текста песни:', songId);
    
    // Парсим ID для определения источника
    const [source, index] = songId.split('_');
    
    let songData;
    
    switch (source) {
      case 'musixmatch':
        songData = await getMusixmatchLyrics(songId);
        break;
      case 'ultra':
        songData = await getUltraMusicLyrics(songId);
        break;
      case 'teksty':
        songData = await getTekstyPesenokLyrics(songId);
        break;
      default:
        throw new Error('Неизвестный источник');
    }
    
    return songData;
  } catch (error) {
    console.error('Ошибка загрузки текста песни:', error);
    throw error;
  }
}

// Загрузка текста с Musixmatch
async function getMusixmatchLyrics(songId) {
  try {
    // Пока возвращаем улучшенную заглушку с более сложными аккордами
    return {
      title: "Yesterday",
      artist: "The Beatles",
      lines: [
        { chord: "Am7", text: "Yesterday, all my" },
        { chord: null, text: "troubles seemed so far" },
        { chord: null, text: "away" },
        { chord: "Fmaj7", text: "Now it looks as though" },
        { chord: null, text: "they're here to stay" },
        { chord: "C/G", text: "Oh, I believe in" },
        { chord: null, text: "yesterday" },
        { chord: "Dm7", text: "Suddenly, I'm not" },
        { chord: null, text: "half the man I used to be" },
        { chord: "G7", text: "There's a shadow hanging" },
        { chord: null, text: "over me" }
      ]
    };
  } catch (error) {
    console.error('Ошибка загрузки с Musixmatch:', error);
    throw error;
  }
}

// Загрузка текста с ultra-music.ru
async function getUltraMusicLyrics(songId) {
  try {
    // Улучшенная заглушка для русских песен с фортепьянными аккордами
    return {
      title: "Подмосковные вечера",
      artist: "М. Матусовский",
      lines: [
        { chord: "Am7", text: "Не слышны в саду даже шорохи" },
        { chord: "Dm7", text: "Все здесь замерло до утра" },
        { chord: "G7", text: "Если б знали вы, как мне дороги" },
        { chord: "Cmaj7", text: "Подмосковные вечера" },
        { chord: "F#m7b5", text: "Речка движется и не движется" },
        { chord: null, text: "Вся из лунного серебра" },
        { chord: "B7", text: "Песня слышится и не слышится" },
        { chord: "Em7", text: "В эти тихие вечера" }
      ]
    };
  } catch (error) {
    console.error('Ошибка загрузки с ultra-music:', error);
    throw error;
  }
}

// Загрузка текста с teksty-pesenok.ru
async function getTekstyPesenokLyrics(songId) {
  try {
    // Улучшенная заглушка
    return {
      title: "Катюша",
      artist: "М. Блантер",
      lines: [
        { chord: "Cmaj7", text: "Расцветали яблони и груши" },
        { chord: "F7", text: "Поплыли туманы над рекой" },
        { chord: "G7", text: "Выходила на берег Катюша" },
        { chord: "Cmaj7", text: "На высокий берег на крутой" },
        { chord: "Am7", text: "Выходила, песню заводила" },
        { chord: "Dm7", text: "Про степного сизого орла" },
        { chord: "G7", text: "Про того, которого любила" },
        { chord: "Cmaj7", text: "Про того, чьи письма берегла" }
      ]
    };
  } catch (error) {
    console.error('Ошибка загрузки с teksty-pesenok:', error);
    throw error;
  }
}

// Расчет релевантности
function calculateRelevance(query, title, artist) {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const artistLower = artist.toLowerCase();
  
  let relevance = 0;
  
  // Точное совпадение названия
  if (titleLower.includes(queryLower)) {
    relevance += 50;
  }
  
  // Точное совпадение исполнителя
  if (artistLower.includes(queryLower)) {
    relevance += 30;
  }
  
  // Частичное совпадение
  const queryWords = queryLower.split(' ');
  queryWords.forEach(word => {
    if (titleLower.includes(word)) relevance += 10;
    if (artistLower.includes(word)) relevance += 5;
  });
  
  return Math.min(relevance, 100);
}

// Форматирование аккордов для фортепьяно
function formatPianoChord(chord) {
  if (!chord) return null;
  
  const chordMap = {
    'C': 'C major',
    'Cm': 'C minor',
    'C7': 'C dominant 7',
    'Cmaj7': 'C major 7',
    'Cm7': 'C minor 7',
    'Am': 'A minor',
    'Am7': 'A minor 7',
    'F': 'F major',
    'Fmaj7': 'F major 7',
    'G': 'G major',
    'G7': 'G dominant 7',
    'Dm': 'D minor',
    'Dm7': 'D minor 7',
    'Em': 'E minor',
    'Em7': 'E minor 7',
    'B7': 'B dominant 7',
    'F#m7b5': 'F# half-diminished 7'
  };
  
  return chordMap[chord] || chord;
}

module.exports = {
  searchSongs,
  getSongLyrics,
  formatPianoChord
}; 