import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Odyssage - 未知を辿る、非同期型ゲームブック風TRPG",
  description: "シナリオを作成・管理し、プレイヤーが自由に物語を進められるサイト",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-stone-100 text-stone-800 min-h-screen`}>
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'