import React, { useState } from 'react'
import { Button } from '@heroui/react'
import Image from 'next/image'
import { UserIcon } from '@heroicons/react/20/solid'
import { AVATAR_LIST } from '@constants/member'
import Dialog from '@components/common/Dialog'
import ReactFocusLock from 'react-focus-lock'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  avatarId?: number
  onSelect: (avatarId: number) => void
}

const SelectAvatarDialog = ({ isOpen, setIsOpen, avatarId = 0, onSelect }: Props) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>(avatarId)
  const onSubmit = () => {
    if (selectedAvatar !== null) {
      onSelect(selectedAvatar)
    }
    setIsOpen(false)
  }

  return (
    <Dialog
      title="選擇頭貼"
      size="2xl"
      isOpen={isOpen}
      footerAlignment="justify-end"
      onClose={() => setIsOpen(false)}
      onSubmit={onSubmit}
    >
      <ReactFocusLock>
        <div className="grid grid-cols-5 gap-7 py-2 px-1 max-h-52 overflow-y-scroll">
          {AVATAR_LIST.map((avatar, index) => (
            <Button
              isIconOnly={avatar.id === 0}
              key={index}
              className={`w-20 h-20 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)] bg-white ${
                selectedAvatar === avatar.id
                  ? 'border-2 border-primary-300'
                  : ''
              }`}
              onPress={() => setSelectedAvatar(avatar.id)}
            >
              {avatar.id === 0 ? (
                <UserIcon className="bg-white w-16 h-16" />
              ) : (
                <Image
                  src={avatar.src!}
                  alt={`Avatar ${avatar.id}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </Button>
          ))}
        </div>
      </ReactFocusLock>
    </Dialog>
  )
}

export default SelectAvatarDialog
