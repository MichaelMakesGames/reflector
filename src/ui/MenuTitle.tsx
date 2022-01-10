import React from "react";
import { ControlCode } from "../types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import Icons from "./Icons";

export default function MenuTitle({
  children,
  goBack,
}: {
  children: React.ReactNode;
  goBack: () => void;
}) {
  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Menu,
    callback: goBack,
  });

  useControl({
    code: ControlCode.Menu,
    group: HotkeyGroup.Menu,
    callback: goBack,
  });

  return (
    <div className="relative">
      <h1 className="text-2xl text-center">
        {children}
        <hr className="shadow text-red shadow-red animate-pulse mt-1 mb-2" />
      </h1>
      <button
        className="h-6 w-6 my-1 absolute top-0"
        onClick={goBack}
        type="button"
        title="Back"
      >
        <Icons.ChevronLeft />
      </button>
    </div>
  );
}
