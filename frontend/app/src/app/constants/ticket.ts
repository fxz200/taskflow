import { Member } from './member'

export interface Ticket {
  id: string
  type: number
  priority: number
  title: string
  statement: number
  status: number
  sprint: string
  jira_url: string
  summary: string
  note: string
  members: Member[]
}

interface TableColumns {
  key: string
  label: string
}

export const TABLE_COLUMNS: TableColumns[] = [
  { key: 'status', label: '狀態' },
  { key: 'type', label: '類型' },
  { key: 'name', label: '名稱' },
  { key: 'priority', label: '優先分數' },
  { key: 'release', label: 'Release' },
  { key: 'assignee', label: '負責人' },
  { key: 'actions', label: '' },
]

export const TICKET_TYPES: Record<number, { label: string }> = {
  0: { label: 'Feature' },
  1: { label: 'Bug' },
  2: { label: 'Improvement' },
  3: { label: 'Story' },
  4: { label: 'Task' },
  5: { label: 'Epic' },
}

export const TICKET_STATEMENTS: Record<number, { label: string }> = {
  0: { label: 'pending' },
  1: { label: '排進 priority' },
  2: { label: '排進 sprint' },
}

export const TICKET_STATUSES: Record<number, { label: string }> = {
  0: { label: 'not in piority' },
  1: { label: '待處理' },
  2: { label: '進行中' },
  3: { label: '已完成' },
}

export const TICKET_PRIORITIES: Record<number, { label: string }> = {
  0: { label: 'P0' },
  1: { label: 'P1' },
  2: { label: 'P2' },
  3: { label: 'P3' },
  4: { label: 'P4' },
}