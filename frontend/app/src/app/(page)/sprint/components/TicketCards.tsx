import {
  Ticket,
  TICKET_TYPES,
  TIKCET_DEVELOP_STATUSES,
} from '@constants/ticket'
import { Button, Card, Link } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import TicketMembers from './TicketMembers'
import { useAppDispatch } from 'app/hooks'
import { putTicket } from '@api/actions/ticket'
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import SprintTicketDialog from '@components/ticket/SprintTicketDialog'

interface TicketCardProps {
  sprintTickets: Ticket[]
}

const TicketCards = ({ sprintTickets }: TicketCardProps) => {
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

  useEffect(() => {
    const handleExpandAll = () => {
      setExpandedTickets((prev) => {
        // 檢查目前是否所有 tickets 都展開
        const allExpanded = sprintTickets.every((ticket) => prev[ticket.id])
        const newState: { [key: string]: boolean } = {}
        sprintTickets.forEach((ticket) => {
          newState[ticket.id] = !allExpanded
        })
        return newState
      })
    }
    window.addEventListener('EXPAND_ALL_TICKETS', handleExpandAll)
    return () =>
      window.removeEventListener('EXPAND_ALL_TICKETS', handleExpandAll)
  }, [sprintTickets])

  return (
    <>
      {sprintTickets.map((ticket) => (
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
                  rowStart={2}
                />
                <TicketMembers
                  label="RD"
                  members={ticket.members.filter(
                    (member) => member.role === 2 || member.role === 3
                  )}
                  rowStart={3}
                />
                <TicketMembers
                  label="QA"
                  members={ticket.members.filter((member) => member.role === 4)}
                  rowStart={4}
                />
                <span className="col-start-3 row-start-4 text-right text-default-800">
                  {TIKCET_DEVELOP_STATUSES[ticket.develop_status]?.label}
                </span>
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
