import { PropsWithChildren } from "react";

interface Props {
  title?: string;
}

export default function Box(props: PropsWithChildren<Props>) {
  return (
    <div className='bg-white shadow-sm rounded-md border border-gray-200 text-sm'>
      {props.title && (
        <div className='px-5 py-4 font-medium'>{props.title}</div>
      )}
      <div className='px-5 py-4'>{props.children}</div>
    </div>
  );
}
