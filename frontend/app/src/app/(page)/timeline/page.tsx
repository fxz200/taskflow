'use client'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Divider } from '@heroui/react'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import CreateSprintDialog from './components/CreateSprintDialog'
import { useDispatch } from 'react-redux'
import { getAllSprints, getSprint } from '@api/actions/sprint'
import { AppDispatch } from 'app/store'

const days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const Timeline = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    dispatch(getAllSprints()).then((res) => {
      console.log(res)
    })
  }, [])

  return (
    <>
      {/* <div className="flex mr-8 h-full">
        <Card radius="sm" className="flex items-center justify-center bg-primary/60 dark:bg-primary/90 rounded-tl-3xl rounded-br-3xl w-full mb-8 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
          <Button
            radius="sm"
            className="flex flex-col items-center justify-center bg-white/90 rounded-tl-3xl rounded-br-3xl h-36 w-60 border-dashed border-2 border-primary"
            onPress={() => setOpenDialog(true)}
          >
            <div>
              <PlusIcon className="w-18 h-14" />
            </div>

            <p className="font-light text-xl text-black">新增時程</p>
          </Button>
        </Card>
      </div> */}
      <div className="flex flex-col mr-8 gap-4">
        <Card
          radius="sm"
          shadow="none"
          className="flex flex-col bg-primary w-full h-[464px] rounded-tl-3xl rounded-br-3xl p-4 gap-4"
        >
          <div className="flex flex-row items-end justify-between">
            <div className="flex items-center">
              <span className="text-xl font-light px-2">v2.50</span>
              <Button
                isIconOnly
                className="bg-transparent min-h-4 min-w-4 h-4 w-4"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-xs">2025.02.13 - 2025.02.27</span>
          </div>
          <div className="flex flex-col gap-6 h-full pb-2">
            <Card className="flex items-center w-full h-1/2 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
              <CardBody className="flex-row items-start justify-between">
                {days.map((day, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center justify-center w-full">
                      <div>
                        <span className="">{day}</span>
                        <span className="text-xs text-lightgray font-light px-1">
                          2/12
                        </span>
                      </div>
                      <div className="flex-col gap-1"></div>
                    </div>
                    {day !== days?.at(-1) && (
                      <Divider
                        orientation="vertical"
                        className="bg-black/40 h-4/5 mt-auto"
                      />
                    )}
                  </React.Fragment>
                ))}
              </CardBody>
            </Card>
            <Card className="flex items-center w-full h-1/2 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
              <CardBody className="flex-row items-start justify-between">
                {days.map((day, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center justify-center w-full">
                      <div>
                        <span className="">{day}</span>
                        <span className="text-xs text-lightgray font-light px-1">
                          2/12
                        </span>
                      </div>
                      <div className="flex-col gap-1"></div>
                    </div>
                    {day !== days?.at(-1) && (
                      <Divider
                        orientation="vertical"
                        className="bg-black/40 h-4/5 mt-auto"
                      />
                    )}
                  </React.Fragment>
                ))}
              </CardBody>
            </Card>
          </div>
        </Card>
        <Button
          radius="md"
          className="w-full bg-primary/60"
          onPress={() => setOpenDialog(true)}
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>
      <CreateSprintDialog isOpen={openDialog} setIsOpen={setOpenDialog} />
    </>
  )
}

export default Timeline
