import React from 'react'
import { Button } from '@heroui/react'
import Dialog from '@components/common/Dialog'
import Image from 'next/image'
import { UserIcon } from '@heroicons/react/20/solid'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectAvatarDialog = ({ isOpen, setIsOpen }: Props) => {
  const imageList = Array.from(
    { length: 14 },
    (_, i) => `/img/avatar_${i + 1}.jpg`
  )

  return (
    <Dialog
      title="選擇頭貼"
      size="2xl"
      isOpen={isOpen}
      footerAlignment='justify-end'
      onClose={() => setIsOpen(false)}
    >
      <div className="grid grid-cols-5 gap-6 py-2 max-h-52 overflow-y-scroll">
        <Button isIconOnly className="w-20 h-20 bg-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
          <UserIcon className="bg-white w-16 h-16" />
        </Button>
        {imageList.map((src, index) => (
          <Button key={index} className="w-20 h-20 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]">
            <Image
              src={src}
              alt={`Avatar ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </Button>
        ))}
      </div>
    </Dialog>
  )
}

export default SelectAvatarDialog
