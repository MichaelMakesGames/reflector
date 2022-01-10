import React from "react";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

export default function MenuButton({ children, onClick }: Props) {
  return (
    <button
      data-menu-control
      type="button"
      className="btn text-xl mt-3 focus:border-red focus:outline-none focus:ring focus:ring-red"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
