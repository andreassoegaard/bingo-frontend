import { PropsWithChildren } from "react";
import { useMemo } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  type?: "submit" | "button" | undefined;
  form?: string;
  style?: string;
  loading?: boolean;
  className?: string;
  error?: string;
  success?: string;
  onClick?(event: any): void;
}

export default function Button(props: PropsWithChildren<Props>) {
  const classNames = (...classes: string[]) => {
    return classes.join(" ");
  };
  const buttonClasses = useMemo(() => {
    const classes = [
      "bi-button",
      props.style ? `bi-button--style-${props.style}` : "",
    ];
    if (props.error) {
      classes.push("bi-button--error");
    }
    if (props.success) {
      classes.push("bi-button--success");
    }
    return classes.join(" ");
  }, [props.style, props.error, props.success]);

  const spinnerColor = useMemo(() => {
    if (props.style === "red") {
      return "red";
    } else {
      return "black";
    }
  }, [props.style]);

  const buttonText = useMemo(() => {
    if (props.error) {
      return props.error;
    } else if (props.success) {
      return props.success;
    } else {
      return props.children;
    }
  }, [props.error, props.success, props.children]);

  return (
    <button
      type={props.type}
      form={props.form}
      className={classNames(
        buttonClasses,
        props.className ? props.className : ""
      )}
      disabled={props.loading}
      onClick={props.onClick}
    >
      {props.loading && <LoadingSpinner color={spinnerColor} />}
      {buttonText}
    </button>
  );
}
