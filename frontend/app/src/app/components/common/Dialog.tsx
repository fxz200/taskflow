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
  title?: string
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  footerAlignment?: 'justify-center' | 'justify-end'
}

const Dialog = ({
  title,
  children,
  isOpen,
  onClose,
  onSubmit = () => {
    onClose()
  },
  size = 'md',
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
        base: 'flex p-6 max-h-[70vh] overflow-y-auto',
        header: 'font-normal text-xl',
        body: 'my-4',
        footer: `flex items-center ${footerAlignment} px-8 gap-6 `,
      }}
    >
      <ModalContent>
        {title && (
          <ModalHeader>{title}</ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={onSubmit}>
            確認
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default Dialog
