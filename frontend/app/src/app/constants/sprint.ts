export interface Sprint {
  name: string
  start_date: string
  end_date: string
  plan_date: string
  retro_date: string
  test_date: string
}

interface eventTypes {
  id: string
  label: string
}

export const EVENT_TYPES: eventTypes[] = [
  { id: '0', label: 'Planning' },
  { id: '1', label: 'Release' },
  { id: '2', label: 'QA 進測' },
  { id: '3', label: 'Retro' },
]
