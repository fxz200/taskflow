import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import { DatePicker, DateValue } from '@heroui/react'
import { Controller } from 'react-hook-form'

interface DateFieldProps {
  control: any
  name: string
  label: string
  isRequired?: boolean
  showMonthAndYearPickers?: boolean
  hideTimeZone?: boolean
}

const DateField = ({
  control,
  name,
  label,
  isRequired,
  showMonthAndYearPickers = false,
  hideTimeZone = false,
}: DateFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DatePicker
          {...field}
          isRequired={isRequired}
          errorMessage={fieldState.error?.message}
          isInvalid={!!fieldState.error}
          endContent={
            <CalendarDaysIcon className="w-5 h-5 text-default-600 pointer-events-none flex-shrink-0" />
          }
          label={label}
          labelPlacement="outside"
          showMonthAndYearPickers={showMonthAndYearPickers}
          popoverProps={{ placement: 'bottom' }}
          hideTimeZone={hideTimeZone}
          onChange={(value) => {
              field.onChange(value as DateValue)
              field.onBlur()
            }}
          />
        )}
      />
  )
}

export default DateField
