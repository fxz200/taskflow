import React from 'react'
import { DatePicker, Select, SelectItem } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import FormDialog from '@components/common/FormDialog'

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
    <FormDialog
      title="新增事件"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
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
    </FormDialog>
  )
}

export default CreateEventDialog
