import { deleteMember } from '@api/actions/member'
import Dialog from '@components/common/Dialog'
import { ROLES } from '@constants/member'
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Avatar, Button, Card } from '@heroui/react'
import { useAppDispatch } from 'app/hooks'
import React, { useState } from 'react'
import MemberDialog from './MemberDialog'

interface Props {
  member: {
    id: string
    name: string
    role: number
    icon: number
  }
}

const MemberCard = ({ member }: Props) => {
  const dispatch = useAppDispatch()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const roleLabel = ROLES.find((role) => role.id === member.role)?.label

  const handleDeleteSubmit = () => {
    dispatch(deleteMember({ query: { id: member.id } })).then(() => {
      setIsDeleteDialogOpen(false)
    })
  }

  return (
    <>
      <Card
        key={member.id}
        radius="lg"
        shadow="none"
        className="relative flex flex-row items-center p-7 bg-white/90 w-[308px] h-32 mb-8 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]"
      >
        <Avatar
          radius="sm"
          className="w-[72px] h-[72px] bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)] border-1.5 border-primary-300"
          src={member.icon === 0 ? undefined : `/img/avatar_${member.icon}.jpg`}
        />
        <div className="flex flex-col ml-4 h-full flex-1">
          <p className="font-light text-[12px] flex flex-grow-[1] items-center">
            {roleLabel}
          </p>
          <p className="font-light text-2xl flex flex-grow-[9] items-center justify-center">
            {member.name}
          </p>
        </div>
        <div className="absolute top-5 right-5 flex gap-2">
          <Button
            isIconOnly
            className="bg-transparent min-h-4 min-w-[14px] h-[14px] w-[14px]"
            onPress={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent min-h-4 min-w-5 h-5 w-5"
            onPress={() => setIsDeleteDialogOpen(true)}
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      {/* check delete dialog */}
      <Dialog
        size="sm"
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSubmit={handleDeleteSubmit}
        content='確認刪除？'
      />
      {/* edit member dialog */}
      <MemberDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} isEdit={true} initialData={member} />
    </>
  )
}

export default MemberCard
