import React, { useState } from 'react'
import { Avatar, Button, Card, Input, Select, SelectItem } from '@heroui/react'
import { roles } from '@constants/member'
import SelectAvatarDialog from './SelectAvatarDialog'
import FormDialog from '@components/common/FormDialog'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from 'app/hooks'
import { postMember, putMember } from '@api/actions/member'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isEdit?: boolean
  initialData?: Partial<SchemaType> & { id?: number }
}

const Schema = z.object({
  role: z.number().refine((value) => [1, 2, 3, 4].includes(value), {
    message: 'Please select a valid role',
  }),
  name: z.string().nonempty('Please enter a name'),
  email: z.string().email('Please enter a valid email'),
  icon: z.number().min(0),
})

type SchemaType = z.infer<typeof Schema>

const MemberDialog = ({
  isOpen,
  setIsOpen,
  isEdit = false,
  initialData = {},
}: Props) => {
  const dispatch = useAppDispatch()
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: isEdit
      ? initialData
      : {
          role: 0,
          name: '',
          email: '',
          icon: 0,
        },
  })

  const onSubmit = (data: SchemaType) => {
    const action = isEdit ? putMember : postMember
    const payload = isEdit ? { ...data, id: initialData?.id } : data
    dispatch(action({ body: payload })).then(() => onClose())
  }

  const onClose = () => {
    setIsOpen(false)
    reset()
  }

  return (
    <>
      <FormDialog
        title={isEdit ? '編輯成員' : '新增成員'}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              {...field}
              isRequired
              errorMessage={errors.role?.message}
              label="Role"
              labelPlacement="outside"
              placeholder="Select a role"
              defaultSelectedKeys={field.value === 0 ? '' :[String(field.value)]}
              onChange={(e) => {
                const selected = e.target.value
                field.onChange(Number(selected))
              }}
            >
              {roles.map((role) => (
                <SelectItem key={role.id}>{role.label}</SelectItem>
              ))}
            </Select>
          )}
        />
        <Input
          isRequired
          {...register('name')}
          errorMessage={errors.name?.message}
          label="Name"
          labelPlacement="outside"
          name="name"
          placeholder="Name"
          type="text"
        />
        <Input
          isRequired
          {...register('email')}
          errorMessage={errors.email?.message}
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Email"
          type="text"
        />
        <div className="flex flex-col gap-2 w-full">
          <span>Profile Picture</span>
          <Card
            shadow="none"
            className="flex flex-row items-center w-full p-3 gap-4 bg-default-300"
          >
            <Avatar
              size="lg"
              radius="sm"
              className="bg-white"
              src={
                watch('icon') === 0
                  ? undefined
                  : `/img/avatar_${watch('icon')}.jpg`
              }
            />
            <Button
              className="bg-white flex-grow"
              onPress={() => setIsAvatarDialogOpen(true)}
            >
              Choose Profile Picture
            </Button>
          </Card>
        </div>
      </FormDialog>
      <SelectAvatarDialog
        isOpen={isAvatarDialogOpen}
        setIsOpen={setIsAvatarDialogOpen}
        avatarId={watch('icon')}
        onSelect={(avatarId: number) => {
          setValue('icon', avatarId)
        }}
      />
    </>
  )
}

export default MemberDialog
