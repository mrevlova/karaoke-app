'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // По умолчанию перенаправляем на страницу аудитории
    router.push('/audience')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">🎤 Караоке</h1>
        <p className="text-gray-600">Перенаправление...</p>
      </div>
    </div>
  )
} 