import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose(event?: any): void;
  size: string;
  title?: string;
  subtitle?: string;
}

export default function Modal(props: PropsWithChildren<Props>) {
  const showHeader = useMemo(() => {
    if (props.title || props.subtitle) {
      return true;
    } else {
      return false;
    }
  }, [props.title, props.subtitle]);
  const modalSize = useMemo(() => {
    return `sm:max-w-${props.size}`;
  }, [props.size]);
  const dialogPanelClasses = useMemo(() => {
    const classes = [
      "relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6",
      modalSize,
    ];
    return classes.join(" ");
  }, [modalSize]);
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className={dialogPanelClasses}>
                {showHeader && (
                  <div className='mb-3'>
                    {props.title && (
                      <h3 className='text-base font-semibold leading-6 text-gray-900 mb-1'>
                        {props.title}
                      </h3>
                    )}
                    {props.subtitle && (
                      <div className='text-sm text-gray-400 mb-3'>
                        {props.subtitle}
                      </div>
                    )}
                  </div>
                )}
                {props.children}
                <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={() => props.onClose()}
                  >
                    <span className='sr-only'>Close</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
