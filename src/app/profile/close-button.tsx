'use client'

import { X, XCircle } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

interface CloseButtomProps {
  onClick: (wasConfirmed: boolean) => void
}

export function CloseButton({ onClick }: CloseButtomProps) {
  function handleClick(value: boolean) {
    onClick(value)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <XCircle className="text-black" size={40} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black opacity-30 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className='className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <Dialog.Title className="text-black">
            Deseja realmente cancelar o agendamento?
          </Dialog.Title>
          <div className="flex gap-5 mt-5">
            <Dialog.Close className="w-full" asChild>
              <button
                onClick={() => handleClick(true)}
                className="h-10 w-full text-black bg-red-500 rounded-md"
              >
                Sim
              </button>
            </Dialog.Close>
            <Dialog.Close className="w-full" asChild>
              <button
                onClick={() => handleClick(false)}
                className="h-10 w-full text-black bg-blue-500 rounded-md"
              >
                Não
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-black hover:bg-violet-600 transition-all duration-300 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
