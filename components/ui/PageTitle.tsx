import { PropsWithChildren, ReactNode } from "react";

interface Props {
  subtitle?: string;
  rightCol?: ReactNode;
}

export default function PageTitle(props: PropsWithChildren<Props>) {
  return (
    <>
      <div className='mb-6 flex justify-between items-start'>
        <div>
          <div className='text-xl font-semibold mb-1'>{props.children}</div>
          {props.subtitle && (
            <div className='text-sm text-gray-500'>{props.subtitle}</div>
          )}
        </div>
        {props.rightCol && props.rightCol}
      </div>
    </>
  );
}
