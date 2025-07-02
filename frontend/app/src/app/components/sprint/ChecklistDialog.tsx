import { exportCheckList } from '@api/actions/ticket'
import Dialog from '@components/common/Dialog'
import { FolderArrowDownIcon } from '@heroicons/react/20/solid'
import { Button, Link } from '@heroui/react'
import { useAppDispatch } from 'app/hooks'
import { useSprint } from 'app/hooks/useSprint'
import React from 'react'

interface ChecklistDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ChecklistDialog = ({ isOpen, setIsOpen }: ChecklistDialogProps) => {
  const dispatch = useAppDispatch()
  const { currentSprint } = useSprint()

  return (
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
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      displayButtons={false}
    >
      <Button
        className="flex items-center justify-center w-full font-light p-1 text-lg"
        onPress={() => {
          dispatch(exportCheckList({ query: { sprint: currentSprint?.name } }))
          setIsOpen(false)
        }}
      >
        <span className="text-center">Download Check List</span>
        <FolderArrowDownIcon className="w-6 h-6" />
      </Button>
    </Dialog>
  )
}

export default ChecklistDialog
