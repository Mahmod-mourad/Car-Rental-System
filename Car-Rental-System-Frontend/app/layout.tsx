import type React from "react"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { initializeLocalStorage } from "@/lib/local-storage"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "تأجير السيارات - Car Rental",
  description: "أفضل خدمة تأجير السيارات في المنطقة - Best car rental service in the region",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initialize localStorage on client side
  if (typeof window !== "undefined") {
    initializeLocalStorage()
  }

  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-cairo antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
