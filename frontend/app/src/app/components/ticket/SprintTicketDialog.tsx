import React, { useEffect } from 'react'
import FormDialog from '@components/common/FormDialog'
import { Ticket, TICKET_TYPES } from '@constants/ticket'
import { Input, Textarea } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getAllMembers } from '@api/actions/member'
import { postTicket, putTicket } from '@api/actions/ticket'
import SelectField from '@components/common/SelectField'

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
  jira_url: z
    .string()
    .url({ message: 'Please enter a valid Ticket Link' })
    .nonempty({ message: 'Please enter a Ticket Link' }),
  PM: z.string().nonempty({ message: 'Please select a PM' }),
  RD: z.string().nonempty({ message: 'Please select at least one RD' }),
  QA: z.string().nonempty({ message: 'Please select a QA' }),
  summary: z.string(),
})

type SchemaType = z.infer<typeof Schema>

const SprintTicketDialog = ({
  isOpen,
  setIsOpen,
  isEdit = false,
  initialData = {},
}: Props) => {
  const dispatch = useAppDispatch()
  const PMList = useAppSelector((state) => state.member?.PMList) || []
  const QAList = useAppSelector((state) => state.member?.QAList) || []
  const FEList = useAppSelector((state) => state.member?.FEList) || []
  const BEList = useAppSelector((state) => state.member?.BEList) || []
  const RDList = [...FEList, ...BEList]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      type: 0,
      title: '',
      jira_url: '',
      PM: '',
      RD: '',
      QA: '',
      summary: '',
    },
  })

  const onSubmit = (data: SchemaType) => {
    const action = isEdit ? putTicket : postTicket
    const payload = {
      ...{
        type: data.type,
        title: data.title,
        summary: data.summary,
        jira_url: data.jira_url,
        members_ids: [
          data.PM,
          ...data.RD.split(',')
            .map((id) => id.trim())
            .filter((id) => id !== ''),
          data.QA,
        ],
        statement: 2,
      },
      ...(isEdit && { id: initialData?.id }),
    }
    dispatch(action({ body: payload })).then(() => {
      onClose()
    })
  }

  const onClose = () => {
    setIsOpen(false)
    reset()
  }

  useEffect(() => {
    if (PMList.length === 0 || RDList.length === 0 || QAList.length === 0) {
      dispatch(getAllMembers())
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      reset({
        type: initialData?.type || 0,
        title: initialData?.title || '',
        PM: initialData?.members?.find((member) => member.role === 1)?.id || '',
        RD:
          initialData?.members
            ?.filter((member) => member.role === 2 || member.role === 3)
            .map((member) => member.id)
            .join(',') || '',
        QA: initialData?.members?.find((member) => member.role === 4)?.id || '',
        summary: initialData?.summary || '',
      })
    }
  }, [isOpen])

  return (
    <FormDialog
      title={isEdit ? '編輯Ticket' : '新增Ticket'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectField
        control={control}
        name="type"
        label="Type"
        isRequired
        options={Object.entries(TICKET_TYPES).map(([key, value]) => ({
          key: key,
          value: value.label,
        }))}
        defaultSelectedKeys={
          initialData?.type ? [String(initialData.type)] : []
        }
        onChange={(value) => {
          const selected = value[0] ? Number(value[0]) : 0
          setValue('type', selected)
        }}
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
      <Input
        isRequired
        {...register('jira_url')}
        errorMessage={errors.jira_url?.message}
        isInvalid={!!errors.jira_url}
        name="jira_url"
        label="Ticket Link"
        labelPlacement="outside"
        placeholder="Ticket Link"
        type="text"
      />
      <SelectField
        control={control}
        name="PM"
        label="PM"
        isRequired
        options={PMList.map((pm) => ({
          key: pm.id,
          value: pm.name,
        }))}
      />
      <SelectField
        control={control}
        name="RD"
        label="RD"
        selectMode="multiple"
        isRequired
        defaultSelectedKeys={
          initialData?.members
            ? initialData.members
                .filter((member) => member.role === 2 || member.role === 3)
                .map((member) => member.id)
            : []
        }
        options={RDList.map((rd) => ({
          key: rd.id,
          value: rd.name,
        }))}
        onChange={(value) => {
          console.log('RD selected:', value)
        }}
      />
      <SelectField
        control={control}
        name="QA"
        label="QA"
        isRequired
        options={QAList.map((qa) => ({
          key: qa.id,
          value: qa.name,
        }))}
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

export default SprintTicketDialog
