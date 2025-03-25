import { UserIcon } from '@heroicons/react/20/solid'
import {
  BarsArrowUpIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/solid'

interface Feature {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const featuresList: Feature[] = [
  { name: 'Timeline', href: '/timeline', icon: CalendarIcon },
  { name: 'Backlog', href: '/backlog', icon: ClipboardDocumentListIcon },
  { name: 'Sprint', href: '/sprint', icon: PresentationChartLineIcon },
  { name: 'Priority', href: '/priority', icon: BarsArrowUpIcon },
  { name: 'Member', href: '/member', icon: UserIcon },
]