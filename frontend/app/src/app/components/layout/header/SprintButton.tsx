import {
  Button,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react'
import {
  ChartBarIcon,
  ChevronUpDownIcon,
  FolderArrowDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react'
import CreateSprintDialog from '@components/sprint/CreateSprintDialog'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import SprintTicketDialog from '@components/ticket/SprintTicketDialog'
import Dialog from '@components/common/Dialog'
import { useSprint } from 'app/hooks/useSprint'
import { exportAnnouncement, exportCheckList } from '@api/actions/ticket'
import AnnouncementDialog from '@components/sprint/AnnouncementDialog'

const SprintButton = () => {
  const dispatch = useAppDispatch()
  const { currentSprint } = useSprint()
  const allSprints = useAppSelector((state) => state?.sprint?.sprints)
  const [openSprintDialog, setOpenSprintDialog] = useState<boolean>(false)
  const [openTicketDialog, setOpenTicketDialog] = useState<boolean>(false)
  const [openPublishPopover, setOpenPublishPopover] = useState<boolean>(false)
  const [openAddPopover, setOpenAddPopover] = useState<boolean>(false)
  const [openCheckListDialog, setOpenCheckListDialog] =
    useState<boolean>(false)
  const [openExportAnnouncementDialog, setOpenExportAnnouncementDialog] =
    useState<boolean>(false)
  const [Announcement, setAnnouncement] = useState<string>('')

  const date = currentSprint?.end_date
    ? new Date(currentSprint?.end_date)
    : null
  const formattedEndDate = date
    ? `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${(
        '0' + date.getDate()
      ).slice(-2)} ` +
      `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(
        -2
      )}`
    : ''
  const publishTime = `v${currentSprint?.name} 預計 ${formattedEndDate}上版\n`

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
              disabled={allSprints.length === 0}
            >
              <ChartBarIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-center">
            <Button
              className="w-full bg-transparent font-light h-9"
              onPress={() => {
                setOpenPublishPopover(false)
                setOpenCheckListDialog(true)
              }}
            >
              生成 CheckList Excel
            </Button>
            <Button
              className="w-full bg-transparent font-light h-9"
              onPress={() => {
                setOpenPublishPopover(false)
                setOpenExportAnnouncementDialog(true)
                dispatch(
                  exportAnnouncement({ query: { sprint: currentSprint?.name } })
                ).then((res) => {
                  setAnnouncement(res)
                })
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
          disabled={allSprints.length === 0}
          onPress={() => {
            window.dispatchEvent(new Event('EXPAND_ALL_TICKETS'))
          }}
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
      {/* 生成CheckList dialog */}
      <Dialog
        title={
          <Link
            isExternal
            showAnchorIcon
            color="foreground"
            href="https://docs.google.com/spreadsheets/d/1V7bIGh27W22S8PJjNN0aukKKiwB6V-Lqg5yGtqXXXeY/edit?"
          >
            Check List
          </Link>
        }
        isOpen={openCheckListDialog}
        onClose={() => setOpenCheckListDialog(false)}
        displayButtons={false}
      >
        <Button
          className="flex items-center justify-center w-full font-light p-1 text-lg"
          onPress={() => {
            dispatch(exportCheckList({ query: { sprint: currentSprint } }))
            setOpenCheckListDialog(false)
          }}
        >
          <span className="text-center">Download Check List</span>
          <FolderArrowDownIcon className="w-6 h-6" />
        </Button>
      </Dialog>
      {/* 生成上版文字 Dialog */}
      <AnnouncementDialog 
        Announcement={Announcement}
        publishTime={publishTime}
        isOpen={openExportAnnouncementDialog}
        setOpen={setOpenExportAnnouncementDialog}
      />
      {/* <Dialog
        size="2xl"
        title={
          <>
            <span>生成上版公告文字</span>
            {!ticketLoading && (
              <Button
                isIconOnly
                className="bg-transparent"
                onPress={() => {
                  const announcementText = announcementForSlack(Announcement)
                  navigator.clipboard.writeText(announcementText).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  })
                }}
              >
                {copied ? <CheckIcon className="w-6 h-6" /> : <Square2StackIcon className="w-6 h-6" />}
              </Button>
            )}
          </>
        }
        isOpen={openExportAnnouncementDialog}
        onClose={() => setOpenExportAnnouncementDialog(false)}
        displayButtons={false}
        hideCloseButton={false}
      >
        {ticketLoading ? (
          <>
            <Spinner
              size="lg"
              variant="dots"
              classNames={{
                base: 'pb-2',
                wrapper: 'w-24',
                dots: 'size-5',
              }}
            />
          </>
        ) : (
          <AnnouncementText text={Announcement} publishTime={publishTime} />
        )}
      </Dialog> */}
    </>
  )
}

export default SprintButton
