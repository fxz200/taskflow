'use client'
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup } from '@heroui/react'
import { FEATURES_LIST } from '@constants/features'
import { usePathname } from 'next/navigation'
import {
  ArrowUpTrayIcon,
  ChevronUpDownIcon,
  MoonIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import { SunIcon } from '@heroicons/react/24/solid'
import CreateEventDialog from './CreateEventDialog'
import MemberDialog from 'app/(page)/members/components/MemberDialog'
import TicketDialog from '@components/ticket/TicketDialog'
import { useAppDispatch } from 'app/hooks'
import { deleteTicket } from '@api/actions/ticket'

interface HeaderProps {
  selectedTableKeys: string[]
}

const Header = ({ selectedTableKeys }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openEventDialog, setOpenEventDialog] = useState(false)
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  const [openTicketDialog, setOpenTicketDialog] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
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
          {currentFeature?.name === 'Timeline' ||
          currentFeature?.name === 'Sprint' ? (
            <ButtonGroup>
              <Button
                isIconOnly
                color="default"
                className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
              >
                <ChevronUpDownIcon className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                color="default"
                className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
                onPress={() => setOpenEventDialog(true)}
              >
                <PlusIcon className="w-5 h-5" />
              </Button>
            </ButtonGroup>
          ) : (
            <div className="flex flex-row gap-3">
              {currentFeature?.name === 'Backlog' && (
                <Button
                  isIconOnly
                  color="default"
                  className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
                  onPress={() => {
                    dispatch(deleteTicket({ body: selectedTableKeys }))
                  }}
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              )}
              <Button
                isIconOnly
                color="default"
                className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
                onPress={() => {
                  if (currentFeature?.name === 'Backlog') {
                    setOpenTicketDialog(true)
                    return
                  } else {
                    setOpenMemberDialog(true)
                    return
                  }
                }}
              >
                <PlusIcon className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <CreateEventDialog
        isOpen={openEventDialog}
        setIsOpen={setOpenEventDialog}
      />
      <MemberDialog isOpen={openMemberDialog} setIsOpen={setOpenMemberDialog} />
      <TicketDialog isOpen={openTicketDialog} setIsOpen={setOpenTicketDialog} />
    </>
  )
}

export default Header
