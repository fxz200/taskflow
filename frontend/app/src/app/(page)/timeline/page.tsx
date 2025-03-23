import React from 'react'
import { Card, CardBody, Divider } from '@heroui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

const days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const Timeline = () => {
  return (
    <div className="flex flex-col mr-8 gap-4">
      <div className="flex flex-col bg-primary w-full h-[448px] rounded rounded-tl-3xl rounded-br-3xl p-4 gap-4">
        <div className="flex flex-row items-end justify-between">
          <div className="flex items-center">
            <span className="text-xl font-light px-2">v2.50</span>
            <PencilSquareIcon className="w-4 h-4" />
          </div>
          <span className="text-xs">2025.02.13 - 2025.02.27</span>
        </div>

        <Card className="flex items-center w-full h-1/2 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
          <CardBody className="flex-row items-start justify-between">
            {days.map((day) => (
              <>
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
              </>
            ))}
          </CardBody>
        </Card>
        <Card className="flex items-center w-full h-1/2 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
          <CardBody className="flex-row items-start justify-between">
            {days.map((day) => (
              <>
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
              </>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Timeline
