import { PropsWithChildren } from "react";

interface Props {
  type: string;
  id: string;
  name: string;
  required: boolean;
  placeholder: string;
  value: any;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

export default function InputField(props: PropsWithChildren<Props>) {
  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type}
      autoComplete={props.name}
      required={props.required}
      placeholder={props.placeholder}
      value={props.value}
      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
      onChange={props.onChange}
    />
  );
}
