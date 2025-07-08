import React, { createContext, useContext, useState } from 'react'

interface SelectedTableKeysContextProps {
  selectedTableKeys: string[]
  setSelectedTableKeys: React.Dispatch<React.SetStateAction<string[]>>
}

const SelectedTableKeysContext = createContext<SelectedTableKeysContextProps>({
  selectedTableKeys: [],
  setSelectedTableKeys: () => {},
})

export const useSelectedTableKeys = () => useContext(SelectedTableKeysContext)

export const SelectedTableKeysProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTableKeys, setSelectedTableKeys] = useState<string[]>([])
  return (
    <SelectedTableKeysContext.Provider value={{ selectedTableKeys, setSelectedTableKeys }}>
      {children}
    </SelectedTableKeysContext.Provider>
  )
}