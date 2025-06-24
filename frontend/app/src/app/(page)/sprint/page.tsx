'use client'
import { Button, Card, Divider } from '@heroui/react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import CreateSprintDialog from '@components/sprint/CreateSprintDialog'
import { getAllSprints } from '@api/actions/sprint'
import { getAllTickets } from '@api/actions/ticket'
import { TICKET_TYPES } from '@constants/ticket'
import { PencilIcon } from '@heroicons/react/20/solid'
import { useSprint } from 'app/hooks/useSprint'

const Sprint = () => {
  const dispatch = useAppDispatch()
  const { currentSprint } = useSprint()
  const allSprints = useAppSelector((state) => state?.sprint?.sprints)
  const allTickets = useAppSelector((state) => state?.ticket?.tickets)
  const sprintTickets = allTickets.filter((ticket) => ticket.statement === 2)
  const [openSprintDialog, setOpenSprintDialog] = useState(false)

  useEffect(() => {
    if (!allSprints || allSprints.length === 0) {
      dispatch(getAllSprints())
    }
  }, [allSprints])

  useEffect(() => {
    if (allTickets.length === 0) {
      dispatch(getAllTickets())
    }
  }, [allTickets])

  return (
    <>
      <div className="flex mr-8 h-full">
        {allSprints?.length > 0 ? (
          <Card
            radius="sm"
            className="flex flex-row items-center justify-center bg-white w-full mb-8 shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex flex-col gap-4 h-full py-4 w-[50%] overflow-y-auto">
              <p className="flex items-center justify-center">{currentSprint}</p>
              {sprintTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  radius="none"
                  className={`flex items-center justify-center min-h-9 mx-4 px-4 rounded-tl-lg rounded-br-lg font-light shadow-[2px_2px_2px_0_rgba(0,0,0,0.25)] cursor-pointer transition transform hover:-translate-y-2 hover:border-2 hover:border-white ${
                    ticket.type === 0
                      ? 'bg-primary'
                      : ticket.type === 1
                      ? 'bg-[#F9AC9A]'
                      : ticket.type === 2
                      ? 'bg-[#C1E0A7]'
                      : 'bg-primary'
                  }`}
                >
                  <div className="grid grid-cols-[100px_1fr_60px] w-full h-full gap-1 my-2 items-center justify-between">
                    <span>{TICKET_TYPES[ticket.type]?.label}</span>
                    <span>{ticket.title}</span>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        className="bg-transparent min-w-5 px-0"
                        onPress={() => {}}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Button>
                      <Button
                        className="bg-transparent min-w-5 px-0"
                        onPress={() => {}}
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="row-start-2 col-start-2 flex items-center">
                      <span>PM</span>
                      <div className="flex items-center ml-2">
                        {ticket.members
                          .filter((member) => member.role === 1)
                          .map((member, index, arr) => (
                            <div key={member.id || index}>
                              <span className="text-sm text-gray-500">
                                {member.name}
                              </span>
                              {index !== arr.length - 1 && (
                                <Divider orientation="vertical" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="row-start-3 col-start-2 flex items-center">
                      <span>RD</span>
                      <div className="flex items-center ml-2">
                        {ticket.members
                          .filter(
                            (member) => member.role === 2 || member.role === 3
                          )
                          .map((member, index, arr) => (
                            <div key={member.id || index}>
                              <span className="text-sm text-gray-500">
                                {member.name}
                              </span>
                              {index !== arr.length - 1 && (
                                <Divider orientation="vertical" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="row-start-4 col-start-2 flex items-center">
                      <span>QA</span>
                      <div className="flex items-center ml-2">
                        {ticket.members
                          .filter((member) => member.role === 4)
                          .map((member, index, arr) => (
                            <div key={member.id || index} >
                              <span className="text-sm text-gray-500">
                                {member.name}
                              </span>
                              {index !== arr.length - 1 && (
                                <Divider orientation="vertical" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="h-full w-[50%] bg-[#ececec] overflow-y-auto"></div>
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
