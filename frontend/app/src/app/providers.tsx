'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

export function Providers({
  children,
  store,
}: {
  children: React.ReactNode
  store: EnhancedStore
}) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <HeroUIProvider>{children}</HeroUIProvider>
      </ThemeProvider>
    </Provider>
  )
}
