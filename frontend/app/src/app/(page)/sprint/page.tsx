'use client'
import { Button, Card, Link } from '@heroui/react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import CreateSprintDialog from '@components/sprint/CreateSprintDialog'
import { getAllSprints } from '@api/actions/sprint'
import { getAllTickets } from '@api/actions/ticket'
import { TICKET_TYPES } from '@constants/ticket'
import { PencilIcon } from '@heroicons/react/20/solid'
import { useSprint } from 'app/hooks/useSprint'
import TicketMembers from './components/TicketMembers'

const Sprint = () => {
  const dispatch = useAppDispatch()
  const { currentSprint } = useSprint()
  const allSprints = useAppSelector((state) => state?.sprint?.sprints)
  const allTickets = useAppSelector((state) => state?.ticket?.tickets)
  const sprintTickets = allTickets.filter(
    (ticket) => ticket.statement === 2 && ticket.sprint === currentSprint?.name
  )
  const [openSprintDialog, setOpenSprintDialog] = useState(false)
  const [expandedTickets, setExpandedTickets] = useState<{
    [key: string]: boolean
  }>({})

  const toggleTicket = (ticketId: string) => {
    setExpandedTickets((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }))
  }

  useEffect(() => {
    if (allSprints?.length === 0) {
      dispatch(getAllSprints())
    }
    if (allTickets?.length === 0) {
      dispatch(getAllTickets())
    }
  }, [])

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
      <div className="flex mr-8 h-full">
        {allSprints.length > 0 ? (
          <Card
            radius="sm"
            className="flex flex-row items-center justify-center bg-white w-full mb-8 shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex flex-col gap-4 h-full py-4 w-[50%] overflow-y-auto">
              <p className="flex items-center justify-center">
                v{currentSprint?.name}
              </p>
              {sprintTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  radius="none"
                  className={`group flex items-center justify-center min-h-9 mx-4 rounded-tl-lg rounded-br-lg shadow-[2px_2px_2px_0_rgba(0,0,0,0.25)] transition transform hover:-translate-y-2 hover:border-2 hover:border-white 
                    ${expandedTickets[ticket.id] ? 'h-auto p-4' : 'h-9 px-4'}
                    ${
                      ticket.type === 0
                        ? 'bg-primary'
                        : ticket.type === 1
                        ? 'bg-[#F9AC9A]'
                        : ticket.type === 2
                        ? 'bg-[#C1E0A7]'
                        : 'bg-primary'
                    }`}
                  isPressable
                  onPress={() => toggleTicket(ticket.id)}
                >
                  <div className="w-full h-full">
                    <div className="grid grid-cols-[150px_1fr_70px] items-center w-full justify-between transition transform group-hover:-translate-y-1">
                      <span className="text-start">
                        {TICKET_TYPES[ticket.type]?.label}
                      </span>
                      <span className="text-start">
                        <Link
                          href={ticket.jira_url}
                          color='foreground'
                          className="underline decoration-1 underline-offset-4 block whitespace-normal break-all line-clamp-1"
                        >
                          {ticket.title}
                        </Link>
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          className="bg-transparent min-w-5 px-0"
                          onPress={(e) => {
                            // ;(
                            //   e as unknown as React.MouseEvent
                            // ).stopPropagation()
                          }}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                        <Button
                          className="bg-transparent min-w-5 px-0"
                          onPress={(e) => {
                            // ;(
                            //   e as unknown as React.MouseEvent
                            // ).stopPropagation()
                          }}
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    {expandedTickets[ticket.id] && (
                      <div className="grid grid-cols-[100px_1fr_60px] gap-y-2">
                        <TicketMembers
                          label="PM"
                          members={ticket.members.filter(
                            (member) => member.role === 1
                          )}
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
                          members={ticket.members.filter(
                            (member) => member.role === 4
                          )}
                          rowStart={4}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex flex-col gap-4 h-full py-4 w-[50%] bg-[#ececec] overflow-y-auto">
              <p className="flex items-center justify-center">分隔線</p>
            </div>
          </Card>
        ) : (
          <Card
            radius="sm"
            className="flex items-center justify-center bg-white rounded-tl-3xl rounded-br-3xl w-full mb-8 shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div>
              <Button
                radius="sm"
                className="flex items-center justify-center bg-primary-100 rounded-tl-3xl rounded-br-3xl h-14 w-40"
                onPress={() => setOpenSprintDialog(true)}
              >
                <PlusIcon className="w-18 h-14" />
                <p className="font-light text-xl text-black">新增時程</p>
              </Button>
            </div>
          </Card>
        )}
      </div>
      <CreateSprintDialog
        isOpen={openSprintDialog}
        setIsOpen={setOpenSprintDialog}
      />
    </>
  )
}

export default Sprint
