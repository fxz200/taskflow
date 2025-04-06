'use client'
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'
import store from './store'
import { Store } from 'redux'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers store={store as Store}>
          <div className="flex flex-col h-screen">
            <div className="h-40">
              <Header />
            </div>
            <div className="grid grid-cols-[auto_1fr] h-full">
              <div className="w-32">
                <Sidebar />
              </div>
              <div>{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
