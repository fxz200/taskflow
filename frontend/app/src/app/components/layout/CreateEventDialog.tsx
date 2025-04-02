import React from 'react'
import { DatePicker, Form, Select, SelectItem } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import Dialog from '@components/common/Dialog'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const eventTypes = [
  { id: '1', label: 'Planning' },
  { id: '2', label: 'QA 進測' },
  { id: '3', label: 'Retro' },
]

const CreateEventDialog = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog title="新增事件" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Form className="gap-9">
        <Select
          isRequired
          label="Type"
          labelPlacement="outside"
          defaultSelectedKeys={['1']}
        >
          {eventTypes.map((type) => (
            <SelectItem key={type.id}>{type.label}</SelectItem>
          ))}
        </Select>
        <DatePicker
          isRequired
          endContent={
            <CalendarDaysIcon className="w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Date"
          labelPlacement="outside"
          showMonthAndYearPickers
          popoverProps={{ placement: 'bottom' }}
        />
      </Form>
    </Dialog>
  )
}

export default CreateEventDialog
