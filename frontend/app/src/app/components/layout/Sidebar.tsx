import React from 'react'
import { Button } from '@heroui/react'
import {
  BarsArrowUpIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/16/solid'

const featuresList = [
  { name: 'timeline', href: '#', icon: CalendarIcon },
  { name: 'backlog', href: '#', icon: ClipboardDocumentListIcon },
  { name: 'sprint', href: '#', icon: PresentationChartLineIcon },
  { name: 'priority', href: '#', icon: BarsArrowUpIcon },
  { name: 'history', href: '#', icon: ClockIcon },
]

const Sidebar = () => {
  return (
    <div className={containerClassName}>
      {featuresList.map((feature) => (
        <div key={feature.name} className="relative group">
          <Button
            key={feature.name}
            isIconOnly
            radius="sm"
            className={buttonClassName}
          >
            {React.createElement(feature.icon, {
              className: iconClassName,
            })}
          </Button>
          <span className={spanClassName}>{feature.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Sidebar

const containerClassName =
  'flex flex-col gap-10 items-center justify-center w-full h-screen'
const buttonClassName =
  'bg-lightGray flex items-center p-2 w-12 h-12 transform transition-transform duration-300 hover:bg-customBlue hover:rotate-45 hover:w-14 hover:h-14'
const iconClassName = 'w-6 h-6 transition-transform group-hover:-rotate-45'
const spanClassName =
  'absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 -rotate-45 opacity-0 text-sm group-hover:opacity-100 transition-opacity duration-300'
