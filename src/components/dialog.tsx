'use client'

import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

export function DialogComponent({
  isOpen,
  onOpenChange,
  onClose,
  message,
}: {
  message: string
  isOpen: boolean
  onOpenChange: (state: boolean) => void
  onClose: () => void
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={onClose}
          className="bg-black opacity-50 data-[state=open]:animate-overlayShow fixed inset-0"
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className=' className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'
        >
          <Dialog.Title className="text-black">{message}</Dialog.Title>
          <Dialog.Description />
          <Dialog.Close asChild>
            <button
              className="text-black hover:bg-violet-600 transition-all duration-300 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={onClose}
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
