import React, { useEffect, useState } from 'react'
import FormDialog from '@components/common/FormDialog'
import { Ticket, TICKET_PRIORITIES, TICKET_TYPES } from '@constants/ticket'
import { Input, Select, SelectItem, Textarea } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getSpecificMembers } from '@api/actions/member'
import { Member } from '@constants/member'
import { postTicket, putTicket } from '@api/actions/ticket'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isEdit?: boolean
  initialData?: Partial<Ticket> | undefined
}

const Schema = z.object({
  type: z
    .number()
    .refine((value) => Object.keys(TICKET_TYPES).map(Number).includes(value), {
      message: 'Please select a valid type',
    }),
  title: z.string().nonempty({ message: 'Please enter a title' }),
  priority: z
    .number()
    .refine(
      (value) => Object.keys(TICKET_PRIORITIES).map(Number).includes(value),
      {
        message: 'Please select a valid priority',
      }
    ),
  assignee: z.string().nonempty({ message: 'Please select an assignee' }),
  summary: z.string(),
})

type SchemaType = z.infer<typeof Schema>

const TicketDialog = ({
  isOpen,
  setIsOpen,
  isEdit = false,
  initialData = {},
}: Props) => {
  const dispatch = useAppDispatch()
  const originalPMList = useAppSelector((state) => state.member?.PMList) || []
  const [pmList, setPmList] = useState<Member[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      type: 0,
      title: '',
      priority: 0,
      assignee: '',
      summary: '',
    },
  })

  useEffect(() => {
    if (originalPMList.length === 0) {
      dispatch(getSpecificMembers({ query: { role: 1 } })).then((res) => {
        if (res?.members) {
          setPmList(res.members)
        }
      })
    } else {
      setPmList(originalPMList)
    }
  }, [originalPMList])

  useEffect(() => {
    if (isOpen) {
      reset({
        type: initialData?.type || 0,
        title: initialData?.title || '',
        priority: initialData?.priority || 0,
        assignee:
          initialData?.members?.find((member) => member.role === 1)?.id || '',
        summary: initialData?.summary || '',
      })
    }
  }, [isOpen])

  const onSubmit = (data: SchemaType) => {
    const action = isEdit ? putTicket : postTicket
    const payload = {
      ...{
        type: data.type,
        title: data.title,
        priority: data.priority,
        summary: data.summary,
        members_ids: [data.assignee],
      },
      ...(isEdit && { id: initialData?.id }),
    }
    dispatch(action({ body: payload })).then(() => {
      onClose()
    })
  }

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <FormDialog
      title={isEdit ? '編輯Ticket' : '新增Ticket'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            {...field}
            isRequired
            errorMessage={errors.type?.message}
            isInvalid={!!errors.type}
            name="type"
            label="Type"
            labelPlacement="outside"
            placeholder="Type"
            defaultSelectedKeys={field.value ? [String(field.value)] : []}
            onChange={(e) => {
              const selected = e.target.value
              field.onChange(Number(selected))
            }}
          >
            {Object.entries(TICKET_TYPES).map(([key, value]) => (
              <SelectItem key={key}>{value.label}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Input
        isRequired
        {...register('title')}
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        name="title"
        label="Title"
        labelPlacement="outside"
        placeholder="Title"
        type="text"
      />
      <Controller
        control={control}
        name="priority"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            name="priority"
            label="Priority Score"
            labelPlacement="outside"
            placeholder="Priority Score"
            // defaultSelectedKeys={field.value ? [String(field.value)] : []}
            onChange={(e) => {
              const selected = e.target.value
              field.onChange(Number(selected))
            }}
          >
            {Object.entries(TICKET_PRIORITIES).map(([key, value]) => (
              <SelectItem key={key}>
                {value.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="assignee"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            name="assignee"
            label="Assignee"
            labelPlacement="outside"
            placeholder="Assignee"
            defaultSelectedKeys={field.value ? [field.value] : []}
          >
            {pmList.map((pm) => (
              <SelectItem key={pm.id}>{pm.name}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Textarea
        {...register('summary')}
        name="summary"
        label="Summary"
        labelPlacement="outside"
        placeholder="Summary"
        type="text"
      />
    </FormDialog>
  )
}

export default TicketDialog
