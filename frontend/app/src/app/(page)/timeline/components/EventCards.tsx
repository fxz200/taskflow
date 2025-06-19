import { putSprint } from '@api/actions/sprint'
import Dialog from '@components/common/Dialog'
import { Sprint } from '@constants/sprint'
import { PencilIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Button, Card } from '@heroui/react'
import { useAppDispatch } from 'app/hooks'
import { format, isSameDay } from 'date-fns'
import React, { useState } from 'react'

interface EventType {
  key: string
  label: string
  dateField: keyof Sprint
  bgColor: string
}

const eventTypes: EventType[] = [
  {
    key: 'plan',
    label: 'planning',
    dateField: 'plan_date',
    bgColor: 'bg-[#A7C4E1]',
  },
  {
    key: 'test',
    label: 'QA進測',
    dateField: 'test_date',
    bgColor: 'bg-[#F57D61]',
  },
  {
    key: 'end',
    label: 'release',
    dateField: 'end_date',
    bgColor: 'bg-[#F9AC9A]',
  },
  {
    key: 'retro',
    label: 'Retro',
    dateField: 'retro_date',
    bgColor: 'bg-[#7E94BA]',
  },
]

interface EventCardsProps {
  day: Date
  sprints: Sprint[]
}

const EventCards = ({ day, sprints }: EventCardsProps) => {
  const dispatch = useAppDispatch()
  const [selectSprint, setSelectSprint] = useState<Sprint | null>(null)
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null
  )

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteSubmit = () => {
    if (selectSprint && selectedEventType) {
      const payload = { ...selectSprint, [selectedEventType?.dateField]: '' }
      dispatch(putSprint({ body: payload })).then(() => {
        setIsDeleteDialogOpen(false)
      })
    }
  }

  const sortedCards = sprints
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((sprint) =>
      eventTypes.map((type) => {
        if (isSameDay(day, new Date(sprint[type.dateField]))) {
          return (
            <Card
              key={`${sprint.name}-${type.key}`}
              shadow="none"
              className={`${type.bgColor} w-full px-2 flex flex-row items-center`}
            >
              <div className="flex justify-center items-center w-full">
                <span>{sprint.name}</span>
                <span>&nbsp;{type.label}</span>
                {(type.key === 'plan' || type.key === 'retro') && (
                  <span>
                    &nbsp;{format(new Date(sprint[type.dateField]), 'p')}
                  </span>
                )}
              </div>
              <div className="absolute right-0 flex items-center gap-1 pr-2">
                <PencilIcon className="w-3 h-3 cursor-pointer" />
                <XMarkIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setSelectSprint(sprint)
                    setSelectedEventType(type)
                    setIsDeleteDialogOpen(true)
                  }}
                />
              </div>
            </Card>
          )
        }
        return null
      })
    )
    .filter((card) => card !== null)

  return (
    <>
      {sortedCards}
      <Dialog
        size="sm"
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSubmit={handleDeleteSubmit}
        content="確認刪除？"
      />
    </>
  )
}

export default EventCards
