import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import {
  ChartBarIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react'
import CreateSprintDialog from '@components/sprint/CreateSprintDialog'
import { useAppSelector } from 'app/hooks'
import SprintTicketDialog from '@components/ticket/SprintTicketDialog'

const SprintButton = () => {
  const allSprints = useAppSelector((state) => state?.sprint?.sprints)
  const [openSprintDialog, setOpenSprintDialog] = useState(false)
  const [openTicketDialog, setOpenTicketDialog] = useState(false)
  const [openPublishPopover, setOpenPublishPopover] = useState(false)
  const [openAddPopover, setOpenAddPopover] = useState(false)

  return (
    <>
      <div className="flex flex-row gap-3">
        <Popover
          placement="bottom"
          isOpen={openPublishPopover}
          onOpenChange={setOpenPublishPopover}
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              color="default"
              className="min-w-9 w-9 h-9 data-[hover=true]:!opacity-100 hover:bg-primary"
            >
              <ChartBarIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-center">
            <Button
              className="w-full bg-transparent font-light h-9"
              onPress={() => {
                setOpenPublishPopover(false)
              }}
            >
              生成生成CheckList Excel
            </Button>
            <Button
              className="w-full bg-transparent font-light h-9"
              disabled={allSprints.length === 0}
              onPress={() => {
                setOpenPublishPopover(false)
              }}
            >
              生成上版公告文字
            </Button>
          </PopoverContent>
        </Popover>
        <Button
          isIconOnly
          color="default"
          className="min-w-9 w-9 h-9 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {}}
        >
          <ChevronUpDownIcon className="w-5 h-5" />
        </Button>

        <Popover
          placement="bottom"
          isOpen={openAddPopover}
          onOpenChange={setOpenAddPopover}
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              color="default"
              className="min-w-9 w-9 h-9  data-[hover=true]:!opacity-100 hover:bg-primary"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-center">
            <Button
              className="w-full bg-transparent font-light h-9"
              onPress={() => {
                setOpenAddPopover(false)
                setOpenSprintDialog(true)
              }}
            >
              新增Sprint
            </Button>
            <Button
              className="w-full bg-transparent font-light h-9"
              disabled={allSprints.length === 0}
              onPress={() => {
                setOpenAddPopover(false)
                setOpenTicketDialog(true)
              }}
            >
              新增Ticket
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <CreateSprintDialog
        isOpen={openSprintDialog}
        setIsOpen={setOpenSprintDialog}
      />
      <SprintTicketDialog
        isOpen={openTicketDialog}
        setIsOpen={setOpenTicketDialog}
      />
    </>
  )
}

export default SprintButton
