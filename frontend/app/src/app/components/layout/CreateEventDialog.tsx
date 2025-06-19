import React, { useEffect } from 'react'
import { DatePicker, DateValue } from '@heroui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import FormDialog from '@components/common/FormDialog'
import { EVENT_TYPES, Sprint } from '@constants/sprint'
import { CalendarDateTime, getLocalTimeZone, now } from '@internationalized/date'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import SelectField from '@components/common/SelectField'
import { putSprint } from '@api/actions/sprint'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Schema = z.object({
  name: z.string().nonempty({ message: 'Please enter a sprint name' }),
  type: z
    .string()
    .refine((value) => EVENT_TYPES.map((type) => type.id).includes(value), {
      message: 'Please select a valid event type',
    }),
  date: z.instanceof(CalendarDateTime, { message: 'Please select a date' }),
})

type SchemaType = z.infer<typeof Schema>

const CreateEventDialog = ({ isOpen, setIsOpen }: Props) => {
  const dispatch = useAppDispatch()
  const allSprints = useAppSelector((state) => state.sprint?.sprints) || []

  const currentZoned = now(getLocalTimeZone())
  const currentCalendarDateTime = new CalendarDateTime(
    currentZoned.year,
    currentZoned.month,
    currentZoned.day,
    currentZoned.hour,
    currentZoned.minute
  )

  const nowDate = new Date()
  const defaultSprintName =
    allSprints?.find((sprint: Sprint) => {
      const start = new Date(sprint.start_date)
      const end = new Date(sprint.end_date)
      return start <= nowDate && nowDate <= end
    })?.name || allSprints[0]?.name

  const {
    handleSubmit,
    reset,
    control,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: defaultSprintName || '',
      type: '0',
      date: currentCalendarDateTime,
    },
  })

  const onSubmit = (data: SchemaType) => {
    const isoDate = new Date(
      data.date.year,
      data.date.month - 1,
      data.date.day,
      data.date.hour,
      data.date.minute,
    ).toISOString()
    const currentSprint =
      allSprints.find((sprint) => sprint.name === data.name) || {}
    const payload = {
      ...currentSprint,
      ...(data?.type === '0' && { plan_date: isoDate }),
      ...(data?.type === '1' && { end_date: isoDate }),
      ...(data?.type === '2' && { test_date: isoDate }),
      ...(data?.type === '3' && { retro_date: isoDate }),
    }
    dispatch(putSprint({ body: payload })).then(() => {
      reset()
      setIsOpen(false)
    })
  }

  useEffect(() => {
    if (allSprints.length > 0) {
      reset({
        name: allSprints[0].name,
        type: '0',
        date: currentCalendarDateTime,
      })
    }
  }, [allSprints])

  return (
    <FormDialog
      title="新增事件"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectField
        control={control}
        name="name"
        label="Sprint"
        isRequired
        options={allSprints.map((sprint) => ({
          key: sprint.name,
          value: sprint.name,
        }))}
        defaultSelectedKeys={allSprints.length >  0 ? [defaultSprintName] : []}
      />
      <SelectField
        control={control}
        name="type"
        label="Type"
        isRequired
        options={EVENT_TYPES.map((type) => ({
          key: type.id.toString(),
          value: type.label,
        }))}
        defaultSelectedKeys={[EVENT_TYPES[0].id]}
      />
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState }) => (
          <DatePicker
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            endContent={
              <CalendarDaysIcon className="w-5 h-5 text-default-600 pointer-events-none flex-shrink-0" />
            }
            label="Date"
            labelPlacement="outside"
            showMonthAndYearPickers
            popoverProps={{ placement: 'bottom' }}
            hideTimeZone
            defaultValue={currentCalendarDateTime}
            onChange={(value) => {
              field.onChange(value as DateValue)
              field.onBlur()
            }}
          />
        )}
      />
    </FormDialog>
  )
}

export default CreateEventDialog
