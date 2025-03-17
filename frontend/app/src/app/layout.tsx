import './globals.css'
import { Providers } from './providers'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col h-screen">
            <div className="h-32">
              <Header />
            </div>
            <div className="w-32 flex flex-grow h-full">
              <Sidebar />
              <div className="flex-grow">{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
