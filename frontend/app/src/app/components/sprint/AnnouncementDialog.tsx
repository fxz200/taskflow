import Dialog from '@components/common/Dialog'
import { CheckIcon, Square2StackIcon } from '@heroicons/react/20/solid'
import { Button, Spinner } from '@heroui/react'
import { useAppSelector, useSprint } from 'app/hooks'
import React, { useState } from 'react'
import AnnouncementText from './AnnouncementText'

interface AnnouncementDialogProps {
  Announcement: string
  publishTime: string
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const AnnouncementDialog = ({
  Announcement,
  publishTime,
  isOpen,
  setOpen,
}: AnnouncementDialogProps) => {
  const { currentSprint } = useSprint()
  const ticketLoading = useAppSelector((state) => state?.ticket?.loading)
  const [copied, setCopied] = useState(false)

  const announcementForSlack = (text: string): string => {
    let lines = text.split('\n')
    if (lines.length > 0 && currentSprint?.end_date && currentSprint?.name) {
      lines[0] = publishTime + lines[0]
    }
    return lines
      .map((line) => {
        return line.replace(/(https?:\/\/\S+)/g, (url) => url)
      })
      .join('\n')
  }

  return (
    <Dialog
      size="2xl"
      title={
        <>
          <span>生成上版公告文字</span>
          {!ticketLoading && (
            <Button
              isIconOnly
              className="bg-transparent"
              onPress={() => {
                const announcementText: string =
                  announcementForSlack(Announcement)
                navigator.clipboard.writeText(announcementText).then(() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                })
              }}
            >
              {copied ? (
                <CheckIcon className="w-6 h-6 text-success" />
              ) : (
                <Square2StackIcon className="w-6 h-6" />
              )}
            </Button>
          )}
        </>
      }
      isOpen={isOpen}
      onClose={() => setOpen(false)}
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
    </Dialog>
  )
}

export default AnnouncementDialog
