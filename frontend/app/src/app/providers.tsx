'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { SprintProvider } from './hooks/useSprint'

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
        <HeroUIProvider>
          <ToastProvider />
            <SprintProvider>
              {children}
            </SprintProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </Provider>
  )
}
