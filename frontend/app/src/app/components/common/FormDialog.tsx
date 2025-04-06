import {
  Button,
  Form,
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
  onSubmit: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  footerAlignment?: 'justify-center' | 'justify-end'
}

const FormDialog = ({
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
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
        base: 'flex p-6',
        header: 'font-normal text-xl',
        body: 'mt-4 flex-col gap-9',
        footer: `flex items-center ${footerAlignment} mt-6 px-8 gap-6 `,
      }}
    >
      <Form onSubmit={()=>{onSubmit()}}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onClose}>
              取消
            </Button>
            <Button color="primary" type="submit">
              確認
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  )
}

export default FormDialog
