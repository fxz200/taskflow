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
  title?: string | React.ReactNode
  children?: React.ReactNode
  content?: string
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  footerAlignment?: 'justify-center' | 'justify-end'
  displayButtons?: boolean
  hideCloseButton?: boolean
}

const Dialog = ({
  title,
  children,
  content,
  isOpen,
  onClose,
  onSubmit = () => {
    onClose()
  },
  size = 'md',
  footerAlignment = 'justify-center',
  displayButtons = true,
  hideCloseButton = true,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={hideCloseButton}
      size={size}
      className="rounded-[40px] max-h-[80vh]"
      classNames={{
        base: 'flex p-6 bg-default-300',
        header: 'font-normal text-xl flex items-center justify-start',
        body: `${displayButtons ? 'my-4' : 'mb-2'} overflow-y-auto`,
        footer: `flex items-center ${footerAlignment} px-8 gap-6 `,
        closeButton: 'absolute top-5 right-5',
      }}
    >
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>
          {children || (
            <p className="flex items-center justify-center">{content}</p>
          )}
        </ModalBody>
        {displayButtons && (
          <ModalFooter>
            <Button color="default" onPress={onClose}>
              取消
            </Button>
            <Button color="primary" onPress={onSubmit}>
              確認
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default Dialog
