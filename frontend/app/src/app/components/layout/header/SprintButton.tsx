import { Button } from "@heroui/react"
import { ChartBarIcon, ChevronUpDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState } from "react"

const SprintButton = () => {
  const [openSprintDialog, setOpenSprintDialog] = useState(false)
  return (
    <>
      <div className="flex flex-row gap-3">
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
          }}
        >
          <ChartBarIcon className="w-5 h-5" />
        </Button>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
          }}
        >
          <ChevronUpDownIcon className="w-5 h-5" />
        </Button>
        <Button
          isIconOnly
          color="default"
          className="w-11 data-[hover=true]:!opacity-100 hover:bg-primary"
          onPress={() => {
            setOpenSprintDialog(true)
          }}
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    </>
  )
}

export default SprintButton
