'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { FEATURES_LIST } from '@constants/features'
import { usePathname } from 'next/navigation'
import {
  ArrowUpTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
} from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import { SunIcon } from '@heroicons/react/24/solid'
import TimelineButton from './header/TimelineButton'
import TicketButton from './header/TicketButton'
import MemberButton from './header/MemberButton'
import SprintButton from './header/SprintButton'
import { useAppSelector } from 'app/hooks'
import { useSprint } from 'app/hooks/useSprint'

interface HeaderProps {
  selectedTableKeys: string[]
}

const Header = ({ selectedTableKeys }: HeaderProps) => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { setCurrentSprint } = useSprint()
  const allSprints = useAppSelector((state) => state.sprint?.sprints) || []
  const [mounted, setMounted] = useState(false)
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0)
  const currentSprintName = allSprints[currentSprintIndex]?.name || ''
  const currentFeature = mounted
    ? FEATURES_LIST.find((feature) => feature.href === pathname)
    : null

  const handlePrevSprint = () => {
    setCurrentSprintIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextSprint = () => {
    setCurrentSprintIndex((prev) =>
      prev < allSprints.length - 1 ? prev + 1 : prev
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (allSprints.length > 0) {
      const now = new Date()
      const index = allSprints.findIndex((sprint) => {
        const start = new Date(sprint.start_date)
        const end = new Date(sprint.end_date)
        return start <= now && now <= end
      })
      setCurrentSprintIndex(index !== -1 ? index : 0)
    }
  }, [allSprints])

  useEffect(() => {
    setCurrentSprint(allSprints[currentSprintIndex] || null)
  }, [allSprints, currentSprintIndex])

  if (!mounted) return null

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex justify-between items-center p-4 px-8">
          <img
            src={theme === 'light' ? '/img/logo.png' : '/img/logo_dark.png'}
            alt="Logo"
            className="w-6 h-6"
          />
          <div>
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
        </div>
        <div className="flex justify-between items-center px-8 my-2">
          {currentFeature?.name === 'Sprint' ? (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="w-7 h-7 bg-transparent"
                onPress={handlePrevSprint}
                disabled={currentSprintIndex === 0}
              >
                <ChevronLeftIcon className="w-6 h-6 cursor-pointer" />
              </Button>

              <span className="text-xl">{currentSprintName}</span>
              <Button
                isIconOnly
                className="w-7 h-7 bg-transparent"
                onPress={handleNextSprint}
                disabled={currentSprintIndex === allSprints.length - 1}
              >
                <ChevronRightIcon className="w-6 h-6 cursor-pointer" />
              </Button>
            </div>
          ) : (
            <span className="text-xl">{currentFeature?.name}</span>
          )}
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
