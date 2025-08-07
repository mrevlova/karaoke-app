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

export default function AudiencePage() {
  const [currentSong, setCurrentSong] = useState<SongData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [participants, setParticipants] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Подключение к WebSocket серверу
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://karaoke-backend-production.up.railway.app'
        : 'http://localhost:3001')
    
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    // Слушаем обновления песни
    newSocket.on('song-updated', (songData: SongData) => {
      setCurrentSong(songData)
      setIsLoading(false)
    })

    // Слушаем количество участников
    newSocket.on('participants-updated', (count: number) => {
      setParticipants(count)
    })

    // Присоединяемся к сессии
    newSocket.emit('join-audience')

    return () => {
      newSocket.close()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка новой песни...</p>
        </div>
      </div>
    )
  }

  if (!currentSong) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🎤 Караоке</h1>
          <p className="text-gray-600 mb-4">Скоро тут появятся слова песни</p>
          <div className="text-sm text-gray-500">
            Присоединились: {participants} человек
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Заголовок */}
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">🎤 {currentSong.title}</h1>
        <p className="text-sm opacity-90">{currentSong.artist}</p>
      </div>

      {/* Текст песни */}
      <div className="p-4">
        <div className="song-text">
          {currentSong.lines.map((line, index) => (
            <div key={index} className="mb-3">
              <div className="lyrics">{line.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Статус */}
      <div className="fixed bottom-4 left-4 right-4 bg-gray-100 rounded-lg p-3">
        <div className="text-sm text-gray-600">
          Присоединились: {participants} человек
        </div>
      </div>
    </div>
  )
} 