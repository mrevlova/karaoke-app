'use client'

import { useState, useEffect } from 'react'

interface Stats {
  participants: number
  hasMusician: boolean
  currentSong: {
    title: string
    artist: string
    linesCount: number
  } | null
  cache: {
    totalSongs: number
    sources: { [key: string]: number }
    recentSongs: Array<{
      id: string
      title: string
      artist: string
      cachedAt: string
    }>
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Обновляем каждые 5 секунд
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/stats')
      if (!response.ok) throw new Error('Ошибка загрузки статистики')
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Не удалось загрузить статистику')
      console.error('Ошибка загрузки статистики:', err)
    } finally {
      setLoading(false)
    }
  }

  const cleanupCache = async () => {
    try {
      const response = await fetch('http://localhost:3001/cache/cleanup', {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Ошибка очистки кэша')
      await fetchStats() // Обновляем статистику
    } catch (err) {
      setError('Не удалось очистить кэш')
      console.error('Ошибка очистки кэша:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">🔧 Админ панель</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Текущее состояние */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Текущее состояние</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.participants}</div>
              <div className="text-sm text-gray-600">Участников</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.hasMusician ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Музыкант подключен</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.cache.totalSongs}
              </div>
              <div className="text-sm text-gray-600">Песен в кэше</div>
            </div>
          </div>
        </div>

        {/* Текущая песня */}
        {stats.currentSong && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">🎵 Текущая песня</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium">{stats.currentSong.title}</div>
              <div className="text-sm text-gray-600">{stats.currentSong.artist}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.currentSong.linesCount} строк
              </div>
            </div>
          </div>
        )}

        {/* Статистика кэша */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">💾 Кэш песен</h2>
            <button
              onClick={cleanupCache}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Очистить старые
            </button>
          </div>
          
          {/* Источники */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">По источникам:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(stats.cache.sources).map(([source, count]) => (
                <div key={source} className="bg-gray-50 rounded p-2 text-center">
                  <div className="font-medium">{count}</div>
                  <div className="text-xs text-gray-600">{source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Последние песни */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Последние добавленные:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {stats.cache.recentSongs.map((song) => (
                <div key={song.id} className="bg-gray-50 rounded p-3">
                  <div className="font-medium text-sm">{song.title}</div>
                  <div className="text-xs text-gray-600">{song.artist}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(song.cachedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">⚡ Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={fetchStats}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              🔄 Обновить статистику
            </button>
            <button
              onClick={cleanupCache}
              className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              🗑️ Очистить кэш
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 