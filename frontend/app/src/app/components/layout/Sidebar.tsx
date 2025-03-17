import React from 'react'
import { Button, Link } from '@heroui/react'
import { featuresList } from '@constants/features'

const Sidebar: React.FC = () => {
  return (
    <div className={containerClassName}>
      {featuresList.map((feature) => (
        <div key={feature.name} className="relative group">
          <Button
            key={feature.name}
            isIconOnly
            as={Link}
            radius="sm"
            href={feature.href}
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

const containerClassName = 'flex flex-col gap-10 items-center w-full pt-28'
const buttonClassName =
  'bg-lightGray flex items-center p-2 w-12 h-12 transform transition-transform duration-300 group-hover:bg-lightBlue group-hover:rotate-45 group-hover:w-14 group-hover:h-14'
const iconClassName = 'w-6 h-6 transition-transform group-hover:-rotate-45'
const spanClassName =
  'absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 -rotate-45 opacity-0 text-sm group-hover:opacity-100 transition-opacity duration-300'
