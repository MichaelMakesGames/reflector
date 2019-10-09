/* global document */
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

export interface Props {
  children: ReactNode;
}
export default function Modal({ children }: Props) {
  return createPortal(<div className="modal">{children}</div>, document.body);
}
