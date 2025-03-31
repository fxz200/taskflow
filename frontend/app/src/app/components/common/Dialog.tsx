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
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  footerAlignment?: 'justify-center' | 'justify-end'
}

const Dialog = ({
  title,
  children,
  isOpen,
  onClose,
  size = "md",
  footerAlignment = 'justify-center',
}: Props) => {
  return (
    <Modal
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      hideCloseButton={true}
      size={size}
      className="rounded-[40px]"
      classNames={{
        base: 'flex p-6',
        header: 'font-normal text-xl',
        body: 'mt-4',
        footer: `flex items-center ${footerAlignment} mt-6 px-8 gap-6 `,
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
