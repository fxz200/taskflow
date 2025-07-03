import {
  Ticket,
  TICKET_TYPES,
  TICKET_DEVELOP_STATUSES,
} from '@constants/ticket'
import { Button, Card, Link } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import TicketMembers from './TicketMembers'
import { useAppDispatch } from 'app/hooks'
import { putTicket } from '@api/actions/ticket'
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import SprintTicketDialog from '@components/ticket/SprintTicketDialog'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

interface TicketCardProps {
  tickets: Ticket[]
}

const TicketCards = ({ tickets }: TicketCardProps) => {
  const dispatch = useAppDispatch()
  const [expandedTickets, setExpandedTickets] = useState<{
    [key: string]: boolean
  }>({})
  const [openTicketDialog, setOpenTicketDialog] = useState<boolean>(false)
  const [editTicketData, setEditTicketData] = useState<Ticket | null>(null)

  const toggleTicket = (ticketId: string) => {
    setExpandedTickets((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }))
  }

  const sortedStatuses = Object.keys(TICKET_DEVELOP_STATUSES)
    .map(Number)
    .sort((a, b) => a - b)

  const handlePrevDevStatus = (ticket: Ticket) => {
    const currentIndex = sortedStatuses.indexOf(ticket.develop_status)
    const newStatus =
      currentIndex > 0 ? sortedStatuses[currentIndex - 1] : sortedStatuses[0]
    dispatch(
      putTicket({
        body: { ...ticket, develop_status: newStatus },
      })
    )
  }

  const handleNextDevStatus = (ticket: Ticket) => {
    const currentIndex = sortedStatuses.indexOf(ticket.develop_status)

    const newStatus =
      currentIndex < sortedStatuses.length - 1
        ? sortedStatuses[currentIndex + 1]
        : sortedStatuses[sortedStatuses.length - 1]
    dispatch(
      putTicket({
        body: { ...ticket, develop_status: newStatus },
      })
    )
  }

  useEffect(() => {
    const handleExpandAll = () => {
      setExpandedTickets((prev) => {
        // 檢查目前是否所有 tickets 都展開
        const allExpanded = tickets.every((ticket) => prev[ticket.id])
        const newState: { [key: string]: boolean } = {}
        tickets.forEach((ticket) => {
          newState[ticket.id] = !allExpanded
        })
        return newState
      })
    }
    window.addEventListener('EXPAND_ALL_TICKETS', handleExpandAll)
    return () =>
      window.removeEventListener('EXPAND_ALL_TICKETS', handleExpandAll)
  }, [tickets])

  return (
    <>
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          radius="none"
          className={`group flex items-center justify-center min-h-9 mx-4 rounded-tl-lg rounded-br-lg shadow-[2px_2px_2px_0_rgba(0,0,0,0.25)] transition transform hover:-translate-y-2 hover:border-2 hover:border-white 
                    ${expandedTickets[ticket.id] ? 'h-auto p-4' : 'h-9 px-4'}
                    ${
                      ticket.type === 1
                        ? 'bg-primary'
                        : ticket.type === 2
                        ? 'bg-[#F9AC9A]'
                        : ticket.type === 3
                        ? 'bg-[#C1E0A7]'
                        : 'bg-primary'
                    }`}
          isPressable
          onPress={() => toggleTicket(ticket.id)}
        >
          <div className="w-full h-full">
            <div className="grid grid-cols-[150px_1fr_auto] items-center w-full justify-between transition transform group-hover:-translate-y-1">
              <span className="text-start">
                {TICKET_TYPES[ticket.type]?.label}
              </span>
              <span className="flex items-start pr-2">
                <Link
                  href={ticket.jira_url}
                  color="foreground"
                  className="underline decoration-1 underline-offset-4 whitespace-normal break-all line-clamp-1"
                >
                  {ticket.title}
                </Link>
              </span>
              <div className="flex items-center justify-center">
                <Button
                  radius="full"
                  className="bg-transparent min-w-4 min-h-4 px-1 text-default-800"
                  onPress={() => {
                    setEditTicketData(ticket)
                    setOpenTicketDialog(true)
                  }}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  radius="full"
                  className="bg-transparent min-w-5 min-h-5 px-1 text-default-800"
                  onPress={() => {
                    dispatch(
                      putTicket({
                        body: { ...ticket, statement: 1, dev_status: 0 },
                      })
                    )
                  }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {expandedTickets[ticket.id] && (
              <div className="grid grid-cols-[150px_1fr_auto] gap-y-2">
                <TicketMembers
                  label="PM"
                  members={ticket.members.filter((member) => member.role === 1)}
                  className="row-start-2 col-start-2"
                />
                <TicketMembers
                  label="RD"
                  members={ticket.members.filter(
                    (member) => member.role === 2 || member.role === 3
                  )}
                  className="row-start-3 col-start-2"
                />
                <div className="col-start-2 grid grid-cols-[1fr_auto] items-center row-start-4">
                  <TicketMembers
                    label="QA"
                    members={ticket.members.filter(
                      (member) => member.role === 4
                    )}
                  />
                  <div className="flex items-center text-right text-default-800 text-xs">
                    <Button
                      isIconOnly
                      className="min-w-5 w-5 h-5 bg-transparent"
                      onPress={() => handlePrevDevStatus(ticket)}
                      disabled={ticket?.develop_status === 0}
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-default-800" />
                    </Button>
                    <span
                      className={`${ticket?.develop_status === 11 && 'text-warning-600'}
                        bg-[#fafafa]/50 px-2 py-1 rounded-md italic`}
                    >
                      {TICKET_DEVELOP_STATUSES[ticket?.develop_status]?.label}
                    </span>
                    <Button
                      isIconOnly
                      className="min-w-5 w-5 h-5 bg-transparent"
                      onPress={() => handleNextDevStatus(ticket)}
                      disabled={
                        sortedStatuses.indexOf(ticket?.develop_status) ===
                        sortedStatuses.length - 1
                      }
                    >
                      <ChevronRightIcon className="w-5 h-5 text-default-800" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
      <SprintTicketDialog
        isOpen={openTicketDialog}
        setIsOpen={setOpenTicketDialog}
        initialData={editTicketData}
      />
    </>
  )
}

export default TicketCards
