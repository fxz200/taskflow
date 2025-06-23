import React from 'react'
import FormDialog from '@components/common/FormDialog'
import { EVENT_TYPES, Sprint } from '@constants/sprint'
import {
  CalendarDateTime,
  getLocalTimeZone,
  now,
} from '@internationalized/date'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import SelectField from '@components/common/SelectField'
import { putSprint } from '@api/actions/sprint'
import DateField from '@components/common/DateField'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isEdit?: boolean
  initialData?: {
    name?: string
    type?: string
    date?: CalendarDateTime
  }
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

const CreateEventDialog = ({
  isOpen,
  setIsOpen,
  isEdit = false,
  initialData,
}: Props) => {
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
  const defaultSprintName = initialData?.name
    ? initialData?.name
    : allSprints?.find((sprint: Sprint) => {
        const start = new Date(sprint.start_date)
        const end = new Date(sprint.end_date)
        return start <= nowDate && nowDate <= end
      })?.name
  
  console.log('defaultSprintName', defaultSprintName)
  const { handleSubmit, reset, control } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: defaultSprintName || '',
      type: '',
      date: initialData?.date || currentCalendarDateTime,
    },
  })

  const onSubmit = (data: SchemaType) => {
    const isoDate = new Date(
      data.date.year,
      data.date.month - 1,
      data.date.day,
      data.date.hour,
      data.date.minute
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

  const onClose = () => {
    reset()
    setIsOpen(false)
  }

  return (
    <FormDialog
      title={isEdit ? '編輯事件' : '新增事件'}
      isOpen={isOpen}
      onClose={onClose}
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
        defaultSelectedKeys={allSprints.length > 0 && defaultSprintName ? [defaultSprintName] : []}
        onChange={(value) => {
          const selectedSprint = allSprints.find((sprint) => sprint.name === value)
          if (selectedSprint) {
            const dateField = isEdit ? initialData?.date : currentCalendarDateTime
            reset({
              name: value,
              type: initialData?.type || '0',
              date: dateField || new CalendarDateTime(
                currentZoned.year,
                currentZoned.month,
                currentZoned.day,
                currentZoned.hour,
                currentZoned.minute
              ),
            })
          }
        }}
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
        defaultSelectedKeys={initialData?.type ? [initialData.type] : ['0']}
      />
      <DateField
        control={control}
        name="date"
        label="Date"
        isRequired
        showMonthAndYearPickers
        hideTimeZone
      />
    </FormDialog>
  )
}

export default CreateEventDialog
