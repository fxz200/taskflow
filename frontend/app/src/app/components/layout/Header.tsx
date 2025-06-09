'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { FEATURES_LIST } from '@constants/features'
import { usePathname } from 'next/navigation'
import { ArrowUpTrayIcon, MoonIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import { SunIcon } from '@heroicons/react/24/solid'
import TimelineButton from './header/TimelineButton'
import TicketButton from './header/TicketButton'
import MemberButton from './header/MemberButton'
import SprintButton from './header/SprintButton'

interface HeaderProps {
  selectedTableKeys: string[]
}

const Header = ({ selectedTableKeys }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const currentFeature = mounted
    ? FEATURES_LIST.find((feature) => feature.href === pathname)
    : null

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex justify-end items-center p-4 px-8">
          <Button
            isIconOnly
            color="default"
            radius="sm"
            className="min-w-7 w-7 h-7 data-[hover=true]:!opacity-100 hover:bg-primary mr-2"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            color="default"
            radius="sm"
            className="min-w-7 w-7 h-7 data-[hover=true]:!opacity-100 hover:bg-primary"
            onPress={() =>
              setTheme((prevTheme) =>
                prevTheme === 'light' ? 'dark' : 'light'
              )
            }
          >
            {mounted && theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center px-8 my-2">
          <span className="text-xl">{currentFeature?.name}</span>
          {currentFeature?.name === 'Timeline' && <TimelineButton />}
          {(currentFeature?.name === 'Backlog' ||
            currentFeature?.name === 'Priority') && (
            <TicketButton selectedTableKeys={selectedTableKeys} />
          )}
          {currentFeature?.name === 'Members' && <MemberButton />}
          {currentFeature?.name === 'Sprint' && <SprintButton />}
        </div>
      </div>
    </>
  )
}

export default Header
