'use client'
import CreateMemberDialog from './components/CreateMemberDialog'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Button, Card } from '@heroui/react'
import React, { useState } from 'react'

const Members = () => {
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <>
      <div className="flex mr-8 h-full">
        <Card
          radius="sm"
          className="flex items-center justify-center bg-primary/60 dark:bg-primary/90 rounded-tl-3xl rounded-br-3xl w-full mb-8 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]"
        >
          <Button
            radius="sm"
            className="flex flex-col items-center justify-center bg-white/90 rounded-tl-3xl rounded-br-3xl h-36 w-60 border-dashed border-2 border-primary"
            onPress={() => setOpenDialog(true)}
          >
            <div>
              <PlusIcon className="w-18 h-14" />
            </div>
            <p className="font-light text-xl text-black">新增會員</p>
          </Button>
        </Card>
      </div>
      <CreateMemberDialog isOpen={openDialog} setIsOpen={setOpenDialog} />
    </>
  )
}

export default Members
