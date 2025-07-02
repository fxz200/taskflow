import { Button } from '@heroui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import CreateEventDialog from '@components/timeline/CreateEventDialog'

const TimelineButton = () => {
  const [openEventDialog, setOpenEventDialog] = useState(false)

  return (
    <>
      <Button
        isIconOnly
        color="default"
        className="min-w-9 w-9 h-9 data-[hover=true]:!opacity-100 hover:bg-primary"
        onPress={() => setOpenEventDialog(true)}
      >
        <PlusIcon className="w-5 h-5" />
      </Button>
      <CreateEventDialog
        isOpen={openEventDialog}
        setIsOpen={setOpenEventDialog}
      />
    </>
  )
}

export default TimelineButton
