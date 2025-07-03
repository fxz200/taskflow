'use client'
import { Button, Card } from '@heroui/react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import CreateSprintDialog from '@components/sprint/CreateSprintDialog'
import { getAllSprints } from '@api/actions/sprint'
import { getAllTickets } from '@api/actions/ticket'
import { useSprint } from 'app/hooks/useSprint'
import TicketCards from './components/TicketCards'

const Sprint = () => {
  const dispatch = useAppDispatch()
  const { currentSprint } = useSprint()
  const allSprints = useAppSelector((state) => state?.sprint?.sprints)
  const allTickets = useAppSelector((state) => state?.ticket?.tickets)
  const sprintTickets = allTickets.filter(
    (ticket) => ticket.statement === 2 && ticket.sprint === currentSprint?.name
  )
  const [openSprintDialog, setOpenSprintDialog] = useState<boolean>(false)

  useEffect(() => {
    if (allSprints?.length === 0) {
      dispatch(getAllSprints())
    }
    if (allTickets?.length === 0) {
      dispatch(getAllTickets())
    }
  }, [])

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
              <TicketCards sprintTickets={sprintTickets} />
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
