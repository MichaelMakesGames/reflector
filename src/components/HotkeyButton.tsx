import React, { useContext } from "react";
import { ControlCode } from "~types/ControlCode";
import { HotkeyGroup, useControl } from "./HotkeysProvider";
import { SettingsContext } from "~contexts";
import Kbd from "./Kbd";

interface Props {
  label: string;
  className?: string;
  callback: () => void;
  controlCode: ControlCode;
  hotkeyGroup: HotkeyGroup;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export default function HotkeyButton({
  label,
  className,
  callback,
  controlCode,
  hotkeyGroup,
  disabled,
  style,
}: Props) {
  useControl({
    code: controlCode,
    group: hotkeyGroup,
    disabled,
    callback,

    // set ctrl, alt, and meta to false, but leave shift undefined so hotkeys like "?" can still work
    ctrl: false,
    alt: false,
    meta: false,
  });
  const settings = useContext(SettingsContext);
  return (
    <button
      className={`btn ${className || ""}`}
      type="button"
      style={style || {}}
      onClick={callback}
      disabled={disabled}
    >
      <Kbd>{settings.keyboardShortcuts[controlCode][0]}</Kbd> {label}
    </button>
  );
}
