import { PropsWithChildren } from "react";

interface Props {
  headersLength: number;
}

export default function TablePlaceholder(props: PropsWithChildren<Props>) {
  return (
    <>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
      <tr>
        <td
          colSpan={props.headersLength}
          className='whitespace-nowrap py-4 text-sm text-gray-900 sm:pl-6 pl-4 pr-3'
        >
          <span className='bi-placeholder bi-placeholder--large h-4 w-full block'></span>
        </td>
      </tr>
    </>
  );
}
