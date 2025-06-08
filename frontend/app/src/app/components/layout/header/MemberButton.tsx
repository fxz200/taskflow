import { Button, ButtonGroup } from '@heroui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import MemberDialog from 'app/(page)/members/components/MemberDialog'

const MemberButton = () => {
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  return (
    <>
      <ButtonGroup>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => setOpenMemberDialog(true)}
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </ButtonGroup>
      <MemberDialog isOpen={openMemberDialog} setIsOpen={setOpenMemberDialog} />
    </>
  )
}

export default MemberButton
