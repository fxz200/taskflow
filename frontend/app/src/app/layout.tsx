'use client'
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'
import store from './store'
import { Store } from 'redux'
import { cloneElement, useState } from 'react'
import Footer from '@components/layout/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [selectedTableKeys, setSelectedTableKeys] = useState<string[]>([])

  const childrenWithProps = cloneElement(children as React.ReactElement, {
    selectedTableKeys,
    setSelectedTableKeys,
  })

  return (
    <html lang="en">
      <body>
        <Providers store={store as Store}>
          <div className="flex flex-col h-screen">
            <div className="h-40">
              <Header selectedTableKeys={selectedTableKeys} />
            </div>
            <div className="grid grid-cols-[auto_1fr] h-[calc(100%-8px)]">
              <div className="w-32">
                <Sidebar />
              </div>
              <div>{childrenWithProps}</div>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
