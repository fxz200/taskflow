'use client'
import React from 'react'
import { Button, Divider } from '@heroui/react'
import { featuresList } from '@constants/features'
import { usePathname } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/solid'

const Header = () => {
  const pathname = usePathname()
  const currentFeature = featuresList.find(
    (feature) => feature.href === pathname
  )

  return (
    <div className="flex flex-col justify-end w-full h-full text-black">
      <div className="flex justify-between items-center px-8">
        <span className="text-xl">{currentFeature?.name}</span>
        <Button isIconOnly className='flex items-center bg-lightGray hover:bg-lightBlue'>
          <PlusIcon className='w-4 h-4' />
        </Button>
      </div>
      <Divider className="bg-black/40 w-52" />
    </div>
  )
}

export default Header
