import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { OfflineIndicator } from "@/components/offline-indicator"
import { RegisterServiceWorker } from "./register-sw"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "SAR Educational Complex | School Management System",
  description: "Modern school management system for SAR Educational Complex - Nurturing Minds And Hearts",
  generator: "v0.app",
  keywords: ["school management", "education", "Ghana", "SAR Educational Complex", "Kumasi"],
  authors: [{ name: "SAR Educational Complex" }],
  manifest: "/manifest.json",
  themeColor: "#E31E24",
  icons: {
    icon: [
      { url: "/logo-transparent.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo-transparent.svg",
    shortcut: "/logo-transparent.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SAR EDU",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <RegisterServiceWorker />
        <OfflineIndicator />
        <PWAInstallPrompt />
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
            },
            className: 'shadow-lg',
          }}
          richColors
        />
        <Analytics />
      </body>
    </html>
  )
}
