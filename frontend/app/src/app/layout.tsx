// import type { Metadata } from "next";
// import localFont from "next/font/local";
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@components/layout/Sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="">
        <Providers>
        <div className='w-32 flex items-center justify-center'>
          <Sidebar />
        </div>
        <div className="flex-grow">
          {children}
        </div>
        </Providers>
      </body>
    </html>
  )
}
