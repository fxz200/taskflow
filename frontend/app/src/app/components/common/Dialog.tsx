import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  footerAlignment?: "items-center" | "items-end"
}

const Dialog = ({ title, children, isOpen, onClose, footerAlignment = "items-center" }: Props) => {
  return (
    <Modal
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      hideCloseButton={true}
      className="rounded-[40px]"
      classNames={{
        base:'flex p-5',
        header: 'font-normal text-xl',
        body: 'mt-5',
        footer: `flex items-center justify-center mt-6 gap-6 ${footerAlignment}`,
      }}
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={onClose}>
            確認
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Dialog
