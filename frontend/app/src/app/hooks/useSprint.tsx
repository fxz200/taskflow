import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useAppSelector } from './useAppSelector'

interface SprintContextType {
  currentSprint: string
  setCurrentSprint: (sprint: string) => void
}

const SprintContext = createContext<SprintContextType>({
  currentSprint: '',
  setCurrentSprint: () => {},
})

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const allSprints = useAppSelector((state) => state.sprint?.sprints) || []
  const [currentSprint, setCurrentSprint] = useState<string>('')

  const getDefaultSprint = (): string => {
    const now = new Date()
    if (allSprints.length > 0) {
      const found = allSprints.find((sprint) => {
        const start = new Date(sprint.start_date)
        const end = new Date(sprint.end_date)
        return start <= now && now <= end
      })
      if (found) return found.name
    }
    return ''
  }

  useEffect(() => {
    setCurrentSprint(getDefaultSprint())
  }, [allSprints])

  return (
    <SprintContext.Provider value={{ currentSprint, setCurrentSprint }}>
      {children}
    </SprintContext.Provider>
  )
}

export const useSprint = () => useContext(SprintContext)