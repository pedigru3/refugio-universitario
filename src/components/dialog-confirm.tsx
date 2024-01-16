'use client'

import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-alert-dialog'

export function DialogConfirm({
  isOpen,
  onOpenChange,
  onButtonResponse,
  onClose,
  description,
}: {
  description: string
  isOpen: boolean
  onOpenChange: (state: boolean) => void
  onButtonResponse: (response: boolean) => void
  onClose: () => void
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className=' className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'
        >
          <Dialog.Title className="text-black text-xl font-bold">
            Você tem certeza disso?
          </Dialog.Title>
          <Dialog.Description className="text-black mt-4 mb-5 text-[15px] leading-normal">
            {description}
          </Dialog.Description>
          <div className="flex justify-end gap-[25px]">
            <Dialog.Cancel asChild>
              <button className="bg-gray-400 text-mauve11 bg-mauve4 hover:bg-gray-500 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                Cancelar
              </button>
            </Dialog.Cancel>
            <Dialog.Action asChild>
              <button
                className=" bg-red-400 text-red11 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                onClick={() => onButtonResponse(true)}
              >
                Sim, deletar
              </button>
            </Dialog.Action>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
