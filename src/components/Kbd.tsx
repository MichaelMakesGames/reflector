import React, { PropsWithChildren } from "react";

export default function Kbd({ children }: PropsWithChildren<{}>) {
  return (
    <kbd className="bg-darkGray text-white font-mono ml-1 rounded px-1 pt-1">
      {children}
    </kbd>
  );
}
