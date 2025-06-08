import { Button, ButtonGroup } from '@heroui/react'
import { ChevronUpDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import CreateEventDialog from '../CreateEventDialog'

const TimelineButton = () => {
  const [openEventDialog, setOpenEventDialog] = useState(false)

  return (
    <>
      {' '}
      <ButtonGroup>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
        >
          <ChevronUpDownIcon className="w-5 h-5" />
        </Button>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => setOpenEventDialog(true)}
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </ButtonGroup>
      <CreateEventDialog
        isOpen={openEventDialog}
        setIsOpen={setOpenEventDialog}
      />
    </>
  )
}

export default TimelineButton
