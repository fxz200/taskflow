import { UserIcon } from '@heroicons/react/20/solid'
import {
  BarsArrowUpIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/solid'
import { ComponentType } from 'react'

interface Feature {
  name: string
  href: string
  icon: ComponentType<any>
}

export const SprintIcon: ComponentType<any> = (props) => (
  <img src="/img/sprint.png" alt="sprint" {...props} />
)

export const FEATURES_LIST: Feature[] = [
  { name: 'Timeline', href: '/timeline', icon: CalendarIcon },
  { name: 'Backlog', href: '/backlog', icon: ClipboardDocumentListIcon },
  { name: 'Sprint', href: '/sprint', icon: SprintIcon },
  { name: 'Priority', href: '/priority', icon: BarsArrowUpIcon },
  { name: 'Members', href: '/members', icon: UserIcon },
]
