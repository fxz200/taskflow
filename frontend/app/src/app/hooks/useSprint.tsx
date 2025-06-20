import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SprintContextType {
  currentSprint: string
  setCurrentSprint: (sprint: string) => void
}

const SprintContext = createContext<SprintContextType>({
  currentSprint: 'Sprint',
  setCurrentSprint: () => {},
})

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const [currentSprint, setCurrentSprint] = useState('Sprint')

  return (
    <SprintContext.Provider value={{ currentSprint, setCurrentSprint }}>
      {children}
    </SprintContext.Provider>
  )
}

export const useSprint = () => useContext(SprintContext)