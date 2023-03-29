import { PropsWithChildren } from "react";

interface Props {
  for: string;
  label?: string;
}

export default function InputWrapper(props: PropsWithChildren<Props>) {
  return (
    <div className='mb-2'>
      {props.label && (
        <label
          htmlFor={props.for}
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          {props.label}
        </label>
      )}
      <div className='mt-0.5'>{props.children}</div>
    </div>
  );
}
