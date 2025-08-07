'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface SongData {
  title: string
  artist: string
  lines: Array<{
    chord?: string
    text: string
  }>
}

interface SearchResult {
  id: string
  title: string
  artist: string
  relevance: number
}

export default function MusicianPage() {
  const [currentSong, setCurrentSong] = useState<SongData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Подключение к WebSocket серверу
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://karaoke-backend-production.up.railway.app'
        : 'http://localhost:3001')
    
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    // Слушаем результаты поиска
    newSocket.on('search-results', (results: SearchResult[]) => {
      setSearchResults(results)
      setIsSearching(false)
      setError(null)
    })

    // Слушаем загрузку песни
    newSocket.on('song-loaded', (songData: SongData) => {
      setCurrentSong(songData)
      setIsLoading(false)
      setSearchResults([])
      setError(null)
    })

    // Слушаем ошибки
    newSocket.on('search-error', (errorMessage: string) => {
      setError(errorMessage)
      setIsSearching(false)
    })

    newSocket.on('song-error', (errorMessage: string) => {
      setError(errorMessage)
      setIsLoading(false)
    })

    // Присоединяемся как музыкант
    newSocket.emit('join-musician')

    return () => {
      newSocket.close()
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError('Введите название песни')
      return
    }
    
    setIsSearching(true)
    setError(null)
    socket?.emit('search-song', { query: searchQuery })
  }

  const handleSelectSong = (songId: string) => {
    setIsLoading(true)
    setError(null)
    socket?.emit('select-song', { songId })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatChord = (chord: string) => {
    const chordMap: { [key: string]: string } = {
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
    }
    
    return chordMap[chord] || chord
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">🎹 Караоке - Музыкант</h1>
      </div>

      {/* Поиск */}
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Какую песню ты хочешь сыграть?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите название песни и исполнителя..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? 'Поиск...' : '🔍'}
            </button>
          </div>
        </div>

        {/* Ошибки */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Результаты поиска */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Выберите песню:
            </h3>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectSong(result.id)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-gray-600">{result.artist}</div>
                  <div className="text-xs text-gray-400">
                    Релевантность: {result.relevance}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Текущая песня */}
        {currentSong && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Текущая песня: {currentSong.title} - {currentSong.artist}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="song-text">
                {currentSong.lines.map((line, index) => (
                  <div key={index} className="mb-3">
                    {line.chord && (
                      <div className="chord">
                        [{formatChord(line.chord)}]
                      </div>
                    )}
                    <div className="lyrics">{line.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Следующая песня */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Какую песню ты хочешь сыграть следующей?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите название песни и исполнителя..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? 'Поиск...' : '🔍'}
            </button>
          </div>
        </div>
      </div>

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Загрузка песни...</p>
          </div>
        </div>
      )}
    </div>
  )
} 