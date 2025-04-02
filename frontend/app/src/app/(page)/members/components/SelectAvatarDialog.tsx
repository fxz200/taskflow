import React from 'react'
import { Button } from '@heroui/react'
import Image from 'next/image'
import { UserIcon } from '@heroicons/react/20/solid'
import { avatarList } from '@constants/member'
import Dialog from '@components/common/Dialog'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectAvatarDialog = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog
      title="選擇頭貼"
      size="2xl"
      isOpen={isOpen}
      footerAlignment="justify-end"
      onClose={() => setIsOpen(false)}
    >
      <div className="grid grid-cols-5 gap-7 p-2 max-h-52 overflow-y-scroll">
        <Button
          isIconOnly
          className="w-20 h-20 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]"
        >
          <UserIcon className="bg-white w-16 h-16" />
        </Button>
        {avatarList.map((avatar, index) => (
          <Button
            key={index}
            className="w-20 h-20 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <Image
              src={avatar.src}
              alt={`Avatar ${avatar.id}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </Button>
        ))}
      </div>
    </Dialog>
  )
}

export default SelectAvatarDialog
