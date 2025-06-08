import React, { useEffect, useState } from 'react'
import FormDialog from '@components/common/FormDialog'
import {
  Ticket,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TICKET_TYPES,
} from '@constants/ticket'
import { Input, Select, SelectItem, Textarea } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getSpecificMembers } from '@api/actions/member'
import { Member } from '@constants/member'
import { postTicket, putTicket } from '@api/actions/ticket'
import { getAllSprints } from '@api/actions/sprint'
import { usePathname } from 'next/navigation'

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
  release: z.string().optional(),
  assignee: z.string().nonempty({ message: 'Please select an assignee' }),
  status: z
    .number()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        Object.keys(TICKET_STATUSES).map(Number).includes(value),
      {
        message: 'Please select a valid status',
      }
    ),
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
  const pathname = usePathname()
  const allSprints = useAppSelector((state) => state.sprint?.sprints) || []
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
      release: '',
      assignee: '',
      status: pathname === '/priority' ? 0 : undefined,
      summary: '',
    },
  })

  useEffect(() => {
    if (allSprints.length === 0) {
      dispatch(getAllSprints())
    }
  }, [allSprints])

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
        release: initialData?.sprint || '',
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
        sprint: data.release,
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
            defaultSelectedKeys={field.value ? [String(field.value)] : []}
            onChange={(e) => {
              const selected = e.target.value
              field.onChange(Number(selected))
            }}
          >
            {Object.entries(TICKET_PRIORITIES).map(([key, value]) => (
              <SelectItem key={key}>{value.label}</SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="release"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            isRequired
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            name="release"
            label="Release"
            labelPlacement="outside"
            placeholder="Release"
            defaultSelectedKeys={field.value ? [String(field.value)] : []}
          >
            {allSprints.map((sprint) => (
              <SelectItem key={sprint.name}>{sprint?.name}</SelectItem>
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
      {pathname === '/priority' && (
        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => (
            <Select
              {...field}
              isRequired
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              name="status"
              label="Status"
              labelPlacement="outside"
              placeholder="Status"
              defaultSelectedKeys={field.value ? [field.value] : []}
            >
              {Object.entries(TICKET_STATUSES)
                .filter(([key]) => key !== '0')
                .map(([key, status]) => (
                  <SelectItem key={key}>{status.label}</SelectItem>
                ))}
            </Select>
          )}
        />
      )}
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
