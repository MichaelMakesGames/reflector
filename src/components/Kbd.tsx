import React, { PropsWithChildren } from "react";

interface Props {
  className?: string;
}

export default function Kbd({ children, className }: PropsWithChildren<Props>) {
  return (
    <kbd
      className={`bg-darkGray text-white font-mono rounded px-1 pt-1 ${
        className || ""
      }`}
    >
      {children}
    </kbd>
  );
}
