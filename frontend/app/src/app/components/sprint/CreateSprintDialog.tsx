import React from 'react'
import { DatePicker, DateValue, Input } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import FormDialog from '@components/common/FormDialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAppDispatch } from 'app/hooks'
import { CalendarDate } from '@internationalized/date'
import { postSprint } from '@api/actions/sprint'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Schema = z.object({
  name: z.string().nonempty({ message: 'Please enter a sprint name' }),
  start_date: z.custom<DateValue>((val) => val instanceof CalendarDate, {
    message: 'Please select a start date',
  }),
  end_date: z.custom<DateValue>((val) => val instanceof CalendarDate, {
    message: 'Please select an end date',
  }),
})

type SchemaType = z.infer<typeof Schema>

const CreateSprintDialog = ({ isOpen, setIsOpen }: Props) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: '',
      start_date: undefined,
      end_date: undefined,
    },
  })

  const onSubmit = (data: SchemaType) => {
    const startISOString = new Date(
      data.start_date.year,
      data.start_date.month - 1,
      data.start_date.day
    ).toISOString()

    const endISOString = new Date(
      data.end_date.year,
      data.end_date.month - 1,
      data.end_date.day
    ).toISOString()

    const payload = {
      ...data,
      start_date: startISOString,
      end_date: endISOString,
    }
    dispatch(postSprint({ body: payload })).then(() => {
      onClose()
    })
  }

  const onClose = () => {
    setIsOpen(false)
    reset()
  }

  return (
    <FormDialog
      title="新增時程"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        isRequired
        {...register('name')}
        errorMessage={errors?.name?.message}
        isInvalid={!!errors.name}
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="2.55 (sprint version)"
        type="text"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-small text-default-600">v</span>
          </div>
        }
      />
      <div className="flex flex-row w-full gap-6">
        <Controller
          control={control}
          name="start_date"
          render={({ field, fieldState }) => (
            <DatePicker
              {...field}
              isRequired
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              endContent={
                <CalendarDaysIcon className="w-5 h-5 text-default-600 pointer-events-none flex-shrink-0" />
              }
              label="Start Date"
              labelPlacement="outside"
              showMonthAndYearPickers
              popoverProps={{ placement: 'bottom' }}
            />
          )}
        />
        <Controller
          control={control}
          name="end_date"
          render={({ field, fieldState }) => (
            <DatePicker
              {...field}
              isRequired
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              endContent={
                <CalendarDaysIcon className="w-5 h-5 text-default-600 pointer-events-none flex-shrink-0" />
              }
              label="End Date"
              labelPlacement="outside"
              showMonthAndYearPickers
              popoverProps={{ placement: 'bottom' }}
            />
          )}
        />
      </div>
    </FormDialog>
  )
}

export default CreateSprintDialog
