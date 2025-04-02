import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Select,
  SelectItem,
} from '@heroui/react'
import { roles } from '@constants/member'
import SelectAvatarDialog from './SelectAvatarDialog'
import Dialog from '@components/common/Dialog'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CreateMemberDialog = ({ isOpen, setIsOpen }: Props) => {
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  return (
    <>
      <Dialog title="新增成員" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Form className="gap-9">
          <Select
            isRequired
            label="Role"
            labelPlacement="outside"
            placeholder='Select a role'
          >
            {roles.map((role) => (
              <SelectItem key={role.id}>{role.label}</SelectItem>
            ))}
          </Select>
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Name"
            type="text"
          />
          <div className="flex flex-col gap-2 w-full">
            <span>Profile Picture</span>
            <Card
              shadow="none"
              className="flex flex-row items-center w-full p-3 gap-4 bg-default-100"
            >
              <Avatar size="lg" radius="sm" className="bg-white" />
              <Button
                className="bg-white flex-grow"
                onPress={() => setIsAvatarDialogOpen(true)}
              >
                Choose Profile Picture
              </Button>
            </Card>
          </div>
        </Form>
      </Dialog>
      <SelectAvatarDialog
        isOpen={isAvatarDialogOpen}
        setIsOpen={setIsAvatarDialogOpen}
      />
    </>
  )
}

export default CreateMemberDialog
