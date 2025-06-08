import { Button } from '@heroui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { deleteTicket } from '@api/actions/ticket'
import { useAppDispatch } from 'app/hooks'
import TicketDialog from '@components/ticket/TicketDialog'
import { useState } from 'react'

interface Props {
  selectedTableKeys: string[]
}

const TicketButton = ({ selectedTableKeys }: Props) => {
  const dispatch = useAppDispatch()
  const [openTicketDialog, setOpenTicketDialog] = useState(false)

  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
            dispatch(deleteTicket({ body: selectedTableKeys }))
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
            setOpenTicketDialog(true)
          }}
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
      <TicketDialog isOpen={openTicketDialog} setIsOpen={setOpenTicketDialog} />
    </>
  )
}

export default TicketButton
