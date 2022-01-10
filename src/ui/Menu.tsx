import React, { useEffect, useRef } from "react";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";

export default function Menu({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const focusNext = () => {
    const focusedElement = document.activeElement;
    if (ref.current) {
      const focusableElements = Array.from(
        ref.current.querySelectorAll("[data-menu-control]")
      );
      if (focusedElement && focusableElements.includes(focusedElement)) {
        const focusedIndex = focusableElements.indexOf(focusedElement);
        if (focusedIndex !== -1) {
          (
            focusableElements[(focusedIndex + 1) % focusableElements.length] as
              | HTMLButtonElement
              | HTMLInputElement
              | HTMLSelectElement
          ).focus();
        }
      } else if (focusableElements.length) {
        (
          focusableElements[0] as
            | HTMLButtonElement
            | HTMLInputElement
            | HTMLSelectElement
        ).focus();
      }
    }
  };

  const focusPrevious = () => {
    const focusedElement = document.activeElement;
    if (ref.current) {
      const focusableElements = Array.from(
        ref.current.querySelectorAll("[data-menu-control]")
      );
      if (focusedElement && focusableElements.includes(focusedElement)) {
        const focusedIndex = focusableElements.indexOf(focusedElement);
        if (focusedIndex !== -1) {
          (
            focusableElements[
              (focusedIndex + focusableElements.length - 1) %
                focusableElements.length
            ] as HTMLButtonElement | HTMLInputElement | HTMLSelectElement
          ).focus();
        }
      } else if (focusableElements.length) {
        (
          focusableElements[focusableElements.length - 1] as
            | HTMLButtonElement
            | HTMLInputElement
            | HTMLSelectElement
        ).focus();
      }
    }
  };

  useEffect(focusNext, []);

  useControl({
    code: ControlCode.Down,
    group: HotkeyGroup.Menu,
    callback: focusNext,
  });

  useControl({
    code: ControlCode.Up,
    group: HotkeyGroup.Menu,
    callback: focusPrevious,
  });

  return (
    <div
      className={`${
        wide ? "w-96" : "w-72"
      } h-full overflow-y-auto overflow-x-visible pt-10 mx-auto flex flex-col`}
      ref={ref}
    >
      {children}
    </div>
  );
}
