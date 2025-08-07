const fs = require('fs').promises;
const path = require('path');

class SongDatabase {
  constructor() {
    this.cache = new Map();
    this.cacheFile = path.join(__dirname, 'song-cache.json');
    this.loadCache();
  }

  // Загрузка кэша из файла
  async loadCache() {
    try {
      const data = await fs.readFile(this.cacheFile, 'utf8');
      const cacheData = JSON.parse(data);
      this.cache = new Map(cacheData);
      console.log(`Загружено ${this.cache.size} песен из кэша`);
    } catch (error) {
      console.log('Кэш не найден, создаем новый');
      this.cache = new Map();
    }
  }

  // Сохранение кэша в файл
  async saveCache() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      await fs.writeFile(this.cacheFile, JSON.stringify(cacheArray, null, 2));
      console.log(`Сохранено ${this.cache.size} песен в кэш`);
    } catch (error) {
      console.error('Ошибка сохранения кэша:', error);
    }
  }

  // Получение песни из кэша
  getSong(songId) {
    return this.cache.get(songId) || null;
  }

  // Сохранение песни в кэш
  saveSong(songId, songData) {
    this.cache.set(songId, {
      ...songData,
      cachedAt: new Date().toISOString()
    });
    
    // Автосохранение каждые 10 песен
    if (this.cache.size % 10 === 0) {
      this.saveCache();
    }
  }

  // Поиск песен в кэше
  searchInCache(query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const [songId, songData] of this.cache.entries()) {
      const titleLower = songData.title.toLowerCase();
      const artistLower = songData.artist.toLowerCase();
      
      if (titleLower.includes(queryLower) || artistLower.includes(queryLower)) {
        results.push({
          id: songId,
          title: songData.title,
          artist: songData.artist,
          source: 'cache',
          relevance: this.calculateRelevance(query, songData.title, songData.artist)
        });
      }
    }
    
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  // Расчет релевантности для кэша
  calculateRelevance(query, title, artist) {
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();
    const artistLower = artist.toLowerCase();
    
    let relevance = 0;
    
    if (titleLower.includes(queryLower)) {
      relevance += 50;
    }
    
    if (artistLower.includes(queryLower)) {
      relevance += 30;
    }
    
    const queryWords = queryLower.split(' ');
    queryWords.forEach(word => {
      if (titleLower.includes(word)) relevance += 10;
      if (artistLower.includes(word)) relevance += 5;
    });
    
    return Math.min(relevance, 100);
  }

  // Получение статистики кэша
  getStats() {
    return {
      totalSongs: this.cache.size,
      sources: this.getSourceStats(),
      recentSongs: this.getRecentSongs()
    };
  }

  // Статистика по источникам
  getSourceStats() {
    const stats = {};
    for (const songData of this.cache.values()) {
      const source = songData.source || 'unknown';
      stats[source] = (stats[source] || 0) + 1;
    }
    return stats;
  }

  // Последние добавленные песни
  getRecentSongs() {
    const songs = Array.from(this.cache.entries())
      .map(([id, data]) => ({
        id,
        title: data.title,
        artist: data.artist,
        cachedAt: data.cachedAt
      }))
      .sort((a, b) => new Date(b.cachedAt) - new Date(a.cachedAt))
      .slice(0, 10);
    
    return songs;
  }

  // Очистка старых записей (старше 30 дней)
  async cleanupOldCache() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let removedCount = 0;
    for (const [songId, songData] of this.cache.entries()) {
      if (new Date(songData.cachedAt) < thirtyDaysAgo) {
        this.cache.delete(songId);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      await this.saveCache();
      console.log(`Удалено ${removedCount} старых записей из кэша`);
    }
  }
}

module.exports = SongDatabase; 