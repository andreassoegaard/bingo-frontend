import { useMemo, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TablePlaceholder from "./TablePlaceholder";
import Modal from "./Modal";
import Button from "./Button";

interface DeleteModalOptions {
  title?: string;
  description?: string;
  loading?: boolean;
  deleteClick?(event?: any): void;
}

interface Options {
  fullWidth?: boolean;
  deleteModal?: DeleteModalOptions;
  editIdFetch?: number;
  editText?: string;
  rowClick?(event?: any): void;
}

interface Props {
  headers: any;
  data: any;
  loading: boolean;
  options?: Options;
  className?: any;
}

export default function Table(props: Props) {
  const { options = {} } = props;

  const [tempDeleteItem, setTempDeleteItem] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = (dataItem: any) => {
    setTempDeleteItem(dataItem);
    setShowDeleteModal(true);
  };

  const classNames = (...classes: any[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const hasDelete = useMemo(() => {
    if (
      props.headers.filter((item: any) => item.id === "delete").length === 1
    ) {
      return true;
    } else {
      return false;
    }
  }, [props.headers]);

  const hasEdit = useMemo(() => {
    if (props.headers.filter((item: any) => item.id === "edit").length === 1) {
      return true;
    } else {
      return false;
    }
  }, [props.headers]);

  const deleteHeader = useMemo(() => {
    const header = props.headers.filter((item: any) => item.id === "delete");
    if (header) {
      return header[0];
    } else {
      return null;
    }
  }, [props.headers]);

  const deleteItem = () => {
    if (options.deleteModal?.deleteClick) {
      options.deleteModal?.deleteClick(tempDeleteItem);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className={classNames(props.className, "flow-root")}>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div
            className={classNames(
              !options.fullWidth ? "sm:px-6 lg:px-8" : "",
              "inline-block min-w-full py-2 align-middle"
            )}
          >
            <div
              className={classNames(
                !options.fullWidth ? "sm:rounded-lg" : "",
                "overflow-hidden shadow ring-1 ring-black ring-opacity-5"
              )}
            >
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    {props.headers.map((header: any, index: any) => (
                      <th
                        key={index}
                        scope='col'
                        className={classNames(
                          index === 0 ? "sm:pl-6 pl-4 pr-3" : "px-3",
                          index === props.headers.length
                            ? "text-right"
                            : "text-left",
                          "py-3.5 text-left text-sm font-semibold text-gray-900"
                        )}
                      >
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {props.data.map((dataItem: any, index: any) => {
                    return (
                      <tr key={`trItem-${index}`}>
                        {props.headers.map((header: any, headerIndex: any) => {
                          return (
                            <td
                              key={`tdItem-${headerIndex}`}
                              className={classNames(
                                headerIndex === 0
                                  ? "sm:pl-6 pl-4 pr-3"
                                  : "px-3",
                                "whitespace-nowrap py-4 text-sm text-gray-900",
                                header.classes
                              )}
                            >
                              {(() => {
                                if (header.customContent) {
                                  return header.customContent(dataItem);
                                } else {
                                  {
                                    return dataItem[header.id];
                                  }
                                }
                              })()}
                            </td>
                          );
                        })}
                        {(hasDelete || hasEdit) && (
                          <td className='whitespace-nowrap py-4 pr-4 pl-3 text-sm text-balack text-right font-medium'>
                            <div className='flex items-center justify-end'>
                              {hasDelete &&
                                deleteHeader.show &&
                                deleteHeader.show(dataItem) && (
                                  <div
                                    onClick={() => toggleDeleteModal(dataItem)}
                                    className={classNames(
                                      "cursor-pointer text-red-600 hover:text-red-900",
                                      hasEdit ? "mr-4" : ""
                                    )}
                                  >
                                    Slet
                                  </div>
                                )}
                              {hasEdit &&
                                (options.editIdFetch === dataItem.id ? (
                                  <LoadingSpinner />
                                ) : (
                                  <div
                                    onClick={() =>
                                      options.rowClick
                                        ? options.rowClick(dataItem)
                                        : null
                                    }
                                    className='cursor-pointer text-indigo-600 hover:text-indigo-900'
                                  >
                                    {options.editText
                                      ? options.editText
                                      : "Rediger"}
                                  </div>
                                ))}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {props.loading && (
                    <>
                      <TablePlaceholder headersLength={props.headers.length} />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showDeleteModal}
        size='md'
        onClose={() => setShowDeleteModal(false)}
      >
        <div className='sm:flex sm:items-start'>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            <ExclamationTriangleIcon
              className='h-6 w-6 text-red-600'
              aria-hidden='true'
            />
          </div>
          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
            <Dialog.Title
              as='h3'
              className='text-base font-semibold leading-6 text-gray-900'
            >
              {options.deleteModal?.title ? (
                options.deleteModal?.title
              ) : (
                <span>Slet</span>
              )}
            </Dialog.Title>
            <div className='mt-2'>
              {options.deleteModal?.description ? (
                <p
                  className='text-sm text-gray-500'
                  dangerouslySetInnerHTML={{
                    __html: options.deleteModal.description,
                  }}
                />
              ) : (
                <p className='text-sm text-gray-500'>
                  Er du sikker på du ønsker at slette dette?
                  <br />
                  Det kan ikke fortrydes.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5'>
          <Button
            className='mr-2'
            style='white'
            onClick={() => setShowDeleteModal(false)}
          >
            Fortryd
          </Button>
          <Button
            style='red'
            loading={options.deleteModal?.loading}
            onClick={deleteItem}
          >
            Slet
          </Button>
        </div>
      </Modal>
    </>
  );
}
