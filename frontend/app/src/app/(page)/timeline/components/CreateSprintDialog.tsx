import React from 'react'
import { DatePicker, Input } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import FormDialog from '@components/common/FormDialog'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CreateSprintDialog = ({ isOpen, setIsOpen }: Props) => {
  return (
    <FormDialog
      title="新增時程"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Input
        isRequired
        errorMessage="Please enter a sprint version"
        label="Sprint"
        labelPlacement="outside"
        name="sprint"
        placeholder="2.55 (sprint version)"
        type="text"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-small text-default-400">v</span>
          </div>
        }
      />
      <div className="flex flex-row w-full gap-6">
        <DatePicker
          isRequired
          endContent={
            <CalendarDaysIcon className="w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Start Date"
          labelPlacement="outside"
          showMonthAndYearPickers
          popoverProps={{ placement: 'bottom' }}
        />
        <DatePicker
          isRequired
          endContent={
            <CalendarDaysIcon className="w-5 h-5 text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="End Date"
          labelPlacement="outside"
          showMonthAndYearPickers
        />
      </div>
    </FormDialog>
  )
}

export default CreateSprintDialog
