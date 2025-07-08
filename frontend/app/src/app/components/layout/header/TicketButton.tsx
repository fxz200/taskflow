import { Button } from '@heroui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { deleteTicket } from '@api/actions/ticket'
import { useAppDispatch, useSelectedTableKeys } from 'app/hooks'
import TicketDialog from '@components/ticket/TicketDialog'
import { useState } from 'react'

const TicketButton = () => {
  const dispatch = useAppDispatch()
  const { selectedTableKeys, setSelectedTableKeys } = useSelectedTableKeys()
  const [openTicketDialog, setOpenTicketDialog] = useState(false)

  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          isIconOnly
          color="default"
          className="min-w-9 w-9 h-9 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
            dispatch(deleteTicket({ query: { id: selectedTableKeys  } })).then(()=>{
              setSelectedTableKeys([])
            })
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
        <Button
          isIconOnly
          color="default"
          className="min-w-9 w-9 h-9  data-[hover=true]:!opacity-100 hover:bg-primary"
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
