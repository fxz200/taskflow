import React from 'react'
import Dialog from './Dialog'
import { DatePicker, Form, Input } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SprintDialog = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog title="新增時程" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Form className="gap-9">
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
      </Form>
    </Dialog>
  )
}

export default SprintDialog
