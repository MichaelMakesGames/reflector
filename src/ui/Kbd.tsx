import React, { PropsWithChildren } from "react";

interface Props {
  className?: string;
  light?: boolean;
  noPad?: boolean;
}

export default function Kbd({
  children,
  className,
  light,
  noPad,
}: PropsWithChildren<Props>) {
  return (
    <kbd
      className={`${
        light ? "bg-gray" : "bg-darkGray"
      } text-white font-mono rounded px-1 ${noPad ? "" : "pt-1"} ${
        className || ""
      }`}
    >
      {children}
    </kbd>
  );
}
