import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useAppSelector } from './useAppSelector'
import { Sprint } from '@constants/sprint'

interface SprintContextType {
  currentSprint: Sprint | null
  setCurrentSprint: (sprint: Sprint | null) => void
}

const SprintContext = createContext<SprintContextType>({
  currentSprint: null,
  setCurrentSprint: () => {},
})

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const allSprints = useAppSelector((state) => state.sprint?.sprints) || []
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null)

  const getDefaultSprint = (): Sprint | null => {
    const now = new Date()
    if (allSprints.length > 0) {
      const found = allSprints.find((sprint) => {
        const start = new Date(sprint.start_date)
        const end = new Date(sprint.end_date)
        return start <= now && now <= end
      })
      if (found) return found
    }
    return null
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