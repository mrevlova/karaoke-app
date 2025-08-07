import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Karaoke Mini App',
  description: 'Live karaoke with synchronized lyrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} twa`}>
        {children}
      </body>
    </html>
  )
} 