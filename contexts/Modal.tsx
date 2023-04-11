import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, createContext, useContext, useState } from 'react'

interface IModalCtx {
  isOpen: boolean
  toggleOpen: () => void
  message: React.ReactNode
  setMessage: (msg: React.ReactNode) => void
  status: 'loading' | 'success' | 'error'
  setStatus: (status: 'loading' | 'success' | 'error') => void
}

export const ModalCtx = createContext<IModalCtx>({} as IModalCtx)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [msg, setMsg] = useState<React.ReactNode>('')
  const handleStatuss = (status: 'loading' | 'success' | 'error') => {
    setStatus(status)
  }
  const handleMsg = (msg: React.ReactNode) => {
    setMsg(msg)
  }
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ModalCtx.Provider
      value={{
        isOpen,
        toggleOpen,
        message: msg,
        setMessage: handleMsg,
        setStatus: handleStatuss,
        status,
      }}
    >
      {children}
    </ModalCtx.Provider>
  )
}

export const ModalPopup = () => {
  const modalCtx = useContext(ModalCtx)
  return (
    <Transition show={modalCtx.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={modalCtx.toggleOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white py-12 px-9 text-center align-middle font-dm-sans shadow-xl transition-all">
                <div className="flex w-full flex-col gap-9 items-center">
                  <Image
                    alt="loading"
                    src={
                      modalCtx.status === 'loading'
                      ? '/loading.svg'
                      : modalCtx.status === 'success'
                      ? '/icons/success.svg'
                      : '/icons/error.svg'
                    }
                    height={100}
                    width={100}
                  />
                  <h4 className="text-2xl font-bold leading-5">
                    {modalCtx.message}
                  </h4>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
