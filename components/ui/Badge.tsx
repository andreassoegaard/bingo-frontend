import { PropsWithChildren } from "react";
import { useMemo } from "react";

interface Props {
  style?: string;
  className?: string;
}

export default function Badge(props: PropsWithChildren<Props>) {
  const classes = useMemo(() => {
    const classes = ["bi-badge", `bi-badge--${props.style}`, props.className];
    return classes.join(" ");
  }, [props.style, props.className]);

  return <span className={classes}>{props.children}</span>;
}
