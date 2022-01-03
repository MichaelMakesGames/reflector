import React, { ComponentProps, PropsWithChildren } from "react";
import ReactModal from "react-modal";

export default function Modal({
  children,
  overlayClassName = "inset-0 fixed h-screen w-screen bg-opaqueWhite z-20",
  className = "w-2/5 h-auto mx-auto my-8 shadow-2xl bg-black p-8 border border-white border-solid rounded max-h-modal z-20 overflow-auto",
  ...rest
}: PropsWithChildren<ComponentProps<typeof ReactModal>>) {
  return (
    <ReactModal
      overlayClassName={overlayClassName}
      className={className}
      {...rest}
    >
      {children}
    </ReactModal>
  );
}
